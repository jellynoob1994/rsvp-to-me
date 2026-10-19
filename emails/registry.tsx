import type * as React from "react";
import type { EmailTheme } from "@/lib/email-theme";
import { substitutePlaceholders } from "./render";
import { DEFAULT_TOGGLES, type TemplateToggleKey, type TemplateToggles } from "./types";
import { InviteEmail } from "./templates/InviteEmail";
import { RsvpConfirmationEmail } from "./templates/RsvpConfirmationEmail";
import { ApprovalEmail } from "./templates/ApprovalEmail";
import { BlastEmail } from "./templates/BlastEmail";
import { HostRsvpAlertEmail } from "./templates/HostRsvpAlertEmail";
import { MagicLinkEmail } from "./templates/MagicLinkEmail";
import { WelcomeEmail } from "./templates/WelcomeEmail";
import { TestEmail } from "./templates/TestEmail";
import { CoHostInviteEmail } from "./templates/CoHostInviteEmail";

export type TemplateId =
  | "invite"
  | "rsvpConfirmation"
  | "approval"
  | "blast"
  | "hostRsvpAlert"
  | "magicLink"
  | "welcome"
  | "test"
  | "coHostInvite";

export const TEMPLATE_IDS: TemplateId[] = [
  "invite",
  "rsvpConfirmation",
  "approval",
  "blast",
  "hostRsvpAlert",
  "magicLink",
  "welcome",
  "test",
  "coHostInvite",
];

export interface EmailTemplateMeta {
  id: TemplateId;
  label: string;
  description: string;
  /** Event-scoped templates render with the event's theme; others use the app brand. */
  eventScoped: boolean;
  defaultSubject: string;
  /** Default editable body copy; empty string when the body is not editable. */
  defaultBody: string;
  bodyEditable: boolean;
  /** Placeholder names usable in subject/body copy, e.g. {guestName}. */
  placeholders: string[];
  /** Which structural toggles apply to this template. */
  toggles: TemplateToggleKey[];
}

