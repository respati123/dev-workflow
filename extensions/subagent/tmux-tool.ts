/**
 * subagent_tmux — delegates a task to a subagent running visibly in its own
 * tmux pane, instead of headless like the `subagent` tool in index.ts. The
 * pane runs `pi --mode rpc` (see tmux-bridge.ts); this tool is the RPC
 * client on the other end of a Unix socket, so it can watch progress live
 * and, on abort, tell the pane to stop.
 *
 * Complements, doesn't replace, `subagent`: use this one when the human
 * should be able to watch (or later attach and steer) the subagent live.
 */

import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as net from "node:net";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { withFileMutationQueue } from "@earendil-works/pi-coding-agent";
import { Text } from "@earendil-works/pi-tui";
import { Type } from "typebox";
import { discoverAgents } from "./agents.ts";
import { attachHint, isTmuxAvailable, openWindow } from "./tmux.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRIDGE_PATH = path.join(__dirname, "tmux-bridge.ts");
const CONNECT_TIMEOUT_MS = 15000;

async function writeTempFile(name: string, content: string): Promise<string> {
	const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "pi-subagent-tmux-"));
	const filePath = path.join(dir, name);
	await withFileMutationQueue(filePath, async () => {
		await fs.promises.writeFile(filePath, content, { encoding: "utf-8", mode: 0o600 });
	});
	return filePath;
}

const Params = Type.Object({
	agent: Type.String({ description: "Name of the agent to invoke" }),
	task: Type.String({ description: "Task to delegate to the agent" }),
	cwd: Type.Optional(Type.String({ description: "Working directory for the agent process" })),
	agentScope: Type.Optional(
		Type.String({ description: 'Which agent directories to use: "user", "project", or "both". Default: "user".' }),
	),
});

