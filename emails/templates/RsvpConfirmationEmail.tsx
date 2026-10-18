import { EmailLayout } from "../components/EmailLayout";
import { Hero } from "../components/Hero";
import { EmailButton } from "../components/EmailButton";
import { DetailsCard } from "../components/DetailsCard";
import { splitParagraphs } from "../render";
import type { RsvpConfirmationEmailProps } from "../types";

export function RsvpConfirmationEmail({
  theme,
  body,
  toggles,
  event,
  statusLabel,
  eventUrl,
  editUrl,
}: RsvpConfirmationEmailProps) {
  const emoji = statusLabel === "Going" ? " 🎉" : statusLabel === "Maybe" ? " 🤞" : "";
  const dutchStatusLabel =
    statusLabel === "Going"
      ? "Aanwezig"
      : statusLabel === "Maybe"
        ? "Misschien"
        : statusLabel === "Can't Go"
          ? "Afwezig"
          : statusLabel;
  const footer = (
    <p className="dm-text-muted" style={{ margin: 0, fontSize: "13px", color: theme.textMuted }}>
      Van gedachten veranderd?{" "}
      <a href={editUrl} target="_blank" rel="noopener noreferrer" style={{ color: theme.accent }}>
        Wijzig je aanmelding
      </a>
    </p>
  );
  return (
    <EmailLayout theme={theme} preview={`Je aanmelding: ${dutchStatusLabel} — ${event.title}`} footer={footer}>
      <Hero
        theme={theme}
        kicker="Aanmelding bevestigd"
        title={event.title}
        showCoverImage={toggles.showCoverImage}
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
              <h2
                className="dm-text-primary"
                style={{
                  margin: 0,
                  fontFamily: theme.headingFont,
                  fontWeight: theme.headingWeight,
                  textTransform: theme.headingTransform as "uppercase" | "none",
                  fontSize: "20px",
                  color: theme.textPrimary,
                }}
              >
                {"Je aanmelding: "}
                {dutchStatusLabel}!{emoji}
              </h2>
              {splitParagraphs(body).map((paragraph, i) => (
                <p
                  key={i}
                  className="dm-text-secondary"
                  style={{
                    margin: "10px 0 0",
                    fontSize: "15px",
                    lineHeight: "24px",
                    color: theme.textSecondary,
                  }}
                >
                  {paragraph}
                </p>
              ))}

              <DetailsCard
                theme={theme}
                event={event}
                showMapLink={toggles.showMapLink}
                showCalendarLinks={toggles.showCalendarLinks}
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
                      <EmailButton theme={theme} href={eventUrl} variant="primary">
                        Bekijk evenement
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
