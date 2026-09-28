const nodemailer = require("nodemailer");

// If SMTP is not configured, the email is printed in the terminal (dev mode).
const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log("\n========== EMAIL (SMTP not configured) ==========");
    console.log("To:     ", to);
    console.log("Subject:", subject);
    console.log(text);
    console.log("=================================================\n");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;