export function registerTmuxSubagentTool(pi: ExtensionAPI) {
	pi.registerTool({
		name: "subagent_tmux",
		label: "Subagent (tmux)",
		description: [
			"Delegate a task to a subagent running visibly in its own tmux pane",
			'(shared session "pi-subagents"), instead of headless like the "subagent" tool.',
			"Use when the human should be able to watch the subagent live.",
			"The pane stays open after the task finishes so its output can be reviewed.",
			"Single-task mode only — no parallel/chain support (use `subagent` for those).",
		].join(" "),
		parameters: Params,

		// biome-ignore lint/suspicious/noExplicitAny: onUpdate/ctx typed generically by the tool SDK
		async execute(_toolCallId, params: any, signal: AbortSignal | undefined, onUpdate: any, ctx: any) {
			const scope = params.agentScope ?? "user";
			const { agents } = discoverAgents(ctx.cwd, scope);
			const agent = agents.find((a) => a.name === params.agent);
			if (!agent) {
				const available = agents.map((a: { name: string }) => a.name).join(", ") || "none";
				return {
					content: [{ type: "text", text: `Unknown agent: "${params.agent}". Available: ${available}` }],
					isError: true,
				};
			}

			if (!(await isTmuxAvailable())) {
				return {
					content: [
						{
							type: "text",
							text: "tmux is not installed or not on PATH. Install tmux to use subagent_tmux, or use the headless \"subagent\" tool instead.",
						},
					],
					isError: true,
				};
			}

			const id = crypto.randomBytes(4).toString("hex");
			const windowName = `${agent.name}-${id}`.replace(/[^\w.-]+/g, "_");
			const cwd = params.cwd ?? ctx.cwd;
			const socketPath = path.join(os.tmpdir(), `pi-subagent-${id}.sock`);
			try {
				fs.rmSync(socketPath, { force: true });
			} catch {
				/* ignore */
			}

			const taskFile = await writeTempFile("task.md", params.task);
			const systemPromptFile = agent.systemPrompt.trim() ? await writeTempFile("system-prompt.md", agent.systemPrompt) : null;

			const bridgeArgs = ["--socket", socketPath, "--task-file", taskFile, "--label", agent.name];
			if (systemPromptFile) bridgeArgs.push("--system-prompt-file", systemPromptFile);
			if (agent.model) bridgeArgs.push("--model", agent.model);
			if (agent.tools && agent.tools.length > 0) bridgeArgs.push("--tools", agent.tools.join(","));

			const server = net.createServer();
			const connectionPromise = new Promise<net.Socket>((resolve, reject) => {
				const timer = setTimeout(() => {
					reject(new Error("Timed out waiting for the tmux pane to connect"));
				}, CONNECT_TIMEOUT_MS);
				server.once("connection", (sock) => {
					clearTimeout(timer);
					resolve(sock);
				});
				server.once("error", (err) => {
					clearTimeout(timer);
					reject(err);
				});
			});
			server.listen(socketPath);

			const opened = await openWindow(windowName, process.execPath, [BRIDGE_PATH, ...bridgeArgs], cwd);
			if (!opened.ok) {
				server.close();
				return { content: [{ type: "text", text: `Failed to open tmux pane: ${opened.error}` }], isError: true };
			}

			const attach = attachHint(windowName);

			let sock: net.Socket;
			try {
				sock = await connectionPromise;
			} catch (err) {
				server.close();
				return {
					content: [
						{
							type: "text",
							text: `Subagent pane opened but never connected (${(err as Error).message}). Check it manually: ${attach}`,
						},
					],
					isError: true,
				};
			}

			if (signal) {
				const onAbort = () => {
					if (!sock.destroyed) sock.write(`${JSON.stringify({ type: "abort" })}\n`);
				};
				if (signal.aborted) onAbort();
				else signal.addEventListener("abort", onAbort, { once: true });
			}

			let output = "";
			let toolCount = 0;
			let settled = false;

			await new Promise<void>((resolve) => {
				let buffer = "";
				sock.on("data", (data) => {
					buffer += data.toString();
					const lines = buffer.split("\n");
					buffer = lines.pop() ?? "";
					for (const line of lines) {
						if (!line.trim()) continue;
						// biome-ignore lint/suspicious/noExplicitAny: relaying pi's own RPC event shapes
						let event: any;
						try {
							event = JSON.parse(line);
						} catch {
							continue;
						}
						if (event.type === "turn_end") {
							// biome-ignore lint/suspicious/noExplicitAny: AgentMessage content parts
							const text = event.message?.content?.find((c: any) => c.type === "text")?.text;
							if (text) output = text;
							onUpdate?.({ content: [{ type: "text", text: output || "(running...)" }] });
						} else if (event.type === "tool_execution_end") {
							toolCount++;
							onUpdate?.({
								content: [
									{
										type: "text",
										text: `${output || "(running...)"}\n\n(${toolCount} tool call${toolCount === 1 ? "" : "s"} so far)`,
									},
								],
							});
						} else if (event.type === "agent_settled") {
							settled = true;
							resolve();
						} else if (event.type === "bridge_closed") {
							resolve();
						}
					}
				});
				sock.on("close", () => resolve());
				sock.on("error", () => resolve());
			});

			server.close();

			const summary = settled
				? `${output || "(no output)"}\n\n${toolCount} tool call${toolCount === 1 ? "" : "s"}. Pane: ${attach}`
				: `Subagent pane disconnected before finishing. Check it: ${attach}`;

			return { content: [{ type: "text", text: summary }], isError: !settled };
		},

		// biome-ignore lint/suspicious/noExplicitAny: theme typed generically by the tool SDK
		renderCall(args: any, theme: any) {
			const preview = args.task && args.task.length > 60 ? `${args.task.slice(0, 60)}...` : args.task;
			return new Text(
				`${theme.fg("toolTitle", theme.bold("subagent_tmux "))}${theme.fg("accent", args.agent || "...")}\n  ${theme.fg("dim", preview ?? "...")}`,
				0,
				0,
			);
		},

		renderResult(result: { content: Array<{ type: string; text?: string }> }) {
			const text = result.content[0];
			return new Text(text?.type === "text" ? (text.text ?? "") : "(no output)", 0, 0);
		},
	});
}
