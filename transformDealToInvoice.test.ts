import { describe, it, expect, vi } from "vitest";
import { transformDealToInvoice } from "../src/transformDealToInvoice";

describe("transformDealToInvoice", () => {
  const company = { name: "Cloudify Ltd" };

  const deal = {
    properties: {
      dealname: " Test Deal ",
      closedate: "2026-06-23T10:00:00Z",
      deal_currency_code: "USD",
    },
  };

  const lineItems = [
    {
      quantity: 2,
      price: 100.567,
      name: "Subscription",
    },
  ];

  it("should transform valid payload", () => {
    const result = transformDealToInvoice(
      deal,
      lineItems,
      company
    );

    expect(result.Reference).toBe("Test Deal");
    expect(result.Date).toBe("2026-06-23");
    expect(result.Contact.Name).toBe("Cloudify Ltd");
    expect(result.CurrencyCode).toBe("USD");
  });

  it("should throw when company missing", () => {
    expect(() =>
      transformDealToInvoice(deal, lineItems, null)
    ).toThrow("Associated company is required");
  });

  it("should reject unsupported currency", () => {
    deal.properties.deal_currency_code = "XYZ";

    expect(() =>
      transformDealToInvoice(deal, lineItems, company)
    ).toThrow("Unsupported currency");
  });

  it("should default quantity to 1", () => {
    const warnSpy = vi.spyOn(console, "warn");

    const result = transformDealToInvoice(
      deal,
      [{ quantity: null, price: 50, name: "Test" }],
      company
    );

    expect(result.LineItems[0].Quantity).toBe(1);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("should round amount to 2 decimals", () => {
    const result = transformDealToInvoice(
      deal,
      [{ quantity: 1, price: 10.1299, name: "Test" }],
      company
    );

    expect(result.LineItems[0].UnitAmount).toBe(10.13);
  });

  it("should fail if line item description empty", () => {
    expect(() =>
      transformDealToInvoice(
        deal,
        [{ quantity: 1, price: 10, name: "" }],
        company
      )
    ).toThrow("Line item description required");
  });
});
