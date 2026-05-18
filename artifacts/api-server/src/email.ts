const NOTIFY_EMAIL = "sidevinayabhawan@gmail.com";
const SMTP_FROM_ADDR = "side.ngo.official@gmail.com";

async function sendBrevoEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY!,
    },
    body: JSON.stringify({
      sender: {
        name: "SIDE NGO",
        email: SMTP_FROM_ADDR,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }

  return response.json();
}

export async function sendOrderNotification(order: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: string;
  totalAmount: string | number;
  id?: number;
}) {
  let itemsList = "";

  try {
    const parsed = JSON.parse(order.items);

    itemsList = parsed
      .map((i: any) => `• ${i.name} × ${i.quantity} — ₹${i.price}`)
      .join("\n");
  } catch {
    itemsList = order.items;
  }

  await sendBrevoEmail({
    to: NOTIFY_EMAIL,
    subject: `New Order #${order.id ?? "—"} from ${order.fullName}`,
    text: `
New Order Received — SIDE NGO
==============================

Order ID   : ${order.id ?? "—"}
Customer   : ${order.fullName}
Email      : ${order.email}
Phone      : ${order.phone}
Address    : ${order.address}

Items:
${itemsList}

Total Amount : ₹${Number(order.totalAmount).toLocaleString("en-IN")}
==============================
Please log into the admin panel to manage this order.
    `.trim(),
    html: `
<div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
  <div style="background:#e25a87;padding:24px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px">New Order — SIDE NGO</h1>
  </div>
  <div style="padding:24px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#666;width:140px">Order ID</td><td style="padding:6px 0;font-weight:bold">#${order.id ?? "—"}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Customer</td><td style="padding:6px 0;font-weight:bold">${order.fullName}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0">${order.email}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${order.phone}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Address</td><td style="padding:6px 0">${order.address}</td></tr>
    </table>
    <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
    <h3 style="margin:0 0 12px;color:#333">Items Ordered</h3>
    <pre style="background:#f9f9f9;padding:12px;border-radius:8px;font-size:14px">${itemsList}</pre>
    <div style="background:#fdf0f5;border:1px solid #f4c2d6;border-radius:8px;padding:16px;margin-top:16px;text-align:center">
      <span style="font-size:20px;font-weight:bold;color:#e25a87">Total: ₹${Number(order.totalAmount).toLocaleString("en-IN")}</span>
    </div>
  </div>
</div>
    `.trim(),
  });

  return { sent: true };
}

export async function sendOrderConfirmation(order: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: string;
  totalAmount: string | number;
  id?: number;
}) {
  let itemsList = "";
  let itemsHtml = "";

  try {
    const parsed = JSON.parse(order.items);

    itemsList = parsed
      .map((i: any) => `• ${i.name} × ${i.quantity} — ₹${i.price}`)
      .join("\n");

    itemsHtml = parsed
      .map(
        (i: any) =>
          `<tr><td style="padding:6px 0;border-bottom:1px solid #f0e6ef">${i.name}</td><td style="padding:6px 0;border-bottom:1px solid #f0e6ef;text-align:center">${i.quantity}</td><td style="padding:6px 0;border-bottom:1px solid #f0e6ef;text-align:right">₹${Number(i.price).toLocaleString("en-IN")}</td></tr>`
      )
      .join("");
  } catch {
    itemsList = order.items;
    itemsHtml = `<tr><td colspan="3" style="padding:6px 0">${order.items}</td></tr>`;
  }

  await sendBrevoEmail({
    to: order.email,
    subject: `Your order inquiry has been received — SIDE NGO`,
    text: `
Dear ${order.fullName},

Thank you for your order inquiry! We have received your request and our team will get in touch with you shortly.
    `.trim(),
    html: `
<div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #f0e6ef;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#e25a87,#a78bfa);padding:32px 24px;text-align:center">
    <h1 style="color:#fff;margin:0 0 6px;font-size:22px">Thank You, ${order.fullName}!</h1>
  </div>
  <div style="padding:28px 24px">
    <h3 style="font-size:14px;color:#333;margin:0 0 10px">Items Ordered</h3>
    <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:16px">
      <tbody>${itemsHtml}</tbody>
    </table>
  </div>
</div>
    `.trim(),
  });

  return { sent: true };
}

export async function sendVolunteerNotification(data: {
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
}) {
  await sendBrevoEmail({
    to: NOTIFY_EMAIL,
    subject: `New Volunteer Application from ${data.name}`,
    text: `
New Volunteer Application — SIDE NGO

Name    : ${data.name}
Email   : ${data.email}
Phone   : ${data.phone}
Area    : ${data.area}

Message:
${data.message}
    `.trim(),
    html: `
<div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
  <div style="background:#a78bfa;padding:24px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px">New Volunteer Application — SIDE NGO</h1>
  </div>
  <div style="padding:24px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#666;width:120px">Name</td><td style="padding:6px 0;font-weight:bold">${data.name}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0">${data.email}</td></tr>
      <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${data.phone}</td></tr>
    </table>
  </div>
</div>
    `.trim(),
  });

  return { sent: true };
}

export async function sendVolunteerConfirmation(data: {
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
}) {
  await sendBrevoEmail({
    to: data.email,
    subject: `Your volunteer application has been received — SIDE NGO`,
    text: `
Dear ${data.name},

Thank you for your interest in volunteering with SIDE NGO!
    `.trim(),
    html: `
<div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #ede9fe;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#a78bfa,#e25a87);padding:32px 24px;text-align:center">
    <h1 style="color:#fff;margin:0 0 6px;font-size:22px">Thank You, ${data.name}!</h1>
  </div>
</div>
    `.trim(),
  });

  return { sent: true };
}
