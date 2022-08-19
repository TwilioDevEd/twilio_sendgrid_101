// Import SendGrid helper library
const sg = require("@sendgrid/mail");
// Imports to support attachments
const path = require("path");
const fs = require("fs");

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

  /* Set up attachments.
   * In this case, attachments are retrieved from this project's assets directory.
   * Attachments are selected based on the "resources" checked in a form submission.
   * The resources may come as a string (one resource), or array (both resources).
   */
  const attachmentsPath = path.join(
    __dirname,
    "..",
    "assets",
    "email_attachments"
  );

  let attachments = [];

  if (event.resources) {
    try {
      const selectedResources =
        typeof event.resources === "string"
          ? [event.resources]
          : event.resources;
      attachments = selectedResources.map((resource) => {
        return {
          content: fs
            .readFileSync(path.join(attachmentsPath, `${resource}.pdf`))
            .toString("base64"),
          filename: `${resource}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        };
      });
    } catch (error) {
      console.log(event);
      return callback(
        null,
        errorResponse(
          response,
          "There was an error processing the your requested attachments."
        )
      );
    }
  }

  // Build the email request body
  const msg = {
    to: { email: event.email, name: `${event.firstName} ${event.lastName}` },
    from: { email: context.FROM_EMAIL_ADDRESS, name: "5K9 Running" },
    replyTo: { email: context.REPLY_TO_EMAIL_ADDRESS, name: "5K9 Support" },
    templateId: context.EMAIL_TEMPLATE_ID,
    dynamicTemplateData: event,
    attachments: attachments,
  };
  // Form validations
  const requiredFields = ["firstName", "lastName", "email", "dogName"];

  const invalidFields = requiredFields.filter((field) => {
    if (typeof event[field] === "undefined" || event[field].trim() === "") {
      return true;
    } else {
      return false;
    }
  });

  if (invalidFields.length > 0) {
    return callback(
      null,
      errorResponse(
        response,
        `The form is missing the ${invalidFields.join(", ")} field(s).`
      )
    );
  }
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
