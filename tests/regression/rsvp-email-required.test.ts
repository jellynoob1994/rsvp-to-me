// Public RSVP email requirement.
// Regression: new guest RSVPs previously accepted a missing or empty email,
// even though the guest experience requires a contact address for every status.
// Keep this rule at the shared schema boundary so direct Server Action calls
// cannot bypass the requirement.

import { describe, it, expect } from "vitest";
import { AddRsvpSchema } from "@/lib/schemas";

const base = {
  eventId: "evt-1",
  guestName: "Alice",
  plusOneCount: 0,
};

describe("public RSVP email requirement", () => {
  it.each(["GOING", "MAYBE", "NO"] as const)(
    "requires a valid email for %s responses",
    (status) => {
      expect(() => AddRsvpSchema.parse({ ...base, status })).toThrow();
      expect(() => AddRsvpSchema.parse({ ...base, status, guestEmail: "" })).toThrow();
      expect(() =>
        AddRsvpSchema.parse({ ...base, status, guestEmail: "not-an-email" })
      ).toThrow();

      const parsed = AddRsvpSchema.parse({
        ...base,
        status,
        guestEmail: " Alice@Example.com ",
      });
      expect(parsed.guestEmail).toBe("alice@example.com");
    }
  );

  it("does not require a phone number", () => {
    const parsed = AddRsvpSchema.parse({
      ...base,
      status: "GOING",
      guestEmail: "alice@example.com",
    });
    expect(parsed.guestPhone).toBeUndefined();
  });
});
