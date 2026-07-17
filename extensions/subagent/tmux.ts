/**
 * tmux session/window management for visible subagent panes.
 *
 * All subagent_tmux invocations share one tmux session (SESSION_NAME), one
 * window per invocation, so `tmux attach -t pi-subagents` shows every
 * running/finished subagent as its own tab.
 */

import { spawn } from "node:child_process";

export const SESSION_NAME = "pi-subagents";

function run(args: string[]): Promise<{ code: number; stderr: string }> {
	return new Promise((resolve) => {
		const proc = spawn("tmux", args, { stdio: ["ignore", "ignore", "pipe"] });
		let stderr = "";
		proc.stderr.on("data", (d) => {
			stderr += d.toString();
		});
		proc.on("close", (code) => resolve({ code: code ?? 1, stderr }));
		proc.on("error", (err) => resolve({ code: 1, stderr: err.message }));
	});
}

export async function isTmuxAvailable(): Promise<boolean> {
	const { code } = await run(["-V"]);
	return code === 0;
}

async function sessionExists(): Promise<boolean> {
	const { code } = await run(["has-session", "-t", SESSION_NAME]);
	return code === 0;
}

/**
 * Opens a new tmux window running `command args...`, creating the shared
 * session on first use (with this window as its first window, so there's
 * no dangling placeholder window).
 */
export async function openWindow(
	windowName: string,
	command: string,
	args: string[],
	cwd: string,
): Promise<{ ok: boolean; error?: string }> {
	// ponytail: tmux's `remain-on-exit` window option races a fast-exiting
	// command (the window — and, if it's the last one, the session and
	// server, since exit-empty defaults on — can tear down before the
	// option takes effect). Idling in the shell after the real command
	// exits sidesteps that entirely: the pane simply never dies on its own.
	const wrapped = [
		"sh",
		"-c",
		'"$@"; status=$?; echo; echo "[exited $status] — pane stays open, close it manually"; exec sleep 2147483647',
		"_",
		command,
		...args,
	];

	const exists = await sessionExists();
	const tmuxArgs = exists
		? ["new-window", "-t", SESSION_NAME, "-n", windowName, "-c", cwd, "--", ...wrapped]
		: ["new-session", "-d", "-s", SESSION_NAME, "-n", windowName, "-c", cwd, "--", ...wrapped];
	const { code, stderr } = await run(tmuxArgs);
	if (code !== 0) return { ok: false, error: stderr || `tmux exited with code ${code}` };
	return { ok: true };
}

export function attachHint(windowName: string): string {
	return `tmux attach -t ${SESSION_NAME} \\; select-window -t ${SESSION_NAME}:${windowName}`;
}
