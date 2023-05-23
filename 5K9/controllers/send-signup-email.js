// Import SendGrid helper library
const sg = require("@sendgrid/mail");

module.exports = async function (reqData) {
  // Set Twilio SendGrid API key
  sg.setApiKey(process.env.SENDGRID_API_KEY);

  // Build the email request body
  const msg = {
    to: {
      email: reqData.email,
      name: `${reqData.firstName} ${reqData.lastName}`,
    },
    from: { email: process.env.FROM_EMAIL_ADDRESS, name: "5K9 TrAIning" },
    replyTo: {
      email: process.env.REPLY_TO_EMAIL_ADDRESS,
      name: "5K9 TrAIning",
    },
    subject: "Welcome to 5K9!",
    html: "Hello, <strong>TrAIner</strong>!",
  };

  /* Try to call the SendGrid API.
   * On success, redirect to a confirmation page.
   * On failure, return the error message
   */
  try {
    await sg.send(msg);
  } catch (error) {
    console.error(error);
  }
};
