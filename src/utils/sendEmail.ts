import nodemailer from 'nodemailer';

const sendEmail = async (option: any) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `Hospital <Hospital@gmail.com>`,
    to: option.email,
    subject: option.subject,
    text: option.message,
  });
};
export default sendEmail;
