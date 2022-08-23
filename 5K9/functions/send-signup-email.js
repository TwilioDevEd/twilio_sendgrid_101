// Import SendGrid helper library
const sg = require("@sendgrid/mail");

exports.handler = async function (context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");

  // Define error response message
  const errorResponse = (response, message) => {
    response.setStatusCode(400);
    response.setBody({ success: false, error: message });
    return response;
  };

  // Set Twilio SendGrid API key
  sg.setApiKey(context.SENDGRID_API_KEY);

  // Build the email request body
  const msg = {
    to: event.email,
    from: context.FROM_EMAIL_ADDRESS,
    replyTo: context.REPLY_TO_EMAIL_ADDRESS,
    subject: "Welcome to 5K9!",
    html: "Hello, <strong>Runner</strong>!",
  };

  /* Try to call the SendGrid API.
   * On success, redirect to a confirmation page.
   * On failure, return the error message
   */
  try {
    await sg.send(msg);
    response
      .setStatusCode(303)
      .appendHeader("Location", "/signup-confirmation.html");
    return callback(null, response);
  } catch (error) {
    let { message } = error;
    if (error.response) {
      message = error.response.body.errors[0];
    }
    return callback(null, errorResponse(response, message));
  }
};
