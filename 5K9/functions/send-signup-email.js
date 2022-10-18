// Import SendGrid helper library
const sg = require("@sendgrid/mail");
// Imports to support attachments
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

  // Honeypot check
  if (event.dogFavoriteTreat) {
    console.log("Spam submission", {
      honeypot: event.dogFavoriteTreat,
    });
    return callback(
      null,
      errorResponse(
        response,
        `The form was submitted with invalid information.`
      )
    );
  }

  /*
   * Workshop Homework: Add Attachments
   * In this case, attachments are retrieved from this project's assets
   * directory. Attachments are selected based on the "resources" checked in
   * a form submission. The resources may come as a string (one resource) or
   * array (multiple resources). Additionally, these attachments are "private"
   * assets in the Twilio Serverless project:
   *  https://www.twilio.com/docs/serverless/functions-assets/visibility
   */
  let attachments = [];

  if (event.resources) {
    try {
      // When a single resource is selected, it will come in as a string
      // When multiple resources are selected, they will be items in an array
      const selectedResources =
        typeof event.resources === "string"
          ? [event.resources]
          : event.resources;
      /*
       * Attachments must be sent as an array of base64 encoded strings with
       * an appropriate MIME type for the content you are attaching. For
       * example: "image/png" or "application/pdf".
       * See the Mail Send API reference for additonal information:
       *   https://docs.sendgrid.com/api-reference/mail-send/mail-send
       * See the Twilio blog for an attachments tutorial:
       *  https://www.twilio.com/blog/sending-email-attachments-with-sendgrid
       */
      attachments = selectedResources.map((resource) => {
        return {
          content: fs
            .readFileSync(
              Runtime.getAssets()[
                `/email_attachments/${resource.split(" ").join("-")}.pdf`
              ].path
            )
            .toString("base64"),
          filename: `${resource.split(" ").join("-")}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        };
      });
    } catch (error) {
      return callback(
        null,
        errorResponse(
          response,
          "There was an error processing the requested attachments."
        )
      );
    }
  }

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

  // Build the email request body
  const msg = {
    to: { email: event.email, name: `${event.firstName} ${event.lastName}` },
    from: { email: context.FROM_EMAIL_ADDRESS, name: "5K9 Running" },
    replyTo: { email: context.REPLY_TO_EMAIL_ADDRESS, name: "5K9 Support" },
    templateId: context.EMAIL_TEMPLATE_ID,
    dynamicTemplateData: event,
    attachments: attachments,
    asm: {
      groupId: Number(context.ASM_GROUP_ID),
    },
  };

  /* Try to call the SendGrid API.
   * On success, redirect to a confirmation page.
   * On failure, return the error message
   */
  try {
    await sg.send(msg);
    response.setBody({
      redirect_path: "/signup-confirmation.html",
    });
    return callback(null, response);
  } catch (error) {
    let { message } = error;
    if (error.response) {
      message = error.response.body.errors[0];
    }
    return callback(null, errorResponse(response, message));
  }
};
