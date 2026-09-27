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
