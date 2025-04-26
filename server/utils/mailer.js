const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO, // Your email address
    subject: `New Portfolio Contact: ${options.subject}`,
    html: `
      <h3>You have a new contact form submission</h3>
      <p><strong>Name:</strong> ${options.name}</p>
      <p><strong>Email:</strong> ${options.email}</p>
      <p><strong>Subject:</strong> ${options.subject}</p>
      <h4>Message:</h4>
      <p>${options.message.replace(/\n/g, '<br>')}</p>
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;