import { describe, it, expect, vi } from "vitest";
import { reRun } from "../src/reRun";

describe("Workflow ReRun", () => {

  it("should reject unauthenticated users", async () => {
    await expect(
      reRun(null, { id: 1 })
    ).rejects.toThrow("Unauthorized");
  });

  it("should reject viewer role", async () => {
    const user = { role: "Viewer" };

    await expect(
      reRun(user, { id: 1 })
    ).rejects.toThrow("Forbidden");
  });

  it("should validate numeric id", async () => {
    const user = { role: "Editor" };

    await expect(
      reRun(user, { id: "abc" })
    ).rejects.toThrow();
  });

  it("should reset run status", async () => {
    const user = { role: "Editor" };

    const result = await reRun(user, { id: 1 });

    expect(result.status).toBe("PENDING");
  });

  it("should create workflow attempt", async () => {
    const user = { role: "Editor" };

    const createAttemptSpy = vi.fn();

    await reRun(
      user,
      { id: 1 },
      { createAttempt: createAttemptSpy }
    );

    expect(createAttemptSpy).toHaveBeenCalled();
  });

  it("should enqueue SQS event", async () => {
    const enqueueSpy = vi.fn();

    await reRun(
      { role: "Editor" },
      { id: 1 },
      { enqueue: enqueueSpy }
    );

    expect(enqueueSpy).toHaveBeenCalled();
  });

  it("should support custom event", async () => {
    const result = await reRun(
      { role: "Editor" },
      {
        id: 1,
        customEvent: {
          source: "manual"
        }
      }
    );

    expect(result).toBeDefined();
  });

  it("should rerun succeeded workflow", async () => {
    const result = await reRun(
      { role: "Editor" },
      { id: 1 }
    );

    expect(result.status).toBe("PENDING");
  });

});
