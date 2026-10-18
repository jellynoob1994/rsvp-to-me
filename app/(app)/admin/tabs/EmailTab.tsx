"use client";

import { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { APP_SHELL } from "@/lib/theme";
import { appCardStyle } from "@/components/ui/AppPrimitives";
import { EmailTemplatesSection } from "./EmailTemplatesSection";

function CollapsibleSection({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          ...appCardStyle,
          padding: "16px 24px",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "16px", color: APP_SHELL.textPrimary }}>
            {title}
          </div>
          <div style={{ fontSize: "12px", color: APP_SHELL.textSecondary, marginTop: "2px" }}>
            {subtitle}
          </div>
        </div>
        <ChevronDown
          size={18}
          color={APP_SHELL.textSecondary}
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && children}
    </div>
  );
}

export function EmailTab({
  config,
  handleToggleEmailEnabled,
  handleSaveEmailConfig,
  emailProvider,
  setEmailProvider,
  emailFrom,
  setEmailFrom,
  smtpHost,
  setSmtpHost,
  smtpPort,
  setSmtpPort,
  smtpSecure,
  setSmtpSecure,
  smtpUser,
  setSmtpUser,
  smtpPass,
  setSmtpPass,
  cfAccountId,
  setCfAccountId,
  cfApiToken,
  setCfApiToken,
  showCfApiToken,
  setShowCfApiToken,
  cfWorkerUrl,
  setCfWorkerUrl,
  suggestedSubdomain,
  showSecret,
  setShowSecret,
  cfWorkerSecret,
  setCfWorkerSecret,
  secretCopied,
  setSecretCopied,
  cfInboundForwardTo,
  setCfInboundForwardTo,
  copied,
  setCopied,
  showCode,
  setShowCode,
  isPending,
  isTestingEmail,
  handleTestEmailConfig,
}: {
  config: Record<string, string>;
  handleToggleEmailEnabled: () => void;
  handleSaveEmailConfig: (e: React.FormEvent) => void;
  emailProvider: string;
  setEmailProvider: React.Dispatch<React.SetStateAction<string>>;
  emailFrom: string;
  setEmailFrom: React.Dispatch<React.SetStateAction<string>>;
  smtpHost: string;
  setSmtpHost: React.Dispatch<React.SetStateAction<string>>;
  smtpPort: string;
  setSmtpPort: React.Dispatch<React.SetStateAction<string>>;
  smtpSecure: boolean;
  setSmtpSecure: React.Dispatch<React.SetStateAction<boolean>>;
  smtpUser: string;
  setSmtpUser: React.Dispatch<React.SetStateAction<string>>;
  smtpPass: string;
  setSmtpPass: React.Dispatch<React.SetStateAction<string>>;
  cfAccountId: string;
  setCfAccountId: React.Dispatch<React.SetStateAction<string>>;
  cfApiToken: string;
  setCfApiToken: React.Dispatch<React.SetStateAction<string>>;
  showCfApiToken: boolean;
  setShowCfApiToken: React.Dispatch<React.SetStateAction<boolean>>;
  cfWorkerUrl: string;
  setCfWorkerUrl: React.Dispatch<React.SetStateAction<string>>;
  suggestedSubdomain: string;
  showSecret: boolean;
  setShowSecret: React.Dispatch<React.SetStateAction<boolean>>;
  cfWorkerSecret: string;
  setCfWorkerSecret: React.Dispatch<React.SetStateAction<string>>;
  secretCopied: boolean;
  setSecretCopied: React.Dispatch<React.SetStateAction<boolean>>;
  cfInboundForwardTo: string;
  setCfInboundForwardTo: React.Dispatch<React.SetStateAction<string>>;
  copied: boolean;
  setCopied: React.Dispatch<React.SetStateAction<boolean>>;
  showCode: boolean;
  setShowCode: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
  isTestingEmail: boolean;
  handleTestEmailConfig: () => Promise<void>;
}) {
  const generateWorkerCode = () => {
    return `// WARNING: If you modify this template, make sure to also update the file
// worker/worker.ts to keep them in sync.

export default {
  async email(message, env) {
    if (!env.INBOUND_FORWARD_TO) {
      throw new Error("INBOUND_FORWARD_TO environment variable is not set.");
    }
    await message.forward(env.INBOUND_FORWARD_TO);
    await env.EMAIL.send({
      from: extractRawEmail(message.to),
      to: message.from,
      subject: \`Re: \${message.headers.get("subject") ?? "Your RSVP"}\`,
      text: "Thanks for your reply. The event host has been notified.",
    });
  },

  async fetch(request, env) {
    if (!env.WORKER_API_SECRET) {
      return new Response("Unauthorized: WORKER_API_SECRET environment variable is not set.", { status: 401 });
    }
    if (request.headers.get("Authorization") !== \`Bearer \${env.WORKER_API_SECRET}\`) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (request.method !== "POST" || new URL(request.url).pathname !== "/send") {
      return new Response("Not found", { status: 404 });
    }

    try {
      const body = await request.json();
      if (!body.from || !body.to || !body.subject || (!body.html && !body.text)) {
        return new Response("Missing required fields", { status: 422 });
      }

      const rawFrom = extractRawEmail(body.from);
      const rawReplyTo = body.replyTo ? extractRawEmail(body.replyTo) : undefined;

      const recipients = Array.isArray(body.to) ? body.to : [body.to];
      const bcc = body.bcc ? (Array.isArray(body.bcc) ? body.bcc : [body.bcc]) : [];
      const allRecipients = [...recipients, ...bcc];

      await env.EMAIL.send({
        from: rawFrom,
        to: recipients,
        bcc: bcc.length > 0 ? bcc : undefined,
        subject: body.subject,
        html: body.html || undefined,
        text: body.text || undefined,
        replyTo: rawReplyTo,
      });

      return Response.json({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Internal Server Error";
      return new Response(message, { status: 500 });
    }
  },
};

function extractRawEmail(fromStr) {
  const match = fromStr.match(/<([^>]+)>/);
  return match ? match[1].trim() : fromStr.trim();
}
`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <CollapsibleSection
        title="E-mailinstellingen"
        subtitle="Schakel gastmeldingen in, kies de verzendmethode en test de verbinding"
      >
        {/* Guest Email Channel Toggle */}
        <div
          style={{
            ...appCardStyle,
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: APP_SHELL.textPrimary }}>
                E-mailmeldingen voor gasten
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: APP_SHELL.textSecondary,
                  marginTop: "4px",
                  maxWidth: "420px",
                }}
              >
                Als dit is uitgeschakeld, ontvangen gasten geen e-mails (aanmeldbevestigingen, groepsberichten, herinneringen
                of uitnodigingen). Inloglinks voor organisatoren en beheerdersmails blijven wel werken.
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleEmailEnabled}
              style={{
                width: "50px",
                height: "26px",
                borderRadius: "13px",
                border: "none",
                backgroundColor:
                  config.email_enabled !== "false" ? APP_SHELL.accent : "rgba(255,255,255,0.1)",
                cursor: "pointer",
                position: "relative",
                transition: "background-color 0.2s",
                padding: 0,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#fff",
                  position: "absolute",
                  top: "3px",
                  left: config.email_enabled !== "false" ? "27px" : "3px",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </div>
        </div>

        {/* Section 2: Server Configuration & Email Delivery */}
        <div
          style={{
            ...appCardStyle,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: APP_SHELL.textPrimary,
                margin: 0,
              }}
            >
              Serverconfiguratie en e-mailbezorging
            </h3>
            <p style={{ color: APP_SHELL.textSecondary, fontSize: "13px", marginTop: "4px" }}>
              Kies je e-mailprovider en stel de bezorging in. Instellingen in de database hebben voorrang op
              omgevingsvariabelen.
            </p>
          </div>

          <div style={{ height: "1px", backgroundColor: APP_SHELL.navBorder }} />

          <form
            onSubmit={handleSaveEmailConfig}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: APP_SHELL.textSecondary,
                  marginBottom: "6px",
                }}
              >
                E-mailprovider
              </label>
              <select
                value={emailProvider}
                onChange={(e) => setEmailProvider(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: APP_SHELL.inputBg,
                  border: `1px solid ${APP_SHELL.inputBorder}`,
                  borderRadius: APP_SHELL.inputRadius,
                  padding: "10px 14px",
                  color: APP_SHELL.textPrimary,
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                  colorScheme: "dark",
                }}
              >
                <option value="console" style={{ backgroundColor: "#12091f", color: "#ffffff" }}>
                  Console als terugvaloptie (lokale ontwikkeling / logboek)
                </option>
                <option value="smtp" style={{ backgroundColor: "#12091f", color: "#ffffff" }}>
                  SMTP-server
                </option>
                <option value="cloudflare" style={{ backgroundColor: "#12091f", color: "#ffffff" }}>
                  Cloudflare Workers
                </option>
                <option
                  value="cloudflare_api"
                  style={{ backgroundColor: "#12091f", color: "#ffffff" }}
                >
                  Cloudflare Email REST API
                </option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: APP_SHELL.textSecondary,
                  marginBottom: "6px",
                }}
              >
                Afzenderadres
              </label>
              <input
                type="text"
                required
                placeholder="bijv. RSVP to Me <noreply.jouwdomein.nl>"
                value={emailFrom}
                onChange={(e) => setEmailFrom(e.target.value)}
                style={{
                  width: "100%",
                  backgroundColor: APP_SHELL.inputBg,
                  border: `1px solid ${APP_SHELL.inputBorder}`,
                  borderRadius: APP_SHELL.inputRadius,
                  padding: "10px 14px",
                  color: APP_SHELL.textPrimary,
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {emailProvider === "smtp" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: "16px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: APP_SHELL.textSecondary,
                        marginBottom: "6px",
                      }}
                    >
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bijv. smtp.gmail.com"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      style={{
                        width: "100%",
                        backgroundColor: APP_SHELL.inputBg,
                        border: `1px solid ${APP_SHELL.inputBorder}`,
                        borderRadius: APP_SHELL.inputRadius,
                        padding: "10px 14px",
                        color: APP_SHELL.textPrimary,
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: APP_SHELL.textSecondary,
                        marginBottom: "6px",
                      }}
                    >
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="587"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      style={{
                        width: "100%",
                        backgroundColor: APP_SHELL.inputBg,
                        border: `1px solid ${APP_SHELL.inputBorder}`,
                        borderRadius: APP_SHELL.inputRadius,
                        padding: "10px 14px",
                        color: APP_SHELL.textPrimary,
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13px",
                        color: APP_SHELL.textPrimary,
                      }}
                    >
                      Beveiligde verbinding gebruiken (SSL/TLS)
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: APP_SHELL.textSecondary,
                        marginTop: "2px",
                      }}
                    >
                      Stel in op true voor poort 465 en false voor poort 587 (STARTTLS).
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmtpSecure((prev) => !prev)}
                    style={{
                      width: "50px",
                      height: "26px",
                      borderRadius: "13px",
                      border: "none",
                      backgroundColor: smtpSecure ? APP_SHELL.accent : "rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background-color 0.2s",
                      padding: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        position: "absolute",
                        top: "3px",
                        left: smtpSecure ? "27px" : "3px",
                        transition: "left 0.2s",
                      }}
                    />
                  </button>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: APP_SHELL.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    SMTP-gebruikersnaam (optioneel)
                  </label>
                  <input
                    type="text"
                    placeholder="bijv. gebruiker@gmail.com"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: APP_SHELL.inputBg,
                      border: `1px solid ${APP_SHELL.inputBorder}`,
                      borderRadius: APP_SHELL.inputRadius,
                      padding: "10px 14px",
                      color: APP_SHELL.textPrimary,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: APP_SHELL.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    SMTP-wachtwoord (optioneel)
                  </label>
                  <input
                    type="password"
                    placeholder="Wachtwoord"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: APP_SHELL.inputBg,
                      border: `1px solid ${APP_SHELL.inputBorder}`,
                      borderRadius: APP_SHELL.inputRadius,
                      padding: "10px 14px",
                      color: APP_SHELL.textPrimary,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            )}

            {emailProvider === "cloudflare_api" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "8px",
                    color: "#fbbf24",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    display: "flex",
                    gap: "8px",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>⚠️</span>
                  <div>
                    <strong>Alleen uitgaande e-mail:</strong> Rechtstreeks verzenden via de API plaatst geen
                    code op Cloudflare. Daardoor leiden antwoorden van gasten op uitnodigingsmails niet tot
                    automatische antwoorden via een Worker. Antwoorden volgen alleen de gebruikelijke
                    regels voor e-maildoorsturing en routering die je in het Cloudflare-dashboard hebt ingesteld.
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: APP_SHELL.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    Cloudflare Account ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. 1a2b3c4d5e6f..."
                    value={cfAccountId}
                    onChange={(e) => setCfAccountId(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: APP_SHELL.inputBg,
                      border: `1px solid ${APP_SHELL.inputBorder}`,
                      borderRadius: APP_SHELL.inputRadius,
                      padding: "10px 14px",
                      color: APP_SHELL.textPrimary,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: APP_SHELL.textSecondary,
                      marginTop: "4px",
                      lineHeight: "1.4",
                    }}
                  >
                    Dit is je unieke Cloudflare Account ID van 32 tekens. Je vindt deze op de
                    startpagina van het Cloudflare-dashboard (zijbalk aan de rechterkant onder{" "}
                    <strong>Account ID</strong>).
                  </span>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: APP_SHELL.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    Cloudflare API Token
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showCfApiToken ? "text" : "password"}
                      required
                      placeholder="Cloudflare API-token"
                      value={cfApiToken}
                      onChange={(e) => setCfApiToken(e.target.value)}
                      style={{
                        width: "100%",
                        backgroundColor: APP_SHELL.inputBg,
                        border: `1px solid ${APP_SHELL.inputBorder}`,
                        borderRadius: APP_SHELL.inputRadius,
                        padding: "10px 40px 10px 14px",
                        color: APP_SHELL.textPrimary,
                        fontSize: "13px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCfApiToken(!showCfApiToken)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: APP_SHELL.textSecondary,
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title={showCfApiToken ? "Token verbergen" : "Token tonen"}
                    >
                      {showCfApiToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: APP_SHELL.textSecondary,
                      marginTop: "4px",
                      lineHeight: "1.4",
                    }}
                  >
                    Een API-token met de machtiging <strong>Account &gt; Email Sending: Edit</strong>.
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: APP_SHELL.textPrimary,
                      margin: "0 0 10px 0",
                    }}
                  >
                    ⚡ Snelle installatie via het dashboard (geen CLI nodig)
                  </h4>
                  <ol
                    style={{
                      fontSize: "12px",
                      color: APP_SHELL.textSecondary,
                      paddingLeft: "16px",
                      margin: "0",
                      lineHeight: "1.6",
                    }}
                  >
                    <li style={{ marginBottom: "6px" }}>
                      Log in op{" "}
                      <a
                        href="https://dash.cloudflare.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: APP_SHELL.accent, textDecoration: "underline" }}
                      >
                        dash.cloudflare.com
                      </a>
                      .
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Klik in de linkerzijbalk op je domein (onder <strong>Websites</strong>),
                      ga vervolgens naar{" "}
                      <strong>Email &gt; Email Routing &gt; Destination addresses</strong> om te controleren
                      of e-mailroutering is ingesteld.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Ga naar het tabblad <strong>Email Sending</strong> op dezelfde pagina en klik op{" "}
                      <strong>Configure</strong> of <strong>Get Started</strong>, en autoriseer de
                      gegenereerde DNS-records (DKIM/SPF) om e-mails te kunnen verzenden.{" "}
                      <strong>
                        (BELANGRIJK: als je dit overslaat, weigeren grote e-mailproviders zoals Gmail je
                        e-mails vanwege het DMARC-beleid!)
                      </strong>
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Ga naar <strong>My Profile &gt; API Tokens</strong> (pictogram van de gebruiker rechtsboven &gt; My
                      Profile &gt; API Tokens).
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Klik op <strong>Create Token</strong>. Scroll naar beneden en klik op{" "}
                      <strong>Create Custom Token</strong>.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Geef je token een naam (bijvoorbeeld <code>RSVP to Me API Token</code>).
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Selecteer onder <strong>Permissions</strong>:
                      <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
                        <li style={{ marginBottom: "4px" }}>
                          <strong>Account</strong> | <strong>Email Sending</strong> |{" "}
                          <strong>Edit</strong>
                        </li>
                      </ul>
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Kies onder <strong>Account Resources</strong> voor <strong>Include</strong> en
                      selecteer je account. Kies onder <strong>Zone Resources</strong> voor{" "}
                      <strong>Include</strong> &gt; <strong>Specific zone</strong> &gt; selecteer je
                      domein.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Klik op <strong>Continue to summary</strong> en daarna op{" "}
                      <strong>Create Token</strong>. Kopieer het token en plak het hierboven!
                    </li>
                  </ol>
                </div>
              </div>
            )}

            {emailProvider === "cloudflare" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: APP_SHELL.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    Cloudflare Worker URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder={`https://rsvp-email-worker.${suggestedSubdomain}.workers.dev`}
                    value={cfWorkerUrl}
                    onChange={(e) => setCfWorkerUrl(e.target.value)}
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && !/^https?:\/\//i.test(val)) {
                        setCfWorkerUrl(`https://${val}`);
                      }
                    }}
                    style={{
                      width: "100%",
                      backgroundColor: APP_SHELL.inputBg,
                      border: `1px solid ${APP_SHELL.inputBorder}`,
                      borderRadius: APP_SHELL.inputRadius,
                      padding: "10px 14px",
                      color: APP_SHELL.textPrimary,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: APP_SHELL.textSecondary,
                      marginTop: "4px",
                      lineHeight: "1.4",
                    }}
                  >
                    Het openbare HTTP-eindpunt van je Worker. Dit heeft meestal deze vorm:{" "}
                    <code>https://rsvp-email-worker.{suggestedSubdomain}.workers.dev</code>. Je vindt dit in het Cloudflare-dashboard onder de{" "}
                    <strong>Triggers</strong> of <strong>Routes</strong>.
                  </span>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: APP_SHELL.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    Geheim API-token van de Worker (WORKER_API_SECRET)
                  </label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input
                        type={showSecret ? "text" : "password"}
                        required
                        placeholder="API-geheimtoken"
                        value={cfWorkerSecret}
                        onChange={(e) => setCfWorkerSecret(e.target.value)}
                        style={{
                          width: "100%",
                          backgroundColor: APP_SHELL.inputBg,
                          border: `1px solid ${APP_SHELL.inputBorder}`,
                          borderRadius: APP_SHELL.inputRadius,
                          padding: "10px 40px 10px 14px",
                          color: APP_SHELL.textPrimary,
                          fontSize: "13px",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: APP_SHELL.textSecondary,
                          padding: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title={showSecret ? "Geheim verbergen" : "Geheim tonen"}
                      >
                        {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(cfWorkerSecret);
                        setSecretCopied(true);
                        setTimeout(() => setSecretCopied(false), 2000);
                      }}
                      disabled={!cfWorkerSecret}
                      style={{
                        backgroundColor: secretCopied ? "#22c55e" : "rgba(255, 255, 255, 0.08)",
                        border: `1px solid ${secretCopied ? "#22c55e" : APP_SHELL.inputBorder}`,
                        borderRadius: APP_SHELL.inputRadius,
                        color: "#fff",
                        padding: "0 14px",
                        height: "38px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: cfWorkerSecret ? "pointer" : "not-allowed",
                        opacity: cfWorkerSecret ? 1 : 0.5,
                        transition: "background-color 0.2s, border-color 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                      onMouseEnter={(e) => {
                        if (cfWorkerSecret && !secretCopied)
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        if (cfWorkerSecret && !secretCopied)
                          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                      }}
                      title="Geheim kopiëren naar klembord"
                    >
                      {secretCopied ? "✓" : "📋"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const hasSavedSecret = !!config.cloudflare_worker_api_secret;
                        if (hasSavedSecret) {
                          const confirmOverwrite = window.confirm(
                            "Waarschuwing: er is al een Worker API-geheim opgeslagen in de database. Een nieuw geheim overschrijft het bestaande. Je moet ook WORKER_API_SECRET in je Cloudflare-dashboard bijwerken zodat beide overeenkomen. Weet je zeker dat je wilt doorgaan?"
                          );
                          if (!confirmOverwrite) return;
                        }
                        const chars =
                          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        const array = new Uint8Array(32);
                        window.crypto.getRandomValues(array);
                        let secret = "";
                        for (let i = 0; i < array.length; i++) {
                          secret += chars[array[i] % chars.length];
                        }
                        setCfWorkerSecret(secret);
                      }}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: `1px solid ${APP_SHELL.inputBorder}`,
                        borderRadius: APP_SHELL.inputRadius,
                        color: APP_SHELL.textPrimary,
                        padding: "0 14px",
                        height: "38px",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)")
                      }
                    >
                      ⚡ Genereren
                    </button>
                  </div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: APP_SHELL.textSecondary,
                      marginTop: "4px",
                      lineHeight: "1.4",
                    }}
                  >
                    Een beveiligd token om Next.js-verzoeken aan je Worker te authenticeren. Klik{" "}
                    <strong>Genereren</strong> om een token te maken en kopieer het daarna.
                  </span>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: APP_SHELL.textSecondary,
                      marginBottom: "6px",
                    }}
                  >
                    Terugvaladres voor beheerder (INBOUND_FORWARD_TO)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="bijv. beheerder@domein.nl"
                    value={cfInboundForwardTo}
                    onChange={(e) => setCfInboundForwardTo(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: APP_SHELL.inputBg,
                      border: `1px solid ${APP_SHELL.inputBorder}`,
                      borderRadius: APP_SHELL.inputRadius,
                      padding: "10px 14px",
                      color: APP_SHELL.textPrimary,
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: APP_SHELL.textSecondary,
                      marginTop: "4px",
                      lineHeight: "1.4",
                    }}
                  >
                    Standaard worden antwoorden van gasten automatisch doorgestuurd naar het e-mailadres van de organisator (via
                    de Reply-To-header). Dit adres is een algemeen terugvaladres dat alleen wordt gebruikt als een gast
                    rechtstreeks antwoordt op het afzenderadres (bijv. noreply@jouwdomein.nl). Omdat
                    Cloudflare Email Routing alleen doorstuurt naar geverifieerde bestemmingsadressen, moet dit
                    terugvaladres zijn geverifieerd in je Cloudflare-instellingen.
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "12px",
                    padding: "16px",
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: APP_SHELL.textPrimary,
                      margin: "0 0 10px 0",
                    }}
                  >
                    ⚡ Snelle installatie via de browser (geen CLI nodig)
                  </h4>
                  <ol
                    style={{
                      fontSize: "12px",
                      color: APP_SHELL.textSecondary,
                      paddingLeft: "16px",
                      margin: "0 0 16px 0",
                      lineHeight: "1.6",
                    }}
                  >
                    <li style={{ marginBottom: "6px" }}>
                      Log in op{" "}
                      <a
                        href="https://dash.cloudflare.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: APP_SHELL.accent, textDecoration: "underline" }}
                      >
                        dash.cloudflare.com
                      </a>{" "}
                      (maak gratis een account aan als je dat nog niet hebt gedaan).
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Go to{" "}
                      <strong>
                        Websites &gt; [Your Domain] &gt; Email &gt; Email Routing &gt; Email Workers
                      </strong>
                      .
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Klik op <strong>Create Email Worker</strong> en geef deze de naam{" "}
                      <code>rsvp-email-worker</code>, en selecteer <strong>Create my own</strong>{" "}
                      (hiermee open je de online code-editor).
                    </li>
                    <li style={{ marginBottom: "8px" }}>
                      Klik op de knop hieronder om de Worker-code te kopiëren of te bekijken:
                    </li>
                  </ol>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginBottom: "12px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generateWorkerCode());
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{
                        backgroundColor: copied ? "#22c55e" : APP_SHELL.accent,
                        border: "none",
                        color: "#fff",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {copied ? "✓ Gekopieerd!" : "📋 Worker-code kopiëren"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: `1px solid ${APP_SHELL.inputBorder}`,
                        borderRadius: "6px",
                        color: APP_SHELL.textPrimary,
                        padding: "8px 16px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)")
                      }
                    >
                      <span>&lt;/&gt;</span> {showCode ? "Hide Worker Code" : "View Worker Code"}
                    </button>
                  </div>

                  {showCode && (
                    <div style={{ marginBottom: "12px" }}>
                      <pre
                        style={{
                          margin: 0,
                          padding: "12px",
                          backgroundColor: "rgba(0,0,0,0.3)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "6px",
                          fontSize: "11px",
                          color: "#e2e8f0",
                          overflowX: "auto",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-all",
                          fontFamily: "monospace",
                          maxHeight: "250px",
                          overflowY: "auto",
                        }}
                      >
                        {generateWorkerCode()}
                      </pre>
                    </div>
                  )}

                  <ol
                    start={4}
                    style={{
                      fontSize: "12px",
                      color: APP_SHELL.textSecondary,
                      paddingLeft: "16px",
                      margin: "0",
                      lineHeight: "1.6",
                    }}
                  >
                    <li style={{ marginBottom: "6px" }}>
                      Verwijder alle code in de Cloudflare-editor, plak de gekopieerde code en klik op{" "}
                      <strong>Save and Deploy</strong>.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Kopieer de openbare URL van je Worker (te vinden onder de instellingen van je Worker{" "}
                      <strong>Overview</strong> of het tabblad <strong>Triggers</strong>, bijvoorbeeld{" "}
                      <code>https://rsvp-email-worker.{suggestedSubdomain}.workers.dev</code>) and
                      plak deze in het invoerveld <strong>Cloudflare Worker URL</strong> bij de
                      bovenaan deze instellingenpagina.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Ga naar het hoofddashboard van Cloudflare en klik op{" "}
                      <strong>Workers & Pages</strong> (linkerzijbalk) &gt; klik op je Worker (
                      <code>rsvp-email-worker</code>) &gt; selecteer het tabblad <strong>Settings</strong>
                      &gt; selecteer <strong>Variables</strong> in het instellingenmenu.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Zoek de tabel <strong>Environment Variables</strong>:
                      <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
                        <li style={{ marginBottom: "4px" }}>
                          Klik eerst op de knop <strong>Edit variables</strong> (verplicht voordat
                          voordat je variabelen kunt toevoegen of wijzigen).
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          Klik op <strong>Add variable</strong> en stel Name in op{" "}
                          <code>WORKER_API_SECRET</code>, stel Type in op <strong>Secret</strong>{" "}
                          (via de keuzelijst of het slotpictogram), and paste your{" "}
                          <strong>Worker API Secret</strong> van hierboven.
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          Klik opnieuw op <strong>Add variable</strong> en stel Name in op{" "}
                          <code>INBOUND_FORWARD_TO</code>, laat Type op <strong>Text</strong> staan en
                          vul het <strong>terugvaladres voor beheerder</strong> in (bijvoorbeeld{" "}
                          <code>{cfInboundForwardTo || "your-email@domain.com"}</code>).
                        </li>
                      </ul>
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Scroll naar beneden naar de sectie <strong>Bindings</strong> op dezelfde pagina:
                      <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
                        <li style={{ marginBottom: "4px" }}>
                          Klik op <strong>Add binding</strong>.
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          Selecteer <strong>Email Service</strong> in de keuzelijst Type.
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          Stel Name in op <code>EMAIL</code> (alle letters moeten hoofdletters zijn).
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          <em>
                            Let op: vul niets in bij Value. Na het opslaan wordt een streepje weergegeven,
                            wat correct is en zo hoort.
                          </em>
                        </li>
                      </ul>
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Klik onderaan de pagina op <strong>Save and deploy</strong> om
                      alle variabelen en koppelingen toe te passen.
                    </li>
                    <li style={{ marginBottom: "6px" }}>
                      Ga naar het dashboard van je domein bij{" "}
                      <strong>
                        Websites &gt; [Your Domain] &gt; Email &gt; Email Routing &gt; Routes
                      </strong>
                       en klik op <strong>Add Route</strong>:
                      <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
                        <li style={{ marginBottom: "4px" }}>
                          <strong>Aangepast adres</strong>: voer het gewenste afzenderadres in
                          (bijvoorbeeld{" "}
                          <code>
                            {emailFrom.match(/<([^>]+)>/)?.[1] ||
                              emailFrom ||
                              "rsvps@yourdomain.com"}
                          </code>
                          ).
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          <strong>Actie</strong>: selecteer <strong>Send to Worker</strong>.
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          <strong>Bestemmingsworker</strong>: selecteer <code>rsvp-email-worker</code>
                          .
                        </li>
                        <li style={{ marginBottom: "4px" }}>
                          Klik op <strong>Save</strong>.
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                disabled={isPending || isTestingEmail}
                onClick={handleTestEmailConfig}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: `1px solid ${APP_SHELL.inputBorder}`,
                  color: APP_SHELL.textPrimary,
                  borderRadius: "10px",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: isPending || isTestingEmail ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                  opacity: isPending || isTestingEmail ? 0.6 : 1,
                }}
              >
                {isTestingEmail ? "Bezig met testen…" : "Verbinding testen"}
              </button>

              <button
                type="submit"
                disabled={isPending || isTestingEmail}
                style={{
                  backgroundColor: APP_SHELL.accent,
                  border: "none",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: isPending || isTestingEmail ? "not-allowed" : "pointer",
                  opacity: isPending || isTestingEmail ? 0.6 : 1,
                }}
              >
                Instellingen opslaan
              </button>
            </div>
          </form>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="E-mailsjablonen"
        subtitle="Pas teksten en inhoudsblokken aan, bekijk elk e-mailsjabloon en stuur jezelf een testmail"
      >
        <div
          style={{
            ...appCardStyle,
            padding: "24px",
          }}
        >
          <EmailTemplatesSection />
        </div>
      </CollapsibleSection>
    </div>
  );
}
