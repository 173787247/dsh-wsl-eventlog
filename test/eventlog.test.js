import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalize, format, parameters } from "../lib/eventlog.js";

describe("eventlog", () => {
  it("normalises an entry", () => {
    const v = normalize({ entries: [{ time: "2026-01-01T00:00:00Z", level: "Error", provider: "P", id: 7, message: "m" }] });
    assert.equal(v.entries[0].id, 7);
    assert.equal(v.entries[0].provider, "P");
  });
  it("defaults absent entries to an empty array", () => {
    assert.deepEqual(normalize({}).entries, []);
  });
  it("summarises the entry count", () => {
    const out = format(normalize({ entries: [{ time: "T", level: "Error", provider: "P", id: 1, message: "m" }] }));
    assert.match(out, /entries=1/);
  });
});

// ── windowing and provider filtering, added after the first release ─────────
import { sinceIso } from "../lib/eventlog.js";

describe("sinceIso", () => {
  it("returns an ISO timestamp the given minutes back", () => {
    const now = Date.parse("2026-01-01T00:00:00Z");
    assert.equal(sinceIso(60, now), "2025-12-31T23:00:00.000Z");
  });
  it("refuses a non-positive window", () => {
    assert.equal(sinceIso(0), null);
    assert.equal(sinceIso(-5), null);
    assert.equal(sinceIso("x"), null);
  });
  it("caps the window at 30 days", () => {
    const now = Date.parse("2026-03-01T00:00:00Z");
    assert.equal(sinceIso(999999, now), "2026-01-30T00:00:00.000Z");
  });
});
