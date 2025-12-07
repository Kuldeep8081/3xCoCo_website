import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
  // If you don't have SMTP credentials yet, just log it for testing:
  if (!process.env.SMTP_EMAIL) {
    console.log("------------------------------------");
    console.log(`[Email Mock] To: ${to}`);
    console.log(`[Email Mock] Subject: ${subject}`);
    console.log(`[Email Mock] Body: ${text}`);
    console.log("------------------------------------");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your SMTP provider
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD, // App Password, not login password
    },
  });

  await transporter.sendMail({
    from: `"3XCoCo Support" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
  });
};