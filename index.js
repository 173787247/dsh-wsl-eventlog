import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/eventlog.js";
import { execute } from "./lib/eventlog-exec.js";

export const name = "dsh-wsl-eventlog";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_eventlog",
    order: 216,
    text: "Use win_eventlog for WSL/Windows interop: Read recent Windows event log entries from WSL, by log name and level.",
  });

  ctx.tools.register({
    name: "win_eventlog",
    description: "Read recent Windows event log entries from WSL, by log name and level.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_eventlog" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_eventlog", content: result?.content }),
  });
}
