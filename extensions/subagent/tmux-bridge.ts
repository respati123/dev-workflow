#!/usr/bin/env bun
/**
 * Runs standalone inside a tmux pane (spawned by tmux-tool.ts, not loaded
 * as a pi extension). Spawns `pi --mode rpc` for one task, renders a
 * human-readable view of it in the pane, and relays the RPC protocol
 * verbatim over a Unix socket back to the parent tool — no translation, so
 * the parent just speaks the protocol documented for `pi --mode rpc`.
 *
 * ponytail: assumes the runtime that can execute this .ts file directly is
 * Bun (same as pi itself, per the bun-virtual-script check in index.ts's
 * getPiInvocation). Add a compiled JS fallback if this ever needs to run
 * under plain Node.
 */

import { spawn } from "node:child_process";
import * as fs from "node:fs";
import * as net from "node:net";
import { parseArgs } from "node:util";

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

const { values } = parseArgs({
	options: {
		socket: { type: "string" },
		"task-file": { type: "string" },
		"system-prompt-file": { type: "string" },
		label: { type: "string" },
		model: { type: "string" },
		tools: { type: "string" },
	},
});

const socketPath = values.socket;
const taskFile = values["task-file"];
if (!socketPath || !taskFile) {
	console.error("tmux-bridge: --socket and --task-file are required");
	process.exit(1);
}

const task = fs.readFileSync(taskFile, "utf-8");
const label = values.label ?? "subagent";

console.log(`${BOLD}${CYAN}▶ ${label}${RESET}${DIM} — pi --mode rpc${RESET}\n`);

const piArgs = ["--mode", "rpc", "--no-session"];
if (values.model) piArgs.push("--model", values.model);
if (values.tools) piArgs.push("--tools", values.tools);
if (values["system-prompt-file"]) piArgs.push("--append-system-prompt", values["system-prompt-file"]);

const child = spawn("pi", piArgs, { stdio: ["pipe", "pipe", "pipe"] });

let socket: net.Socket | null = null;
const pendingToSocket: string[] = [];

function sendToSocket(line: string) {
	if (socket && !socket.destroyed) socket.write(line);
	else pendingToSocket.push(line);
}

function handleSocketData(data: Buffer, bufferRef: { buf: string }) {
	bufferRef.buf += data.toString();
	const lines = bufferRef.buf.split("\n");
	bufferRef.buf = lines.pop() ?? "";
	for (const line of lines) {
		if (!line.trim()) continue;
		// Pure relay: parent already speaks pi's RPC command protocol.
		child.stdin.write(`${line}\n`);
	}
}

function connectWithRetry(attempt = 0) {
	const bufferRef = { buf: "" };
	const s = net.createConnection(socketPath!, () => {
		socket = s;
		for (const line of pendingToSocket.splice(0)) s.write(line);
		child.stdin.write(`${JSON.stringify({ id: "task-1", type: "prompt", message: task })}\n`);
	});
	s.on("data", (data) => handleSocketData(data, bufferRef));
	s.on("error", () => {
		if (attempt < 25) setTimeout(() => connectWithRetry(attempt + 1), 200);
		else console.error(`${RED}[bridge] could not connect to parent socket after retries${RESET}`);
	});
	s.on("close", () => {
		if (socket === s) socket = null;
	});
}
connectWithRetry();

let childBuffer = "";
child.stdout.on("data", (data) => {
	childBuffer += data.toString();
	const lines = childBuffer.split("\n");
	childBuffer = lines.pop() ?? "";
	for (const line of lines) {
		if (!line.trim()) continue;
		sendToSocket(`${line}\n`);
		render(line);
	}
});

child.stderr.on("data", (data) => {
	process.stderr.write(`${DIM}[pi stderr] ${data.toString()}${RESET}`);
});

child.on("close", (code) => {
	console.log(`\n${DIM}── pi exited (code ${code}) — pane stays open, close it manually ──${RESET}`);
	sendToSocket(`${JSON.stringify({ type: "bridge_closed", code })}\n`);
});

// biome-ignore lint/suspicious/noExplicitAny: relaying pi's own RPC event shapes
function render(line: string) {
	let event: any;
	try {
		event = JSON.parse(line);
	} catch {
		return;
	}
	switch (event.type) {
		case "turn_end": {
			// biome-ignore lint/suspicious/noExplicitAny: AgentMessage content parts
			const text = event.message?.content?.find((c: any) => c.type === "text")?.text;
			if (text) console.log(`${text}\n`);
			break;
		}
		case "tool_execution_start": {
			const argsPreview = JSON.stringify(event.args ?? {});
			console.log(`${DIM}→ ${event.toolName} ${argsPreview.slice(0, 80)}${RESET}`);
			break;
		}
		case "tool_execution_end":
			console.log(`${event.isError ? `${RED}✗` : `${GREEN}✓`} ${event.toolName}${RESET}`);
			break;
		case "agent_settled":
			console.log(`${BOLD}${GREEN}✓ done${RESET}`);
			break;
		case "response":
			if (event.success === false)
				console.log(`${RED}[error] ${event.command}: ${JSON.stringify(event.data ?? "")}${RESET}`);
			break;
		default:
			break;
	}
}

process.on("SIGINT", () => {
	child.kill("SIGTERM");
	process.exit(0);
});
