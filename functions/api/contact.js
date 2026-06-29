export async function onRequestPost({ request, env }) {
  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  if (!name || !email || !message) {
    return Response.redirect("/contact?error=missing-fields", 302);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "BTBible Contact Form <contact@mail.btbible.org>",
      to: "dzongkha@btbible.org",
      reply_to: email,
      subject: `BTBible contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return Response.redirect("/contact?error=send-failed", 302);
  }

  return Response.redirect("/contact/thank-you", 302);
}
