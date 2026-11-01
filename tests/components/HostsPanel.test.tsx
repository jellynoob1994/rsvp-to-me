// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HostsPanel } from "@/components/event/settings-page/HostsPanel";
import { buildStyles } from "@/components/event/settings-page/styles";
import type { EventInput } from "@/components/event/settings-page/types";
import { testTheme } from "./helpers/theme";

describe("HostsPanel — Dutch localization", () => {
  it("renders host, co-host, and pending invitation labels in Dutch", () => {
    const event = {
      id: "event-1",
      slug: "test-event",
      title: "Test Event",
      hostId: "host-1",
      host: { id: "host-1", name: "Irvin", email: "host@example.com" },
      hostDisplayName: null,
    } as unknown as EventInput;
    const noOp = vi.fn();

    render(
      <HostsPanel
        event={event}
        coHosts={[
          {
            id: "cohost-record-1",
            displayName: null,
            user: { id: "cohost-1", name: "Eline Wimmers", email: "eline@example.com" },
          },
        ]}
        cohostEmail=""
        setCohostEmail={noOp}
        cohostError={null}
        handleAddCohost={noOp}
        handleRemoveCohost={noOp}
        hostDisplayName=""
        setHostDisplayName={noOp}
        triggerSaveSettings={noOp}
        handleUpdateCohostDisplayName={noOp}
        isPending={false}
        t={testTheme}
        S={buildStyles(testTheme)}
        pendingInvitations={[{ id: "invite-1", email: "pending@example.com" }]}
        handleCancelInvitation={noOp}
        isOwner
        sessionUser={{
          id: "host-1",
          email: "host@example.com",
          name: "Irvin",
          avatarUrl: null,
          role: "HOST",
        }}
      />
    );

    expect(screen.getByText("Organisatoren")).toBeInTheDocument();
    expect(screen.getByText("Jij")).toBeInTheDocument();
    expect(screen.getByText("Organisator")).toBeInTheDocument();
    expect(screen.getByText("AANGEPASTE WEERGAVENAAM")).toBeInTheDocument();
    expect(screen.getByText("Eline Wimmers")).toBeInTheDocument();
    expect(screen.getByText("· Medeorganisator")).toBeInTheDocument();
    expect(
      screen.getByText("AANGEPASTE WEERGAVENAAM MEDEORGANISATOR")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Pas de weergavenaam van deze medeorganisator aan...")
    ).toBeInTheDocument();
    expect(
      screen.getByText("OPENSTAANDE UITNODIGINGEN VOOR MEDEORGANISATOREN")
    ).toBeInTheDocument();
    expect(screen.getByText("Uitgenodigd · Wacht op acceptatie")).toBeInTheDocument();
    expect(screen.getByTitle("Uitnodiging annuleren")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("medeorganisator@voorbeeld.nl")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Medeorganisator toevoegen" })
    ).toBeInTheDocument();
  });
});
