// Public RSVP email requirement.
// Regression: new guest RSVPs previously accepted a missing or empty email,
// even though the guest experience requires a contact address for every status.
// Keep this rule at the shared schema boundary so direct Server Action calls
// cannot bypass the requirement.

import { describe, it, expect } from "vitest";
import { AddRsvpSchema, UpdateRsvpSchema } from "@/lib/schemas";

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
      expect(() => AddRsvpSchema.parse({ ...base, status, guestEmail: "not-an-email" })).toThrow();

      const parsed = AddRsvpSchema.parse({
        ...base,
        status,
        guestEmail: " Alice@Example.com ",
        ...(status === "GOING"
          ? { guestPhone: "+31612345678", guestAddress: "Dorpsstraat 12, 1234 AB" }
          : {}),
      });
      expect(parsed.guestEmail).toBe("alice@example.com");
    }
  );

  it("requires a phone number and postal address only for GOING", () => {
    const going = {
      ...base,
      status: "GOING" as const,
      guestEmail: "alice@example.com",
    };
    expect(() => AddRsvpSchema.parse(going)).toThrow();
    expect(() => AddRsvpSchema.parse({ ...going, guestPhone: "+31612345678" })).toThrow();
    expect(() =>
      AddRsvpSchema.parse({ ...going, guestAddress: "Dorpsstraat 12, 1234 AB" })
    ).toThrow();

    const validGoing = AddRsvpSchema.parse({
      ...going,
      guestPhone: "+31612345678",
      guestAddress: "Dorpsstraat 12, 1234 AB",
    });
    expect(validGoing.guestPhone).toBe("+31612345678");
    expect(validGoing.guestAddress).toBe("Dorpsstraat 12, 1234 AB");
  });

  it("requires phone and postal address for GOING RSVP edits too", () => {
    expect(() => UpdateRsvpSchema.parse({ status: "GOING", plusOneCount: 0 })).toThrow();
    expect(() =>
      UpdateRsvpSchema.parse({
        status: "GOING",
        plusOneCount: 0,
        guestPhone: "+31612345678",
      })
    ).toThrow();
    expect(() =>
      UpdateRsvpSchema.parse({
        status: "GOING",
        plusOneCount: 0,
        guestAddress: "Dorpsstraat 12, 1234 AB",
      })
    ).toThrow();
    expect(
      UpdateRsvpSchema.parse({
        status: "GOING",
        plusOneCount: 0,
        guestPhone: "+31612345678",
        guestAddress: "Dorpsstraat 12, 1234 AB",
      }).guestAddress
    ).toBe("Dorpsstraat 12, 1234 AB");
  });

  it("keeps phone number and postal address optional for MAYBE and NO", () => {
    for (const status of ["MAYBE", "NO"] as const) {
      const parsed = AddRsvpSchema.parse({
        ...base,
        status,
        guestEmail: "alice@example.com",
      });
      expect(parsed.guestPhone).toBeUndefined();
      expect(parsed.guestAddress).toBeUndefined();
    }
  });
});
