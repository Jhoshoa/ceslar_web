const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `"Church" <${config.email.from}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">Welcome to Our Church!</h1>
        <p>Dear ${user.firstName},</p>
        <p>Thank you for joining our church community. We're so glad to have you!</p>
        <p>As a member, you now have access to:</p>
        <ul>
          <li>Exclusive sermon content</li>
          <li>Event registration</li>
          <li>Small group finder</li>
          <li>Prayer request submissions</li>
          <li>And much more!</li>
        </ul>
        <p>If you have any questions, please don't hesitate to reach out.</p>
        <p>Blessings,<br>The Church Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Our Church!',
      html,
      text: `Welcome to Our Church, ${user.firstName}! Thank you for joining our community.`
    });
  }

  async sendPrayerRequestNotification(prayerRequest) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">New Prayer Request</h2>
        <p><strong>From:</strong> ${prayerRequest.name}</p>
        <p><strong>Request:</strong></p>
        <p style="background-color: #f7fafc; padding: 15px; border-radius: 5px;">
          ${prayerRequest.request}
        </p>
      </div>
    `;

    return this.sendEmail({
      to: config.email.from,
      subject: 'New Prayer Request Received',
      html,
      text: `New prayer request from ${prayerRequest.name}: ${prayerRequest.request}`
    });
  }

  async sendEventRegistrationConfirmation(user, event) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">Registration Confirmed!</h1>
        <p>Dear ${user.firstName},</p>
        <p>You have successfully registered for:</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="margin-top: 0;">${event.title}</h2>
          <p><strong>Date:</strong> ${event.date}</p>
          <p><strong>Time:</strong> ${event.time}</p>
          <p><strong>Location:</strong> ${event.location}</p>
        </div>
        <p>We look forward to seeing you there!</p>
        <p>Blessings,<br>The Church Team</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Registration Confirmed: ${event.title}`,
      html,
      text: `You have registered for ${event.title} on ${event.date} at ${event.time}.`
    });
  }
}

module.exports = new EmailService();
