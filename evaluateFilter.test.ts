import { describe, it, expect } from "vitest";
import { evaluateFilter } from "../src/evaluateFilter";

describe("CEL Filter", () => {

  it("should pass valid deal", () => {
    const deal = {
      stage: "closed_won",
      region: "Europe",
      line_items: [{ id: 1 }]
    };

    expect(evaluateFilter(deal)).toBe(true);
  });

  it("should fail wrong stage", () => {
    const deal = {
      stage: "closed_lost",
      region: "Europe",
      line_items: [{ id: 1 }]
    };

    expect(evaluateFilter(deal)).toBe(false);
  });

  it("should fail empty line items", () => {
    const deal = {
      stage: "closed_won",
      region: "Europe",
      line_items: []
    };

    expect(evaluateFilter(deal)).toBe(false);
  });

  it("should fail non-europe region", () => {
    const deal = {
      stage: "closed_won",
      region: "USA",
      line_items: [{ id: 1 }]
    };

    expect(evaluateFilter(deal)).toBe(false);
  });

  it("should fail when fields missing", () => {
    expect(evaluateFilter({})).toBe(false);
  });

  it("should fail multiple conditions", () => {
    const deal = {
      stage: "closed_lost",
      region: "Asia",
      line_items: []
    };

    expect(evaluateFilter(deal)).toBe(false);
  });

});
