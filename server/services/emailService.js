const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configure your SMTP settings here
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com', // or your hosting provider's SMTP
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'info@turatrip.com',
        pass: process.env.SMTP_PASS || 'Ahmed5100200$' // App password if using Gmail
      }
    });
  }

  async sendContactForm(formData) {
    try {
      console.log(["Credentials are as following", process.env.SMTP_USER, process.env.SMTP_PASS]);
      const { firstName, lastName, email, phone, subject, message } = formData;

      console.log('Sending contact form email with data:', formData);
      
      // Email content
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #2BA6A4; margin: 0;">New Contact Form Submission</h2>
            <p style="color: #666; margin: 5px 0;">From Turatrip Website</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 8px 0; color: #333;">
                  <a href="mailto:${email}" style="color: #2BA6A4; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 8px 0; color: #333;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #555;">Subject:</td>
                <td style="padding: 8px 0; color: #333;">${subject}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="color: #333; line-height: 1.6; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px; margin: 0;">
              This email was sent from the Turatrip contact form<br>
              Received on: ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"Turatrip Website" <${process.env.SMTP_USER || 'info@turatrip.com'}>`,
        to: process.env.CONTACT_EMAIL || 'info@turatrip.com',
        replyTo: email, // So you can reply directly to the customer
        subject: `Contact Form: ${subject}`,
        html: htmlContent,
        text: `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

Received on: ${new Date().toLocaleString()}
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Contact email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }


  // Admin

async sendPasswordResetCode(data) {
  try {
    const { email, name, verificationCode } = data;
    
    console.log('Sending password reset email to:', email);
    
    // HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1F7674; margin: 0;">Password Reset Request</h2>
          <p style="color: #666; margin: 5px 0;">Tura Trip Admin Panel</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Hello ${name || 'Admin'},</h3>
          <p style="color: #333; line-height: 1.6;">
            You have requested to reset your password for the Tura Trip Admin Panel. 
            Please use the verification code below to complete your password reset:
          </p>
          
          <div style="text-align: center; margin: 25px 0;">
            <div style="background: #1F7674; color: white; padding: 15px 25px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px; display: inline-block;">
              ${verificationCode}
            </div>
          </div>
          
          <p style="color: #333; line-height: 1.6;">
            This verification code will expire in <strong>10 minutes</strong> for security reasons.
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            If you did not request this password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px; margin: 0;">
            This email was sent from Tura Trip Admin Panel<br>
            Received on: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Tura Trip Admin" <${process.env.SMTP_USER || 'info@turatrip.com'}>`,
      to: email,
      subject: 'Password Reset Verification Code - Tura Trip Admin',
      html: htmlContent,
      text: `
        Password Reset Request - Tura Trip Admin Panel
        
        Hello ${name || 'Admin'},
        
        You have requested to reset your password for the Tura Trip Admin Panel.
        
        Your verification code is: ${verificationCode}
        
        This code will expire in 10 minutes.
        
        If you did not request this password reset, please ignore this email.
        
        Received on: ${new Date().toLocaleString()}
      `
    };

    const result = await this.transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Password reset email sending failed:', error);
    throw new Error('Failed to send password reset email');
  }
}

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection is ready');
      return true;
    } catch (error) {
      console.error('❌ SMTP connection failed:', error);
      return false;
    }
  }
}

module.exports = new EmailService();