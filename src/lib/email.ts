// Tiny email abstraction. Backed by Resend when RESEND_API_KEY is set;
// otherwise just logs to stdout so dev/preview environments don't need
// an email vendor configured to exercise the rest of the pipeline.

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailResult {
  ok: boolean;
  provider: "resend" | "log" | "missing";
  id?: string;
  error?: string;
}

const FROM_DEFAULT = "Scam Dam <noreply@scamdam.app>";

export async function sendEmail(msg: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? FROM_DEFAULT;

  if (!apiKey) {
    console.log(
      `[email:log] would send to=${msg.to} subject="${msg.subject}" (RESEND_API_KEY not set)`,
    );
    return { ok: true, provider: "log" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      message?: string;
    };
    if (!res.ok) {
      return { ok: false, provider: "resend", error: data.message ?? `HTTP ${res.status}` };
    }
    return { ok: true, provider: "resend", id: data.id };
  } catch (err) {
    return {
      ok: false,
      provider: "resend",
      error: err instanceof Error ? err.message : "fetch failed",
    };
  }
}
