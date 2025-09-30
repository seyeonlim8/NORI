import nodemailer from "nodemailer";

export default async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  let transporter;
  if (process.env.USE_MAILHOG === "true") {
    transporter = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      secure: false,
    });
  } else {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  await transporter.sendMail({
    from: `"NORI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
