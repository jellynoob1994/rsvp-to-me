import { EmailLayout } from "../components/EmailLayout";
import { Hero } from "../components/Hero";
import { EmailButton } from "../components/EmailButton";
import { DetailsCard } from "../components/DetailsCard";
import { formatEventDateTime } from "@/lib/calendar";
import type { EventEmailDetails } from "../components/DetailsCard";
import type { EmailTheme } from "@/lib/email-theme";

interface CoHostInviteEmailProps {
  theme: EmailTheme;
  event: EventEmailDetails;
  hostName: string;
  inviteUrl: string;
}

export function CoHostInviteEmail({ theme, event, hostName, inviteUrl }: CoHostInviteEmailProps) {
  const { date } = formatEventDateTime(event.startAt, event.endAt, event.timezone);
  const subtitle = event.locationName ? `${date} · ${event.locationName}` : date;
  return (
    <EmailLayout theme={theme} preview={`${hostName} nodigt je uit als medeorganisator van ${event.title}`}>
      <Hero
        theme={theme}
        kicker="Uitnodiging voor medeorganisator"
        title={event.title}
        subtitle={subtitle}
        showCoverImage={false}
      />
      <table
        align="center"
        width="100%"
        border={0}
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        className="email-content"
        style={{ padding: "24px 32px 30px" }}
      >
        <tbody>
          <tr>
            <td>
              <p
                className="dm-text-primary"
                style={{
                  margin: "0",
                  fontSize: "15px",
                  lineHeight: "24px",
                  color: theme.textPrimary,
                }}
              >
                {`${hostName} heeft je uitgenodigd om medeorganisator te worden van het evenement ${event.title}. Als medeorganisator kun je de evenementpagina bewerken, de gastenlijst beheren en updates versturen.`}
              </p>

              <DetailsCard
                theme={theme}
                event={event}
                showMapLink={true}
                showCalendarLinks={false}
              />

              <table
                align="center"
                width="100%"
                border={0}
                cellPadding="0"
                cellSpacing="0"
                role="presentation"
                style={{ margin: "26px 0 0", textAlign: "center" as const }}
              >
                <tbody>
                  <tr>
                    <td>
                      <EmailButton theme={theme} href={inviteUrl} variant="primary">
                        Word medeorganisator
                      </EmailButton>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p
                className="dm-text-muted"
                style={{
                  margin: "24px 0 0",
                  fontSize: "12px",
                  color: theme.textMuted,
                  textAlign: "center" as const,
                }}
              >
                Had je deze uitnodiging niet verwacht? Dan kun je deze e-mail veilig negeren of verwijderen.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </EmailLayout>
  );
}
