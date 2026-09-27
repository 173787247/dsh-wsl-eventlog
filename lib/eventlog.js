// Pure side of eventlog: normalisation and formatting, testable without Windows.
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

export function normalize(raw) {
  return ((raw) => ({
      entries: (raw.entries || []).map((e) => ({
        time: String(e.time ?? ""), level: String(e.level ?? ""), provider: String(e.provider ?? ""),
        id: num(e.id), message: String(e.message ?? ""),
      })),
    }))(raw ?? {});
}

// Dispatch on the shape of the result rather than making the caller say which
// formatter to use: a result carries either `detail`, or `subkeys`, or neither.
export function format(v) {
  const withOk = { ok: true, ...v };
  if (withOk.detail && typeof formatDetail === "function") return formatDetail(withOk);
  if (withOk.subkeys && typeof formatKeys === "function") return formatKeys(withOk);
  return ((v) => {
      const l = [`win_eventlog ok=${v.ok} entries=${(v.entries || []).length}`];
      for (const e of v.entries || []) l.push(`  ${e.time.slice(0, 19)} [${e.level}] ${e.provider}(${e.id}) ${e.message.slice(0, 90)}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })(withOk);
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
      "type": "number",
      "description": "Minimum level: 1 critical, 2 error, 3 warning, 4 information (default 2)."
    },
    "count": {
      "type": "number",
      "description": "How many entries (default 20, max 200)."
    },
    "provider": {
      "type": "string",
      "description": "Only entries from this provider."
    },
    "sinceMinutes": {
      "type": "number",
      "description": "Only entries newer than this many minutes ago."
    },
    "full": {
      "type": "boolean",
      "description": "Return the whole message instead of the first 300 characters."
    }
  }
};
}

export function outputSchema() {
  return { type: "object", additionalProperties: true };
}

/** A log with no lower bound is a log you page through by guessing. */
export function sinceIso(minutes, now = Date.now()) {
  const n = Number(minutes);
  if (!Number.isFinite(n) || n <= 0) return null;
  return new Date(now - Math.min(Math.trunc(n), 43200) * 60_000).toISOString();
}
