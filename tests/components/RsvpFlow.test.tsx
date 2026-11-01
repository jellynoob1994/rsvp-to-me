// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { testTheme } from "./helpers/theme";

const { mockAddRSVP, mockUpdateRSVP, mockUpdateRsvpAsHost } = vi.hoisted(() => ({
  mockAddRSVP: vi.fn(),
  mockUpdateRSVP: vi.fn(),
  mockUpdateRsvpAsHost: vi.fn(),
}));

vi.mock("@/app/actions/event", () => ({
  addRSVP: mockAddRSVP,
  updateRSVP: mockUpdateRSVP,
  updateRsvpAsHost: mockUpdateRsvpAsHost,
}));

import { RsvpFlow } from "@/components/rsvp/RsvpFlow";

const baseEvent = {
  id: "event-1",
  slug: "test-party",
  title: "Test Party",
  startAt: new Date("2030-12-01T20:00:00Z"),
  endAt: null,
  timezone: "America/New_York",
  locationName: "My House",
  plusOneAllowed: false,
  plusOneMax: 0,
  plusOneNamesRequired: false,
  maybeEnabled: true,
  questionnaireEnabled: false,
  rsvpFields: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("RsvpFlow — Dutch plus-one labels", () => {
  it("renders the plus-one count and name fields in Dutch", () => {
    const { container } = render(
      <RsvpFlow
        event={{
          ...baseEvent,
          plusOneAllowed: true,
          plusOneMax: 2,
          plusOneNamesRequired: true,
        }}
        theme={testTheme}
        initialStatus="GOING"
        sessionUser={null}
      />
    );

    const countSelect = container.querySelector("select");
    expect(countSelect).not.toBeNull();
    fireEvent.change(countSelect!, { target: { value: "2" } });

    expect(
      screen.getByRole("option", { name: "2 (2 personen — ik + 1 introducé)" })
    ).toBeInTheDocument();
    expect(screen.getByText("Namen van introducés")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Naam van introducé 1 (verplicht)")).toBeInTheDocument();
    expect(
      screen.getByText("Let op: de namen van introducés zijn openbaar zichtbaar.")
    ).toBeInTheDocument();
    expect(screen.getByText("Bericht (optioneel — openbaar zichtbaar)")).toBeInTheDocument();
  });
});

describe("RsvpFlow — new RSVP", () => {
  it("renders Going, Maybe, and Can't go buttons", () => {
    render(
      <RsvpFlow event={baseEvent} theme={testTheme} initialStatus="GOING" sessionUser={null} />
    );
    expect(screen.getByText("Aanwezig")).toBeInTheDocument();
    expect(screen.getByText("Misschien")).toBeInTheDocument();
    expect(screen.getByText("Afwezig")).toBeInTheDocument();
  });

  it("uses the shared 600px event width for the RSVP flow", () => {
    render(
      <RsvpFlow event={baseEvent} theme={testTheme} initialStatus="GOING" sessionUser={null} />
    );

    const heading = screen.getByRole("heading", { name: "Test Party" });
    expect(heading.parentElement?.parentElement?.style.maxWidth).toBe("600px");
  });

  it("carries the event effect into the RSVP flow", () => {
    const { container } = render(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        effect={{ effectId: "confetti", density: "sparse", speed: "gentle" }}
        initialStatus="GOING"
        sessionUser={null}
      />
    );

    expect(container.querySelector('[data-effect-id="confetti"]')).toBeTruthy();
  });

  it("does not render Maybe button when maybeEnabled is false", () => {
    render(
      <RsvpFlow
        event={{ ...baseEvent, maybeEnabled: false }}
        theme={testTheme}
        initialStatus="GOING"
        sessionUser={null}
      />
    );
    expect(screen.queryByText("Misschien")).not.toBeInTheDocument();
  });

  it("renders name input with required placeholder", () => {
    render(
      <RsvpFlow event={baseEvent} theme={testTheme} initialStatus="GOING" sessionUser={null} />
    );
    expect(screen.getByPlaceholderText("Je naam (verplicht)")).toBeInTheDocument();
  });

  it("submit button is disabled when name is empty", () => {
    render(
      <RsvpFlow event={baseEvent} theme={testTheme} initialStatus="GOING" sessionUser={null} />
    );
    const btn = screen.getByText("RSVP bevestigen");
    expect(btn).toBeDisabled();
  });

  it("requires a valid email before enabling RSVP submission", () => {
    render(
      <RsvpFlow event={baseEvent} theme={testTheme} initialStatus="GOING" sessionUser={null} />
    );
    fireEvent.change(screen.getByPlaceholderText("Je naam (verplicht)"), {
      target: { value: "Alice" },
    });
    const submit = screen.getByText("RSVP bevestigen");
    expect(submit).toBeDisabled();

    const email = screen.getByPlaceholderText("E-mailadres (verplicht)");
    expect(email).toBeRequired();
    fireEvent.change(email, { target: { value: "not-an-email" } });
    expect(submit).toBeDisabled();

    fireEvent.change(email, { target: { value: "alice@example.com" } });
    expect(submit).not.toBeDisabled();
  });

  it("requires an email even when guest email notifications are disabled", () => {
    render(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        initialStatus="GOING"
        sessionUser={null}
        channelConfig={{ email: false, sms: false }}
      />
    );
    expect(screen.getByPlaceholderText("E-mailadres (verplicht)")).toBeRequired();
  });

  it("shows confirmation screen after successful RSVP submission", async () => {
    mockAddRSVP.mockResolvedValue({ success: true, id: "rsvp-1", editToken: "tok-abc" });

    const { container } = render(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        effect={{ effectId: "confetti", density: "sparse", speed: "gentle" }}
        initialStatus="GOING"
        sessionUser={null}
      />
    );
    fireEvent.change(screen.getByPlaceholderText("Je naam (verplicht)"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mailadres (verplicht)"), {
      target: { value: "alice@example.com" },
    });
    fireEvent.click(screen.getByText("RSVP bevestigen"));

    await waitFor(() => {
      expect(screen.getByText("Je bent erbij!")).toBeInTheDocument();
    });
    expect(container.querySelector('[data-effect-id="confetti"]')).toBeTruthy();
  });

  it("shows inline error when addRSVP returns failure", async () => {
    mockAddRSVP.mockResolvedValue({ success: false, error: "Event is at capacity" });

    render(
      <RsvpFlow event={baseEvent} theme={testTheme} initialStatus="GOING" sessionUser={null} />
    );
    fireEvent.change(screen.getByPlaceholderText("Je naam (verplicht)"), {
      target: { value: "Bob" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mailadres (verplicht)"), {
      target: { value: "bob@example.com" },
    });
    fireEvent.click(screen.getByText("RSVP bevestigen"));

    await waitFor(() => {
      expect(screen.getByText("Event is at capacity")).toBeInTheDocument();
    });
  });

  it("shows 'Noted!' on confirmation for MAYBE status", async () => {
    mockAddRSVP.mockResolvedValue({ success: true, id: "rsvp-1", editToken: "tok-abc" });

    render(
      <RsvpFlow event={baseEvent} theme={testTheme} initialStatus="MAYBE" sessionUser={null} />
    );
    fireEvent.change(screen.getByPlaceholderText("Je naam (verplicht)"), {
      target: { value: "Carol" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mailadres (verplicht)"), {
      target: { value: "carol@example.com" },
    });
    fireEvent.click(screen.getByText("RSVP bevestigen"));

    await waitFor(() => {
      expect(screen.getByText("Genoteerd!")).toBeInTheDocument();
    });
  });
});

// Regression (ROADMAP "RSVP Flow Confirmation Race Condition", found during the
// [89d70d] themes E2E audit): after a successful *create*, the Server Action's
// automatic page refresh re-requests the RSC payload with the new ?token= URL,
// so the server passes `existingRsvp` down and the still-mounted RsvpFlow
// flipped `isEdit` to true — transiently swapping the "Je bent erbij!" success
// heading to "RSVP bijgewerkt!". The `justCreated` flag pins the create heading
// for the RSVP created in this mount. The rerender below simulates the RSC
// refresh delivering the new props.
describe("RsvpFlow — confirmation heading race (create → RSC refresh)", () => {
  it("keeps 'Je bent erbij!' when existingRsvp arrives after a create", async () => {
    mockAddRSVP.mockResolvedValue({ success: true, id: "rsvp-1", editToken: "tok-abc" });

    const { rerender } = render(
      <RsvpFlow event={baseEvent} theme={testTheme} initialStatus="GOING" sessionUser={null} />
    );
    fireEvent.change(screen.getByPlaceholderText("Je naam (verplicht)"), {
      target: { value: "Alice" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mailadres (verplicht)"), {
      target: { value: "alice@example.com" },
    });
    fireEvent.click(screen.getByText("RSVP bevestigen"));
    await waitFor(() => {
      expect(screen.getByText("Je bent erbij!")).toBeInTheDocument();
    });

    rerender(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        initialStatus="GOING"
        sessionUser={null}
        existingRsvp={{
          id: "rsvp-1",
          editToken: "tok-abc",
          guestName: "Alice",
          status: "GOING" as const,
          plusOneCount: 0,
          note: null,
          plusOneGuests: [],
          answers: [],
        }}
      />
    );

    expect(screen.getByText("Je bent erbij!")).toBeInTheDocument();
    expect(screen.queryByText("RSVP bijgewerkt!")).not.toBeInTheDocument();
  });
});

describe("RsvpFlow — edit mode", () => {
  const existingRsvp = {
    id: "rsvp-1",
    editToken: "tok-abc",
    guestName: "Alice",
    status: "GOING" as const,
    plusOneCount: 0,
    note: null,
    plusOneGuests: [],
    answers: [],
  };

  it("renders in edit mode with guest name displayed as text", () => {
    render(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        existingRsvp={existingRsvp}
        sessionUser={null}
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    // Name input should not be present in edit mode
    expect(screen.queryByPlaceholderText("Je naam (verplicht)")).not.toBeInTheDocument();
  });

  it("shows 'Update RSVP' button in edit mode", () => {
    render(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        existingRsvp={existingRsvp}
        sessionUser={null}
      />
    );
    expect(screen.getByRole("button", { name: "RSVP wijzigen" })).toBeInTheDocument();
  });

  it("shows 'RSVP updated!' on successful update", async () => {
    mockUpdateRSVP.mockResolvedValue({ success: true });

    render(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        existingRsvp={existingRsvp}
        sessionUser={null}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "RSVP wijzigen" }));

    await waitFor(() => {
      expect(screen.getByText("RSVP bijgewerkt!")).toBeInTheDocument();
    });
  });

  it("renders a read-only summary after event-start locking", () => {
    const { container } = render(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        effect={{ effectId: "confetti", density: "sparse", speed: "gentle" }}
        existingRsvp={existingRsvp}
        sessionUser={null}
        readOnlyReason="This event has started, so guests can no longer change their RSVP."
      />
    );

    expect(screen.getByText("Je RSVP wijzigen is niet meer mogelijk")).toBeInTheDocument();
    expect(screen.getByText("Aanwezig · Aantal personen: 1")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "RSVP wijzigen" })).not.toBeInTheDocument();
    expect(container.querySelector('[data-effect-id="confetti"]')).toBeTruthy();
  });

  it("uses the authenticated organizer update action in override mode", async () => {
    mockUpdateRsvpAsHost.mockResolvedValue({ success: true });
    render(
      <RsvpFlow
        event={baseEvent}
        theme={testTheme}
        existingRsvp={existingRsvp}
        sessionUser={null}
        organizerOverride
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "RSVP wijzigen" }));
    await waitFor(() =>
      expect(mockUpdateRsvpAsHost).toHaveBeenCalledWith("rsvp-1", expect.any(Object), null)
    );
    expect(mockUpdateRSVP).not.toHaveBeenCalled();
  });
});
