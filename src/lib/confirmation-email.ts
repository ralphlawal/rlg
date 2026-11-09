import { site } from "@/content/site";

/**
 * The confirmation email a visitor receives straight after sending the form.
 * Safety: the only visitor-supplied text included is a cleaned first name. Their message is
 * never echoed back, so the form can't be used to send arbitrary content to arbitrary addresses.
 * No promises about response times (see the copy guidelines).
 */

export type ConfirmationKind = "project" | "call";

/** First word of the name, letters only, max 30 characters; falls back to "there". */
export function safeFirstName(name: string): string {
  const first = (name ?? "").trim().split(/\s+/)[0] ?? "";
  const cleaned = first.normalize("NFC").replace(/[^\p{L}\p{M}'’-]/gu, "").slice(0, 30);
  return cleaned.length >= 1 ? cleaned : "there";
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function buildConfirmation(kind: ConfirmationKind, name: string, reference: string) {
  const first = safeFirstName(name);
  const callUrl = `${site.url}/start/call`;
  const isCall = kind === "call";

  const subject = isCall ? `Let’s find a time · ${reference}` : `Your project is on our desk · ${reference}`;
  const intro = isCall
    ? "Thanks for asking for a discovery call. Your request has landed safely, and we’re already curious about what you’re building."
    : "Thanks for getting in touch with Ralph Lawal Group. Your enquiry has landed safely on our desk, and it’s already the most interesting thing on it.";
  const steps = isCall
    ? ["We look at the times you suggested.", "We reply by email to agree one that suits you both.", "You get a calendar invitation with a video link."]
    : ["We read every enquiry ourselves.", "We get back to you with questions or a suggested next step.", "If it’s a good fit, we arrange a call and send a written proposal."];
  const extra = isCall
    ? "Nothing is booked until we confirm by email, so keep an eye on your inbox."
    : `Want to talk sooner? Book a free 20-minute discovery call: ${callUrl}`;
  const ps = isCall
    ? "P.S. Twenty minutes is plenty. Bring the idea; we’ll bring the questions."
    : "P.S. Our motto is “Ideas deserve better execution.” Yours has officially entered the execution part.";

  const text = [
    `Hi ${first},`,
    "",
    intro,
    "",
    "What happens next:",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `Your reference: ${reference}`,
    "",
    extra,
    "",
    "Speak soon,",
    "Ralph Lawal Group",
    site.url.replace("https://", ""),
    "",
    ps,
    "",
    `You’re receiving this because you used the form on ${site.url.replace("https://", "")}. Just reply to this email if you have anything to add.`,
  ].join("\n");

  const e = escape;
  const stepRows = steps
    .map(
      (s, i) => `<tr><td style="padding:12px 0;border-top:1px solid #e3e3e3;width:44px;vertical-align:top;font:500 12px/1.6 'SFMono-Regular',Menlo,Consolas,monospace;color:#6b6b6b">0${i + 1}</td>
<td style="padding:12px 0;border-top:1px solid #e3e3e3;font:16px/1.55 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#000">${e(s)}</td></tr>`,
    )
    .join("");

  const html = `<!doctype html><html lang="en-IE"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${e(subject)}</title></head>
<body style="margin:0;padding:0;background:#f2f2f2">
<div style="display:none;max-height:0;overflow:hidden">${e(isCall ? "We’ll reply to agree a time." : "We’ve got it. Here’s what happens next.")}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2f2"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #000">
<tr><td style="padding:28px 32px 0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="font:500 11px/1 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b">Received · ${e(reference)}</td>
    <td align="right"><img src="${site.url}/brand/email-logo.png" width="112" alt="Ralph Lawal Group" style="display:block;border:0;height:auto"></td>
  </tr></table>
</td></tr>
<tr><td style="padding:40px 32px 8px">
  <h1 style="margin:0;font:700 34px/1.05 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:-.02em;color:#000">${isCall ? "Let’s find a time." : "Your project is on our desk."}</h1>
</td></tr>
<tr><td style="padding:16px 32px 0;font:16px/1.6 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#3d3d3d">
  <p style="margin:0 0 12px">Hi ${e(first)},</p>
  <p style="margin:0">${e(intro)}</p>
</td></tr>
<tr><td style="padding:28px 32px 0">
  <p style="margin:0 0 4px;font:500 11px/1 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;color:#6b6b6b">What happens next</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #e3e3e3">${stepRows}</table>
</td></tr>
<tr><td style="padding:28px 32px 0">
  <table role="presentation" cellpadding="0" cellspacing="0" style="border:1.5px dashed #000"><tr><td style="padding:12px 16px;font:500 13px/1 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.06em;color:#000">YOUR REFERENCE&nbsp;&nbsp;${e(reference)}</td></tr></table>
</td></tr>
<tr><td style="padding:24px 32px 0;font:16px/1.6 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#3d3d3d">
  ${
    isCall
      ? `<p style="margin:0">${e(extra)}</p>`
      : `<p style="margin:0 0 16px">Want to talk sooner?</p>
  <a href="${callUrl}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;font:500 15px/1 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;padding:15px 20px">Book a free 20-minute call &rarr;</a>`
  }
</td></tr>
<tr><td style="padding:32px 32px 0;font:16px/1.6 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#000">
  <p style="margin:0">Speak soon,<br><strong>Ralph Lawal Group</strong></p>
</td></tr>
<tr><td style="padding:24px 32px 28px">
  <p style="margin:0;padding-top:16px;border-top:1px solid #e3e3e3;font:italic 15px/1.5 Georgia,'Times New Roman',serif;color:#3d3d3d">${e(ps)}</p>
</td></tr>
<tr><td style="background:#000;padding:18px 32px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="font:500 11px/1.5 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.06em;text-transform:uppercase;color:#fff"><a href="${site.url}" style="color:#fff;text-decoration:none">ralphlawalgroup.com</a></td>
    <td align="right" style="font:500 11px/1.5 'SFMono-Regular',Menlo,Consolas,monospace;letter-spacing:.06em;color:#949494"><a href="${site.social.x.url}" style="color:#949494;text-decoration:none">${e(site.social.x.handle)}</a></td>
  </tr></table>
</td></tr>
</table>
<p style="max-width:600px;margin:16px auto 0;font:12px/1.5 -apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b6b6b">You’re receiving this because you used the form on ralphlawalgroup.com. Just reply if you have anything to add.</p>
</td></tr></table></body></html>`;

  return { subject, text, html };
}
