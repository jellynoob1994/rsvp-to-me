import { EmailLayout } from "../components/EmailLayout";
import { Hero } from "../components/Hero";
import { EmailButton } from "../components/EmailButton";
import type { HostRsvpAlertEmailProps } from "../types";

/** Compact host-facing alert for a new guest RSVP with the live headcount. */
export function HostRsvpAlertEmail({
  theme,
  guestName,
  statusLabel,
  plusOneCount,
  note,
  eventTitle,
  goingCount,
  maybeCount,
  noCount,
  guestListUrl,
}: HostRsvpAlertEmailProps) {
  const plusStr = plusOneCount > 0 ? ` +${plusOneCount}` : "";
  const dutchStatusLabel =
    statusLabel === "Going"
      ? "Aanwezig"
      : statusLabel === "Maybe"
        ? "Misschien"
        : statusLabel === "Can't Go"
          ? "Afwezig"
          : statusLabel;
  return (
    <EmailLayout theme={theme} preview={`${guestName}: ${dutchStatusLabel} — ${eventTitle}`}>
      <Hero theme={theme} kicker="Nieuwe aanmelding" title={eventTitle} showCoverImage={false} />
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
              <h2
                className="dm-text-primary"
                style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: theme.textPrimary }}
              >
                {guestName}
                {plusStr} — {dutchStatusLabel}
              </h2>

              {note?.trim() ? (
                <table
                  align="center"
                  width="100%"
                  border={0}
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                  className="dm-block"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderLeft: `3px solid ${theme.accent}`,
                    borderRadius: "6px",
                    padding: "10px 14px",
                    margin: "14px 0 0",
                  }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <p
                          className="dm-text-secondary"
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            lineHeight: "22px",
                            color: theme.textSecondary,
                          }}
                        >
                          “{note.trim()}”
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : null}

              <p
                className="dm-text-muted"
                style={{ margin: "16px 0 0", fontSize: "13px", color: theme.textMuted }}
              >
                Huidige aantallen: {goingCount} aanwezig · {maybeCount} misschien · {noCount}
                {" afwezig"}
              </p>

              <table
                align="center"
                width="100%"
                border={0}
                cellPadding="0"
                cellSpacing="0"
                role="presentation"
                style={{ margin: "22px 0 0" }}
              >
                <tbody>
                  <tr>
                    <td>
                      <EmailButton theme={theme} href={guestListUrl} variant="primary">
                        Bekijk gastenlijst
                      </EmailButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </EmailLayout>
  );
}
