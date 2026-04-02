const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // For development/mocking, use Ethereal (Free)
      this.testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.testAccount.user,
          pass: this.testAccount.pass
        }
      });
      this.isInitialized = true;
      console.log(`[MAIL] Service initialized with Mock SMTP (Ethereal). User: ${this.testAccount.user}`);
    } catch (err) {
      console.error('[MAIL] Failed to initialize mail service:', err);
    }
  }

  async sendMail({ to, subject, html }) {
    await this.init();
    if (!this.transporter) {
      console.warn('[MAIL] Sending aborted: Transporter not initialized.');
      return null;
    }

    try {
      const info = await this.transporter.sendMail({
        from: '"KisanStore Main Hub" <institutional@kisanstore.pk>',
        to,
        subject,
        html
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[MAIL] Email dispatched to ${to}. Subject: ${subject}`);
      console.log(`[MAIL] Preview URL: ${previewUrl}`);
      return { success: true, previewUrl };
    } catch (err) {
      console.error(`[MAIL] Dispatch failed for ${to}:`, err);
      return { success: false, error: err.message };
    }
  }

  // --- TEMPLATES ---

  async sendResetEmail(user, resetUrl) {
    const html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #2b3922; padding: 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">KisanStore Recovery</h1>
        </div>
        <div style="padding: 40px; background: #ffffff;">
          <h2 style="color: #1a202c; font-size: 20px; margin-bottom: 24px;">Password Recovery Request</h2>
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 24px;">
            Hello ${user.first_name}, <br><br>
            A security recovery link has been generated for your institutional account. This link will expire in **1 hour**.
          </p>
          <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; background: #2b3922; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 800; font-size: 14px;">RESET ACCESS TOKEN</a>
          <p style="color: #718096; font-size: 12px; margin-top: 32px;">
            If you did not initiate this request, please disregard this email or contact support immediately.
          </p>
        </div>
        <div style="background: #f7fafc; padding: 20px; text-align: center; color: #a0aec0; font-size: 12px;">
          © 2026 KisanStore ERP · Institutional Fertilizer Dealer Registry
        </div>
      </div>
    `;
    return this.sendMail({ to: user.email, subject: '🔐 Institutional Security: Password Recovery', html });
  }

  async sendOrderConfirmation(user, order) {
    const html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #2b3922; padding: 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Procurement Confirmed</h1>
        </div>
        <div style="padding: 40px; background: #ffffff;">
          <h2 style="color: #1a202c; font-size: 20px; margin-bottom: 24px;">Order Identification: #${order._id.toString().slice(-8).toUpperCase()}</h2>
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 24px;">
            Hello ${user.first_name}, <br><br>
            Your agricultural procurement has been successfully logged. Please visit the store on your scheduled pickup date.
          </p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #718096;">Total Value:</span>
              <strong style="color: #1a202c;">Rs. ${order.totalAmount?.toLocaleString()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #718096;">Pickup Availability:</span>
              <strong style="color: #1a202c;">${new Date(order.pickupDate).toLocaleDateString()}</strong>
            </div>
          </div>
          <p style="color: #718096; font-size: 12px;">
            You can track this order or download your invoice directly from the Stakeholder Portal.
          </p>
        </div>
        <div style="background: #f7fafc; padding: 20px; text-align: center; color: #a0aec0; font-size: 12px;">
          © 2026 KisanStore ERP · Institutional Fertilizer Dealer Registry
        </div>
      </div>
    `;
    return this.sendMail({ to: user.email, subject: '📦 Procurement Confirmation: Order Logged', html });
  }

  async sendPaymentReceipt(user, order, payment) {
    const html = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #2b3922; padding: 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Institutional Payment Receipt</h1>
        </div>
        <div style="padding: 40px; background: #ffffff;">
          <h2 style="color: #1a202c; font-size: 20px; margin-bottom: 24px;">Payment Received: Rs. ${payment.amount?.toLocaleString()}</h2>
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 24px;">
            Hello ${user.first_name}, <br><br>
            We have successfully received and settled a payment against Order **#${order._id.toString().slice(-8).toUpperCase()}**.
          </p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #718096;">Method:</span>
              <strong style="color: #1a202c;">${payment.method}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #718096;">Remaining Balance:</span>
              <strong style="color: #d46a4f;">Rs. ${(order.grandTotal - order.amountPaid).toLocaleString()}</strong>
            </div>
          </div>
        </div>
        <div style="background: #f7fafc; padding: 20px; text-align: center; color: #a0aec0; font-size: 12px;">
          © 2026 KisanStore ERP · Institutional Fertilizer Dealer Registry
        </div>
      </div>
    `;
    return this.sendMail({ to: user.email, subject: '💰 Institutional Settlement: Payment Receipt', html });
  }

  /**
   * Generic template for manual administrative outreach
   */
  async sendGenericTemplate(email, subject, text) {
    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #2b3922; color: #fbfbf2; padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 0.1em;">Institutional Message</h1>
          <p style="margin: 10px 0 0; opacity: 0.8; font-size: 14px;">KisanStore ERP Operational Dispatch</p>
        </div>
        <div style="padding: 40px; color: #1a202c; line-height: 1.6;">
          <p style="font-size: 16px;">${text.replace(/\n/g, '<br>')}</p>
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 30px 0;" />
          <p style="font-size: 13px; color: #718096;">
            This is an automated institutional message. For immediate assistance, please visit our physical store or reply via our official support channels.
          </p>
        </div>
        <div style="background: #fbfbf2; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #2b3922; font-weight: 700;">KisanStore Operational Authority</p>
        </div>
      </div>
    `;
    return this.sendMail({ to: email, subject, html });
  }
}

module.exports = new MailService();