export const EMAIL_TEMPLATE_META: Record<TemplateId, EmailTemplateMeta> = {
  invite: {
    id: "invite",
    label: "Evenementuitnodiging",
    description: "Wordt verstuurd wanneer een organisator iemand uitnodigt voor een evenement.",
    eventScoped: true,
    defaultSubject: "Je bent uitgenodigd: {eventTitle}",
    defaultBody: "Hoi {guestName},\n{hostName} heeft je uitgenodigd voor {eventTitle}. Ben je erbij?",
    bodyEditable: true,
    placeholders: ["guestName", "hostName", "eventTitle", "eventDate", "location"],
    toggles: ["showCoverImage", "showHostFlourish", "showMapLink", "showCalendarLinks"],
  },
  rsvpConfirmation: {
    id: "rsvpConfirmation",
    label: "RSVP-bevestiging",
    description: "Wordt verstuurd zodra een gast zijn of haar aanwezigheid doorgeeft.",
    eventScoped: true,
    defaultSubject: "Aanmelding bevestigd: {eventTitle}",
    defaultBody: "Bedankt {guestName}! Je aanmelding voor {eventTitle} is ontvangen. Hieronder vind je de details.",
    bodyEditable: true,
    placeholders: ["guestName", "eventTitle", "eventDate", "location", "status"],
    toggles: ["showCoverImage", "showMapLink", "showCalendarLinks"],
  },
  approval: {
    id: "approval",
    label: "RSVP goedkeuring / afwijzing",
    description: "Wordt verstuurd wanneer een organisator een aanmelding goedkeurt of afwijst.",
    eventScoped: true,
    defaultSubject: "Aanmelding {decision}: {eventTitle}",
    defaultBody: "",
    bodyEditable: false,
    placeholders: ["guestName", "eventTitle", "decision"],
    toggles: ["showCoverImage"],
  },
  blast: {
    id: "blast",
    label: "Update / herinnering van organisator",
    description:
      "Updates van de organisator en automatische herinneringen voor evenementen. De berichttekst wordt door de organisator geschreven of automatisch gegenereerd; alleen het onderwerp kan worden aangepast.",
    eventScoped: true,
    defaultSubject: "Update van {hostName}: {eventTitle}",
    defaultBody: "",
    bodyEditable: false,
    placeholders: ["hostName", "eventTitle"],
    toggles: ["showCoverImage", "showHostFlourish"],
  },
  hostRsvpAlert: {
    id: "hostRsvpAlert",
    label: "RSVP-melding voor organisator",
    description: "Meldt de organisator wanneer een gast zich aanmeldt.",
    eventScoped: true,
    defaultSubject: "Nieuwe aanmelding: {guestName} — {status} — {eventTitle}",
    defaultBody: "",
    bodyEditable: false,
    placeholders: ["guestName", "status", "eventTitle"],
    toggles: [],
  },
  magicLink: {
    id: "magicLink",
    label: "Inloglink",
    description: "E-mail om zonder wachtwoord in te loggen.",
    eventScoped: false,
    defaultSubject: "Je inloglink voor RSVP to Me",
    defaultBody: "Klik op de onderstaande knop om in te loggen. Deze link verloopt na 15 minuten.",
    bodyEditable: true,
    placeholders: [],
    toggles: [],
  },
  welcome: {
    id: "welcome",
    label: "Welkomstmail account",
    description: "Wordt verstuurd wanneer een beheerder een account voor iemand aanmaakt.",
    eventScoped: false,
    defaultSubject: "Je account bij RSVP to Me",
    defaultBody:
      "Er is een account voor je aangemaakt. Klik hieronder om in te loggen. Deze link verloopt na 48 uur.",
    bodyEditable: true,
    placeholders: [],
    toggles: [],
  },
  test: {
    id: "test",
    label: "Testmail",
    description: "Wordt vanuit het beheerpaneel verstuurd om de e-mailinstellingen te controleren.",
    eventScoped: false,
    defaultSubject: "Testmail van RSVP to Me",
    defaultBody:
      "Dit is een testmail van RSVP to Me. Als je dit bericht kunt lezen, werken je e-mailinstellingen!",
    bodyEditable: true,
    placeholders: [],
    toggles: [],
  },
  coHostInvite: {
    id: "coHostInvite",
    label: "Uitnodiging medeorganisator",
    description: "Wordt verstuurd wanneer een organisator iemand uitnodigt om medeorganisator van een evenement te worden.",
    eventScoped: true,
    defaultSubject: "Je bent uitgenodigd als medeorganisator: {eventTitle}",
    defaultBody: "Je bent door {hostName} uitgenodigd om medeorganisator te worden van {eventTitle}.",
    bodyEditable: true,
    placeholders: ["hostName", "eventTitle"],
    toggles: [],
  },
};

// ── Sample data for previews, admin test-sends, and tests ────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function sampleEventDetails() {
  return {
    id: "sample-event-id",
    slug: "sample-event",
    title: "Backyard Wine Night",
    description: "Bring a bottle and a story.",
    startAt: new Date("2026-08-21T23:00:00Z"),
    endAt: new Date("2026-08-22T02:00:00Z"),
    timezone: "America/New_York",
    locationType: "PHYSICAL" as const,
    locationName: "The Cole Residence",
    locationAddress: "123 Garden Lane, Brooklyn, NY",
    virtualUrl: null,
  };
}

export const SAMPLE_VARS: Record<TemplateId, Record<string, string>> = {
  invite: {
    guestName: "Alex Sample",
    hostName: "Joe",
    eventTitle: "Backyard Wine Night",
    eventDate: "Friday, August 21, 2026",
    location: "The Cole Residence",
  },
  rsvpConfirmation: {
    guestName: "Alex Sample",
    eventTitle: "Backyard Wine Night",
    eventDate: "Friday, August 21, 2026",
    location: "The Cole Residence",
    status: "Going",
  },
  approval: { guestName: "Alex Sample", eventTitle: "Backyard Wine Night", decision: "Approved" },
  blast: { hostName: "Joe", eventTitle: "Backyard Wine Night" },
  hostRsvpAlert: { guestName: "Alex Sample", status: "Going", eventTitle: "Backyard Wine Night" },
  magicLink: {},
  welcome: {},
  test: {},
  coHostInvite: { hostName: "Joe", eventTitle: "Backyard Wine Night" },
};

