import nodemailer from "nodemailer";

const NOTIFY_EMAIL = "sidevinayabhawan@gmail.com";
const SMTP_FROM_ADDR = "side.ngo.official@gmail.com";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log("SMTP HOST:", host);
  console.log("SMTP PORT:", port);
  console.log("SMTP USER:", user);

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
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
  const transport = createTransport();
  if (!transport) return { sent: false, reason: "SMTP not configured" };

  let itemsList = "";
  try {
    const parsed = JSON.parse(order.items);
    itemsList = parsed
      .map((i: any) => `• ${i.name} × ${i.quantity} — ₹${i.price}`)
      .join("\n");
  } catch {
    itemsList = order.items;
  }

  await transport.sendMail({
    from: `SIDE NGO <${SMTP_FROM_ADDR}>`,
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
  <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999">
    SIDE NGO — 19/564 DDA Flats, Vinaya Bhawan, Madangir, New Delhi 110062
  </div>
</div>
    `.trim(),
  });

  return { sent: true };
}
```
