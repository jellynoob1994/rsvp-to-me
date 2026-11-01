import { describe, it, expect } from "vitest";
import { serializeGuestRsvp } from "@/lib/guestList";

const rsvp = {
  id: "rsvp-1",
  guestName: "Ada",
  guestEmail: "ada@example.com",
  guestPhone: "+31612345678",
  guestAddress: "Dorpsstraat 12, 1234 AB",
  status: "GOING" as const,
  plusOneCount: 0,
  note: null,
  createdAt: new Date("2026-11-01T12:00:00.000Z"),
  answers: [],
  plusOneGuests: [],
  editToken: "secret-edit-token",
  user: null,
};

describe("serializeGuestRsvp private contact data", () => {
  it("makes postal address available to the host", () => {
    expect(serializeGuestRsvp(rsvp, true).guestAddress).toBe("Dorpsstraat 12, 1234 AB");
  });

  it("strips postal address, phone, email and edit token for guests", () => {
    const serialized = serializeGuestRsvp(rsvp, false);
    expect(serialized.guestAddress).toBeNull();
    expect(serialized.guestPhone).toBeNull();
    expect(serialized.guestEmail).toBeNull();
    expect(serialized.editToken).toBe("");
  });
});
