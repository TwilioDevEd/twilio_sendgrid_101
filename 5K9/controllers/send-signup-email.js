// Import SendGrid helper library
const sg = require("@sendgrid/mail");
const { response } = require("express");
// Imports to support attachments
const fs = require("fs");
const path = require("path");

module.exports = async function (reqData) {
  // Set Twilio SendGrid API key
  sg.setApiKey(process.env.SENDGRID_API_KEY);

  /*
   * Workshop Homework: Add Attachments
   * In this case, attachments are retrieved from this project's static
   * directory. Attachments are selected based on the "resources" checked in
   * a form submission. The resources may come as a string (one resource) or
   * array (multiple resources).
   */
  let attachments = [];

  if (reqData.resources) {
    try {
      // When a single resource is selected, it will come in as a string
      // When multiple resources are selected, they will be items in an array
      const selectedResources =
        typeof reqData.resources === "string"
          ? [reqData.resources]
          : reqData.resources;
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
              path.join(
                __dirname,
                `../public/static/email_attachments/${resource
                  .split(" ")
                  .join("-")}.pdf`
              )
            )
            .toString("base64"),
          filename: `${resource.split(" ").join("-")}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

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
    templateId: process.env.EMAIL_TEMPLATE_ID,
    dynamicTemplateData: reqData,
    attachments: attachments,
    asm: {
      groupId: Number(process.env.ASM_GROUP_ID),
    },
  };

  /* Try to call the SendGrid API.
   * On success, redirect to a confirmation page.
   * On failure, return the error message
   */
  try {
    await sg.send(msg);
  } catch (error) {
    return error;
  }
};
