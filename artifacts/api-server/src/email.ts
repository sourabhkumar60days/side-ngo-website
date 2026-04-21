import nodemailer from "nodemailer";

const NOTIFY_EMAIL = "sidevinayabhawan@gmail.com";
const SMTP_FROM_ADDR = "side.ngo.official@gmail.com";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

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

export async function sendOrderConfirmation(order: {
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
  let itemsHtml = "";
  try {
    const parsed = JSON.parse(order.items);
    itemsList = parsed.map((i: any) => `• ${i.name} × ${i.quantity} — ₹${i.price}`).join("\n");
    itemsHtml = parsed.map((i: any) =>
      `<tr><td style="padding:6px 0;border-bottom:1px solid #f0e6ef">${i.name}</td><td style="padding:6px 0;border-bottom:1px solid #f0e6ef;text-align:center">${i.quantity}</td><td style="padding:6px 0;border-bottom:1px solid #f0e6ef;text-align:right">₹${Number(i.price).toLocaleString("en-IN")}</td></tr>`
    ).join("");
  } catch {
    itemsList = order.items;
    itemsHtml = `<tr><td colspan="3" style="padding:6px 0">${order.items}</td></tr>`;
  }

  await transport.sendMail({
    from: `SIDE NGO <${SMTP_FROM_ADDR}>`,
    to: order.email,
    subject: `Your order inquiry has been received — SIDE NGO`,
    text: `
Dear ${order.fullName},

Thank you for your order inquiry! We have received your request and our team will get in touch with you shortly to confirm availability and arrange delivery.

Order Reference : #${order.id ?? "—"}
Name            : ${order.fullName}
Phone           : ${order.phone}
Delivery Address: ${order.address}

Items:
${itemsList}

Estimated Total : ₹${Number(order.totalAmount).toLocaleString("en-IN")}

Please note: This is an inquiry confirmation, not a payment receipt. A member of the SIDE team will contact you to complete the order.

With warm regards,
SIDE NGO
19/564 DDA Flats, Vinaya Bhawan, Madangir, New Delhi 110062
sidevinayabhawan@gmail.com
    `.trim(),
    html: `
<div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #f0e6ef;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#e25a87,#a78bfa);padding:32px 24px;text-align:center">
    <h1 style="color:#fff;margin:0 0 6px;font-size:22px">Thank You, ${order.fullName}!</h1>
    <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px">Your order inquiry has been received</p>
  </div>
  <div style="padding:28px 24px">
    <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 20px">
      We've received your order inquiry and our team will reach out to you shortly to confirm availability and arrange delivery.
    </p>

    <div style="background:#fdf4fb;border-radius:10px;padding:16px;margin-bottom:20px">
      <p style="margin:0 0 8px;font-size:12px;color:#a78bfa;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Order Reference #${order.id ?? "—"}</p>
      <table style="width:100%;font-size:13px;color:#555;border-collapse:collapse">
        <tr><td style="padding:4px 0;width:120px;color:#999">Phone</td><td style="padding:4px 0">${order.phone}</td></tr>
        <tr><td style="padding:4px 0;color:#999">Delivery to</td><td style="padding:4px 0">${order.address}</td></tr>
      </table>
    </div>

    <h3 style="font-size:14px;color:#333;margin:0 0 10px">Items Ordered</h3>
    <table style="width:100%;font-size:13px;border-collapse:collapse;margin-bottom:16px">
      <thead>
        <tr style="background:#fdf4fb">
          <th style="padding:8px 6px;text-align:left;color:#a78bfa;font-size:11px;text-transform:uppercase">Product</th>
          <th style="padding:8px 6px;text-align:center;color:#a78bfa;font-size:11px;text-transform:uppercase">Qty</th>
          <th style="padding:8px 6px;text-align:right;color:#a78bfa;font-size:11px;text-transform:uppercase">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <div style="background:#fdf0f5;border:1px solid #f4c2d6;border-radius:8px;padding:14px;text-align:center;margin-bottom:20px">
      <span style="font-size:18px;font-weight:bold;color:#e25a87">Estimated Total: ₹${Number(order.totalAmount).toLocaleString("en-IN")}</span>
    </div>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;font-size:13px;color:#92400e">
      <strong>Please note:</strong> This is an inquiry confirmation, not a payment receipt. A member of the SIDE team will contact you to complete the order.
    </div>
  </div>
  <div style="background:#f9f4fb;padding:20px 24px;text-align:center;font-size:12px;color:#999;border-top:1px solid #f0e6ef">
    <strong style="color:#a78bfa">SIDE NGO</strong><br/>
    19/564 DDA Flats, Vinaya Bhawan, Madangir, New Delhi 110062<br/>
    sidevinayabhawan@gmail.com
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
  const transport = createTransport();
  if (!transport) return { sent: false, reason: "SMTP not configured" };

  await transport.sendMail({
    from: `SIDE NGO <${SMTP_FROM_ADDR}>`,
    to: NOTIFY_EMAIL,
    subject: `New Volunteer Application from ${data.name}`,
    text: `
New Volunteer Application — SIDE NGO
======================================

Name    : ${data.name}
Email   : ${data.email}
Phone   : ${data.phone}
Area    : ${data.area}

Message:
${data.message}
======================================
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
      <tr><td style="padding:6px 0;color:#666">Area</td><td style="padding:6px 0;font-weight:bold;color:#a78bfa">${data.area}</td></tr>
    </table>
    <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
    <h3 style="margin:0 0 8px;color:#333">Their Message</h3>
    <div style="background:#f5f2ff;border-left:4px solid #a78bfa;padding:12px 16px;border-radius:4px;white-space:pre-wrap">${data.message}</div>
  </div>
  <div style="background:#f5f5f5;padding:16px;text-align:center;font-size:12px;color:#999">
    SIDE NGO — 19/564 DDA Flats, Vinaya Bhawan, Madangir, New Delhi 110062
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
  const transport = createTransport();
  if (!transport) return { sent: false, reason: "SMTP not configured" };

  await transport.sendMail({
    from: `SIDE NGO <${SMTP_FROM_ADDR}>`,
    to: data.email,
    subject: `Your volunteer application has been received — SIDE NGO`,
    text: `
Dear ${data.name},

Thank you for your interest in volunteering with SIDE NGO! We have received your application and a member of our team will get in touch with you soon.

Your Application Summary
-------------------------
Name  : ${data.name}
Phone : ${data.phone}
Area  : ${data.area}

Your Message:
${data.message}

We truly appreciate your willingness to contribute to the empowerment of women and children. Together we can make a difference.

With warm regards,
SIDE NGO
19/564 DDA Flats, Vinaya Bhawan, Madangir, New Delhi 110062
sidevinayabhawan@gmail.com
    `.trim(),
    html: `
<div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #ede9fe;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#a78bfa,#e25a87);padding:32px 24px;text-align:center">
    <h1 style="color:#fff;margin:0 0 6px;font-size:22px">Thank You, ${data.name}!</h1>
    <p style="color:rgba(255,255,255,0.85);margin:0;font-size:14px">Your volunteer application has been received</p>
  </div>
  <div style="padding:28px 24px">
    <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 20px">
      We're delighted by your interest in volunteering with SIDE NGO. A member of our team will be in touch with you shortly.
    </p>
    <div style="background:#f5f2ff;border-radius:10px;padding:16px;margin-bottom:20px">
      <p style="margin:0 0 10px;font-size:12px;color:#a78bfa;font-weight:700;text-transform:uppercase;letter-spacing:0.05em">Your Application Summary</p>
      <table style="width:100%;font-size:13px;color:#555;border-collapse:collapse">
        <tr><td style="padding:5px 0;width:100px;color:#999">Phone</td><td style="padding:5px 0">${data.phone}</td></tr>
        <tr><td style="padding:5px 0;color:#999">Area</td><td style="padding:5px 0;font-weight:bold;color:#a78bfa">${data.area}</td></tr>
      </table>
    </div>
    <div style="background:#f5f2ff;border-left:4px solid #a78bfa;padding:12px 16px;border-radius:4px;font-size:13px;color:#444;white-space:pre-wrap;margin-bottom:20px">${data.message}</div>
    <div style="background:#fdf0f5;border:1px solid #f4c2d6;border-radius:8px;padding:14px;font-size:13px;color:#9d174d;text-align:center">
      We truly appreciate your willingness to contribute to the empowerment of women and children. Together we can make a difference.
    </div>
  </div>
  <div style="background:#f9f4fb;padding:20px 24px;text-align:center;font-size:12px;color:#999;border-top:1px solid #ede9fe">
    <strong style="color:#a78bfa">SIDE NGO</strong><br/>
    19/564 DDA Flats, Vinaya Bhawan, Madangir, New Delhi 110062<br/>
    sidevinayabhawan@gmail.com
  </div>
</div>
    `.trim(),
  });

  return { sent: true };
}
