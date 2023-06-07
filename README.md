# Twilio SendGrid 101: An Introduction to Sending Transactional Email

## Contents

- [Workshop description](#workshop-description)
- [Documentation and resources](#documentation-and-resources)

## Workshop description

Email is reliable, global, and offers flexibility that can't be met by other communications channels.

In this workshop, you'll learn how to implement the Twilio SendGrid Email API, and you can expect some deliverability tips to help you start sending at scale. What kind of scale? In 2022, SendGrid sent more than 1.6 trillion messages — 50 billion of which were sent during the Black Friday and Cyber Monday week alone while maintaining a 99 percent delivery rate.

You'll also see how the SendGrid dynamic templating system makes it possible to personalize your messages for each customer, allowing you to build lasting connections with your audience.

## Documentation and resources

The following documentation and resources will help you build upon what you learn in this workshop.

### Twilio SendGrid documentation and API reference

- [Twilio SendGrid documentation](https://docs.sendgrid.com/)
- [Twilio SendGrid Onboarding Guide](https://docs.sendgrid.com/onboarding)
- [Twilio SendGrid API reference](https://docs.sendgrid.com/api-reference)

### Transactional vs Marketing email

- [Guide to transactional and marketing email](https://sendgrid.com/marketing/guide-transactional-and-marketing-email/)
- [Marketing vs transactional email](https://sendgrid.com/blog/marketing-email-vs-transactional-email-whats-difference/)

### Mail Send API quickstarts by language

- [Go](https://docs.sendgrid.com/for-developers/sending-email/quickstart-go)
- [Node.js](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)
- [Python](https://docs.sendgrid.com/for-developers/sending-email/quickstart-python)
- [PHP](https://docs.sendgrid.com/for-developers/sending-email/quickstart-php)
- [Ruby](https://docs.sendgrid.com/for-developers/sending-email/quickstart-ruby)

### API keys and environment variables

- [API keys](https://docs.sendgrid.com/ui/account-and-settings/api-keys/)
- [API keys permission list](https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authorization#api-key-permissions-list)

### Helper libraries

- [C#](https://github.com/sendgrid/sendgrid-csharp)
- [Go](https://github.com/sendgrid/sendgrid-go)
- [Java](https://github.com/sendgrid/sendgrid-java)
- [Node.js](https://github.com/sendgrid/sendgrid-nodejs)
- [PHP](https://github.com/sendgrid/sendgrid-php)
- [Python](https://github.com/sendgrid/sendgrid-python)
- [Ruby](https://github.com/sendgrid/sendgrid-ruby)

### Design and template documentation

- [How to send an email with Dynamic Transactional Templates](https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-transactional-templates/)
- [The Design and Code Editor](https://docs.sendgrid.com/ui/sending-email/editor/)
- [Using Handlebars](https://docs.sendgrid.com/for-developers/sending-email/using-handlebars/)

### Sender verification documentation

- [Sender Identity explained](https://docs.sendgrid.com/for-developers/sending-email/sender-identity/)
- [How to Set up Domain Authentication](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication/)
- [How to Verify a Single Sender](https://docs.sendgrid.com/ui/sending-email/sender-verification/)

### More information about Sender Identity and email authentication

- [Spoofing](https://twilio.com/docs/glossary/spoofing/)
- [SPF](https://twilio.com/docs/glossary/spf/)
- [DKIM](https://twilio.com/docs/glossary/dkim/)
- [Everything about DMARC](https://docs.sendgrid.com/ui/sending-email/dmarc)
- [What is BIMI](https://sendgrid.com/blog/what-is-bimi/)
- [BIMI Implementation Guide](https://bimigroup.org/implementation-guide/)

### Sending attachments with Node.js

- [Sending Email with Attachments using SendGrid and Node.js](https://www.twilio.com/blog/sending-email-attachments-with-sendgrid)

## Workshop outline

This outline provides abbreviated steps to help you follow along with the workshop. You can use this outline and the app in the [5K9](5K9) directory to replicate the workshop on your own.

### Prerequisites and setup

1. [Sign up for a SendGrid account](https://signup.sendgrid.com/).
2. [Create and store an API key](https://docs.sendgrid.com/ui/account-and-settings/api-keys/).
3. [Domain authentication](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication#third-pane).

### Workshop steps

- Introduction
  - Overview
    - Mail Send API
    - Transactional vs marketing email
    - Templates and personalization
    - Deliverability
  - App overview
    - Twilio SendGrid App
    - Gmail inbox
    - Running app
      - Goofy intro about 5K9
      - Show form fill and receipt of confirmation email
- Transactional vs marketing email
  - Definitions and examples
  - 80/20 ratio for transactional messages
- Building the app
  - Build `signup-confirmation.js`
    - Helper library
      - Install helpler library: `npm i @sendgrid/mail`
      - Import helper: `const sg = require("@sendgrid/mail");`
    - API keys
      - Set API key: `sg.setApiKey(process.env.SENDGRID_API_KEY);`
      - Create an API key in the SendGrid UI
        - Restricted access key
    - Message object
      - Create and explain `msg {}` object and fields.
        - `to: "wadec.demos@gmail.com"`
        - `from: "wadec.demos@gmail.com"`
        - `subject: "Welcome to 5K9"`
        - `html: "Hello, <strong>Runner</strong>!"`
    - Send first request
    - Deliverability
      - Examine message warning
      - SPF, DKIM
      - Complete domain authentication
        - Automated security benefits
        - Send to a coworker
    - Modify code and send a second request: `from: {email: "signup@5k9.run"}`
    - Show warning is gone
    - Drop full code sample
      - Callout
        - Set `to` address from `reqData`
        - Set `from` from `process.env`
    - Templates
      - Prepare code
        - Stage `templateId`
        - Set `dynamicTemplateData` from `reqData`
      - Build a template
        - Add template
        - Add version
          - Show premade templates
          - Design Editor benefits
          - Quick overview
          - Show modified template with dog
      - Handlebars
        - Walk handlebars examples in template
          - Variable replacement
          - Conditionals
      - Switch template version for Halloween
