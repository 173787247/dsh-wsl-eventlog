// Pure side of dsh-wsl-eventlog: normalisation and formatting, testable without Windows.
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

export function normalize(raw) {
  return ((raw) => ({
      entries: (raw.entries || []).map((e) => ({
        time: String(e.time ?? ""), level: String(e.level ?? ""), provider: String(e.provider ?? ""),
        id: num(e.id), message: String(e.message ?? ""),
      })),
    }))(raw ?? {});
}

export function format(v) {
  return ((v) => {
      const l = [`win_eventlog ok=${v.ok} entries=${(v.entries || []).length}`];
      for (const e of v.entries || []) l.push(`  ${e.time.slice(0, 19)} [${e.level}] ${e.provider}(${e.id}) ${e.message.slice(0, 90)}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })({ ok: true, ...v });
}

export function parameters() {
  return {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "log": {
      "type": "string",
      "description": "Log name (default System)."
    },
    "level": {
      "type": "string",
      "description": "Minimum level: 1 critical, 2 error, 3 warning, 4 information (default 2)."
    },
    "count": {
      "type": "number",
      "description": "How many entries (default 20, max 200)."
    }
  }
};
}

export function outputSchema() {
  return { type: "object", additionalProperties: true };
}
