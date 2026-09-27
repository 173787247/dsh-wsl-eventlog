import { runPowerShell } from "./wsl-host.js";
import { normalize, sinceIso } from "./eventlog.js";

/** The kit's one escaping rule: single-quote the value, doubling any apostrophe. */
function esc(s) {
  return "'" + String(s ?? "").replace(/'/g, "''") + "'";
}

function clamp(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/**
 * The script is built here, at the call site, the way every other plugin in the
 * kit does it: the PowerShell is written inline and the values are escaped as
 * they are interpolated. An earlier version of this file used a @@TOKEN@@
 * substitution table instead, which needed a template literal that ate the
 * backslashes in a regex and quoted every token twice.
 */
export function script(a) {
  return ((a) => `
$entries = Get-WinEvent -FilterHashtable @{ LogName = ${esc(a.log)}; Level = 1..${a.level} } -MaxEvents ${a.count} -ErrorAction SilentlyContinue
${a.provider ? `$entries = $entries | Where-Object { $_.ProviderName -eq ${esc(a.provider)} }` : ""}
${a.since ? `$cut = [datetime]::Parse(${esc(a.since)}); $entries = $entries | Where-Object { $_.TimeCreated -ge $cut }` : ""}
$list = $entries | ForEach-Object {
  $m = "$($_.Message)"
  @{ time = $_.TimeCreated.ToString('o'); level = $_.LevelDisplayName; provider = $_.ProviderName; id = $_.Id
     message = $m.Substring(0,[Math]::Min(${a.full ? 8000 : 300},$m.Length)) }
}
ConvertTo-Json -Compress -Depth 4 @{ entries = @($list) }`)(a);
}

export async function execute(args, config = {}) {
  const a = {
    name: typeof args?.name === "string" ? args.name : "",
    state: typeof args?.state === "string" ? args.state : "",
    log: typeof args?.log === "string" ? args.log : "System",
    path: typeof args?.path === "string" ? args.path : "",
    provider: typeof args?.provider === "string" ? args.provider : "",
    level: clamp(args?.level, 1, 5, 2),
    count: clamp(args?.count, 1, 200, 20),
    limit: clamp(args?.limit, 1, 400, 40),
    top: clamp(args?.top, 1, 40, 8),
    detail: Boolean(args?.detail),
    subkeys: Boolean(args?.subkeys),
    all: Boolean(args?.all),
    full: Boolean(args?.full),
    since: null,
  };
  a.since = sinceIso(args?.sinceMinutes);


  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
}
