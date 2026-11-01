// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { RsvpSection } from "@/components/event/event-page/RsvpSection";
import type { EventData } from "@/components/event/event-page/types";
import { testTheme } from "./helpers/theme";

const baseEvent = {
  id: "event-1",
  slug: "summer-party",
  startAt: new Date("2099-07-20T20:00:00Z"),
  rsvpDeadline: null,
  allowEditAfterDeadline: false,
  maybeEnabled: true,
} as unknown as EventData;

function renderSection(
  overrides: Partial<React.ComponentProps<typeof RsvpSection>> = {},
  eventOverrides: Partial<EventData> = {}
) {
  return render(
    <RsvpSection
      event={{ ...baseEvent, ...eventOverrides }}
      t={testTheme}
      isHost={false}
      guestEditToken={null}
      rsvpStatus={null}
      rsvpDone={false}
      rsvpApproved={true}
      {...overrides}
    />
  );
}

function mockLayout(initialSlotTop = 1_000) {
  let slotTop = initialSlotTop;
  vi.stubGlobal(
    "ResizeObserver",
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(function (
    this: HTMLElement
  ) {
    return this.hasAttribute("data-rsvp-floating") ? 140 : 0;
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement
  ) {
    if (this.hasAttribute("data-rsvp-slot")) {
      return {
        x: 0,
        y: slotTop,
        top: slotTop,
        bottom: slotTop + 156,
        left: 0,
        right: 408,
        width: 408,
        height: 156,
        toJSON: () => ({}),
      };
    }
    return {
      x: 0,
      y: 0,
      top: 0,
      bottom: 140,
      left: 0,
      right: 408,
      width: 408,
      height: 140,
      toJSON: () => ({}),
    };
  });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
  return (nextTop: number) => {
    slotTop = nextTop;
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("RsvpSection", () => {
  it("shows the Lucide RSVP heading and floats an open unanswered RSVP", async () => {
    mockLayout();
    const { container } = renderSection();

    expect(screen.getByRole("heading", { name: "Kom je ook?" })).toBeTruthy();
    expect(container.querySelector(".lucide-calendar-check")).toBeTruthy();
    expect(screen.getByText("Aanwezig")).toBeTruthy();
    expect(screen.getByText("Misschien")).toBeTruthy();
    expect(screen.getByText("Afwezig")).toBeTruthy();

    await waitFor(() =>
      expect(
        container.querySelector("[data-rsvp-floating]")?.getAttribute("data-rsvp-floating")
      ).toBe("true")
    );
    expect((container.querySelector("[data-rsvp-slot]") as HTMLElement).style.minHeight).toBe(
      "156px"
    );
    expect((container.querySelector("[data-rsvp-floating]") as HTMLElement).style.maxWidth).toBe(
      "568px"
    );
    expect(screen.getByRole("link", { name: /Going/ }).style.minHeight).toBe("44px");
    expect(screen.getByRole("link", { name: /Going/ }).style.flexDirection).toBe("row");
  });

  it("docks at its natural slot and floats again after the slot scrolls above the viewport", async () => {
    const setSlotTop = mockLayout();
    const { container } = renderSection();
    const floatingCard = () => container.querySelector("[data-rsvp-floating]");

    await waitFor(() => expect(floatingCard()?.getAttribute("data-rsvp-floating")).toBe("true"));

    setSlotTop(450);
    act(() => window.dispatchEvent(new Event("scroll")));
    await waitFor(() => expect(floatingCard()?.getAttribute("data-rsvp-floating")).toBe("false"));

    setSlotTop(-200);
    act(() => window.dispatchEvent(new Event("scroll")));
    await waitFor(() => expect(floatingCard()?.getAttribute("data-rsvp-floating")).toBe("true"));
  });

  it.each([
    ["GOING", "Je bent aangemeld als aanwezig"],
    ["MAYBE", "Je hebt misschien aangegeven"],
    ["NO", "Je kunt niet komen"],
  ] as const)(
    "renders a compact %s response with its status icon and edit link",
    (status, label) => {
      mockLayout();
      const { container } = renderSection({
        guestEditToken: "edit-token",
        rsvpStatus: status,
        rsvpDone: true,
      });

      expect(screen.getByText(label)).toBeTruthy();
      expect(container.querySelector(`[data-rsvp-status-icon="${status}"]`)).toBeTruthy();
      expect(screen.getByRole("link", { name: "Mijn aanmelding aanpassen" }).getAttribute("href")).toBe(
        "/e/summer-party/rsvp?token=edit-token"
      );
    }
  );

  it("shows an awaiting-approval summary instead of confirmed attendance", () => {
    mockLayout();
    const { container } = renderSection({
      guestEditToken: "edit-token",
      rsvpStatus: "GOING",
      rsvpDone: true,
      rsvpApproved: false,
    });

    expect(screen.getByText("Aanmelding ontvangen")).toBeTruthy();
    expect(screen.getByText("Wacht op goedkeuring van de organisator")).toBeTruthy();
    expect(screen.queryByText("You’re going")).toBeNull();
    expect(container.querySelector('[data-rsvp-status-icon="PENDING"]')).toBeTruthy();
  });

  it("keeps closed unanswered and submitted cards inline without an edit action", async () => {
    mockLayout();
    const pastDeadline = new Date("2020-01-01T00:00:00Z");
    const unanswered = renderSection({}, { rsvpDeadline: pastDeadline });

    expect(screen.getByText("Aanmelden niet meer mogelijk")).toBeTruthy();
    expect(
      unanswered.container.querySelector("[data-rsvp-floating]")?.getAttribute("data-rsvp-floating")
    ).toBe("false");
    unanswered.unmount();

    const submitted = renderSection(
      { guestEditToken: "edit-token", rsvpStatus: "NO", rsvpDone: true },
      { rsvpDeadline: pastDeadline }
    );
    expect(screen.getByText("Can’t make it")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Mijn aanmelding aanpassen" })).toBeNull();
    expect(
      submitted.container.querySelector("[data-rsvp-floating]")?.getAttribute("data-rsvp-floating")
    ).toBe("false");
  });

  it("renders no public RSVP card for a host", () => {
    const { container } = renderSection({ isHost: true });
    expect(container).toBeEmptyDOMElement();
  });
});
