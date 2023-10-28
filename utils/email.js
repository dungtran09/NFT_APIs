const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // console.log(options);
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define the mail options
  const mailOptions = {
    from: "NFTMarketplace<NFTMarketplaceSupport@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // acctive and send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
