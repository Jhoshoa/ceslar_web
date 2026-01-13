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

  // ============ Membership Notifications ============

  /**
   * Send notification to church admins about new membership request
   */
  async sendMembershipRequestNotification(admins, user, church) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">New Membership Request</h1>
        <p>A new person has requested to join <strong>${church.name}</strong>:</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          ${user.phone ? `<p><strong>Phone:</strong> ${user.phone}</p>` : ''}
        </div>
        <p>Please log in to the admin panel to review and approve or reject this request.</p>
        <p style="margin-top: 30px;">
          <a href="${config.cors.origin}/admin/memberships"
             style="background-color: #1a365d; color: white; padding: 12px 24px;
                    text-decoration: none; border-radius: 5px;">
            Review Request
          </a>
        </p>
        <p style="margin-top: 30px;">Blessings,<br>Cristo Es La Respuesta</p>
      </div>
    `;

    const adminEmails = admins.map(a => a.email);

    return this.sendEmail({
      to: adminEmails,
      subject: `New Membership Request - ${user.firstName} ${user.lastName}`,
      html,
      text: `New membership request from ${user.firstName} ${user.lastName} (${user.email}) for ${church.name}.`
    });
  }

  /**
   * Send notification to user when membership is approved
   */
  async sendMembershipApprovedNotification(user, church) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">Membership Approved!</h1>
        <p>Dear ${user.firstName},</p>
        <p>Great news! Your membership request for <strong>${church.name}</strong> has been approved.</p>
        <p>You are now officially a member of our church family. Welcome!</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">What's Next?</h3>
          <ul>
            <li>Complete your profile to help us know you better</li>
            <li>Explore our ministries and find where you can serve</li>
            <li>Join a small group to connect with others</li>
            <li>Check out upcoming events</li>
          </ul>
        </div>
        <p style="margin-top: 30px;">
          <a href="${config.cors.origin}/my-church"
             style="background-color: #c53030; color: white; padding: 12px 24px;
                    text-decoration: none; border-radius: 5px;">
            Go to My Church
          </a>
        </p>
        <p style="margin-top: 30px;">Blessings,<br>The Team at ${church.name}</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Welcome to ${church.name}! - Membership Approved`,
      html,
      text: `Congratulations ${user.firstName}! Your membership request for ${church.name} has been approved. Welcome to our church family!`
    });
  }

  /**
   * Send notification to user when membership is rejected
   */
  async sendMembershipRejectedNotification(user, church, reason = '') {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">Membership Request Update</h1>
        <p>Dear ${user.firstName},</p>
        <p>Thank you for your interest in joining <strong>${church.name}</strong>.</p>
        <p>After careful review, we were unable to approve your membership request at this time.</p>
        ${reason ? `
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Reason:</strong> ${reason}</p>
        </div>
        ` : ''}
        <p>If you have any questions or would like to discuss this further, please feel free to contact us.</p>
        <p style="margin-top: 30px;">Blessings,<br>The Team at ${church.name}</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Membership Request Update - ${church.name}`,
      html,
      text: `Dear ${user.firstName}, your membership request for ${church.name} was not approved at this time. ${reason ? `Reason: ${reason}` : ''}`
    });
  }

  /**
   * Send notification when user role is changed
   */
  async sendRoleChangeNotification(user, church, oldRole, newRole) {
    const roleNames = {
      admin: 'Administrator',
      pastor: 'Pastor',
      leader: 'Leader',
      member: 'Member',
      visitor: 'Visitor'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">Role Updated</h1>
        <p>Dear ${user.firstName},</p>
        <p>Your role at <strong>${church.name}</strong> has been updated.</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Previous Role:</strong> ${roleNames[oldRole] || oldRole}</p>
          <p><strong>New Role:</strong> ${roleNames[newRole] || newRole}</p>
        </div>
        <p>If you have any questions about your new responsibilities, please contact church leadership.</p>
        <p style="margin-top: 30px;">Blessings,<br>The Team at ${church.name}</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Your Role Has Been Updated - ${church.name}`,
      html,
      text: `Your role at ${church.name} has been changed from ${roleNames[oldRole] || oldRole} to ${roleNames[newRole] || newRole}.`
    });
  }

  /**
   * Send notification when user is added to church leadership
   */
  async sendLeadershipAssignmentNotification(user, church, role, title) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">Leadership Assignment</h1>
        <p>Dear ${user.firstName},</p>
        <p>You have been assigned a leadership role at <strong>${church.name}</strong>.</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Role:</strong> ${role}</p>
          ${title ? `<p><strong>Title:</strong> ${title}</p>` : ''}
        </div>
        <p>Thank you for your commitment to serving our church community. We are blessed to have you as part of our leadership team.</p>
        <p style="margin-top: 30px;">Blessings,<br>Cristo Es La Respuesta</p>
      </div>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Leadership Assignment - ${church.name}`,
      html,
      text: `You have been assigned as ${title || role} at ${church.name}. Thank you for your service!`
    });
  }
}

module.exports = new EmailService();