export type TemplateOverrides = {
  subject?: string;
  body?: string;
} & Partial<TemplateToggles>;

export function mergedToggles(
  id: TemplateId,
  overrides?: Partial<TemplateToggles>
): TemplateToggles {
  const applicable = new Set(EMAIL_TEMPLATE_META[id].toggles);
  const result = { ...DEFAULT_TOGGLES };
  for (const key of Object.keys(result) as TemplateToggleKey[]) {
    if (applicable.has(key) && overrides?.[key] !== undefined) {
      result[key] = overrides[key]!;
    }
  }
  return result;
}

/**
 * Build a fully-rendered sample of a template (subject + element) using sample
 * data — used by the admin live preview, admin test-sends, and tests.
 * `overrides` are the (possibly unsaved) admin copy/toggle settings.
 */
export function buildSampleEmail(
  id: TemplateId,
  theme: EmailTheme,
  overrides?: TemplateOverrides
): { subject: string; element: React.ReactElement } {
  const meta = EMAIL_TEMPLATE_META[id];
  const vars = SAMPLE_VARS[id];
  const subject = substitutePlaceholders(overrides?.subject || meta.defaultSubject, vars);
  const body = substitutePlaceholders(
    (meta.bodyEditable && overrides?.body) || meta.defaultBody,
    vars
  );
  const toggles = mergedToggles(id, overrides);
  const event = sampleEventDetails();
  const eventUrl = `${APP_URL}/e/${event.slug}`;

  switch (id) {
    case "invite":
      return {
        subject,
        element: (
          <InviteEmail
            theme={theme}
            body={body}
            toggles={toggles}
            event={event}
            hostName="Joe"
            rsvpBaseUrl={`${eventUrl}/rsvp?invite=sample`}
            maybeEnabled
            eventUrl={eventUrl}
          />
        ),
      };
    case "rsvpConfirmation":
      return {
        subject,
        element: (
          <RsvpConfirmationEmail
            theme={theme}
            body={body}
            toggles={toggles}
            event={event}
            statusLabel="Going"
            eventUrl={eventUrl}
            editUrl={`${eventUrl}/rsvp?token=sample-token`}
          />
        ),
      };
    case "approval":
      return {
        subject,
        element: (
          <ApprovalEmail
            theme={theme}
            toggles={toggles}
            eventTitle={event.title}
            approved
            hostMessage="Can't wait to see you there!"
            eventUrl={eventUrl}
          />
        ),
      };
    case "blast":
      return {
        subject,
        element: (
          <BlastEmail
            theme={theme}
            toggles={toggles}
            eventTitle={event.title}
            hostName="Joe"
            message={"Quick update — we moved the start time to 7pm.\nSee you soon!"}
            eventUrl={eventUrl}
          />
        ),
      };
    case "hostRsvpAlert":
      return {
        subject,
        element: (
          <HostRsvpAlertEmail
            theme={theme}
            guestName="Alex Sample"
            statusLabel="Going"
            plusOneCount={1}
            note="So excited!"
            eventTitle={event.title}
            goingCount={12}
            maybeCount={3}
            noCount={2}
            guestListUrl={`${eventUrl}#guests`}
          />
        ),
      };
    case "magicLink":
      return {
        subject,
        element: (
          <MagicLinkEmail
            theme={theme}
            body={body}
            magicLink={`${APP_URL}/auth/verify?token=sample-token`}
          />
        ),
      };
    case "welcome":
      return {
        subject,
        element: (
          <WelcomeEmail
            theme={theme}
            body={body}
            magicLink={`${APP_URL}/auth/verify?token=sample-token`}
          />
        ),
      };
    case "test":
      return { subject, element: <TestEmail theme={theme} body={body} /> };
    case "coHostInvite":
      return {
        subject,
        element: (
          <CoHostInviteEmail
            theme={theme}
            event={sampleEventDetails()}
            hostName="Joe"
            inviteUrl={`${APP_URL}/auth/verify-cohost?token=sample-token`}
          />
        ),
      };
  }
}
