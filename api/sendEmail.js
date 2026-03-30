const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  // Set up Nodemailer using Environment Variables from Vercel
  // You must add these variables in your Vercel Project Settings!
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const mailOptions = {
      from: `"Millennia Events by Navya Gowda" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Ticket is Confirmed! — The Entrepreneur's Meetup",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111111; color: #ffffff; border: 1px solid #333; border-radius: 8px; overflow: hidden;">
          
          <div style="text-align: center; padding: 40px 20px; border-bottom: 1px solid #333;">
            <h1 style="color: #C9A84C; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Payment Confirmed</h1>
            <p style="color: #F7E7CE; font-size: 16px; margin-top: 10px;">You are officially on the guest list!</p>
          </div>
          
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">Hi ${name || 'there'},</p>
            
            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
              Your UTR verification was successful. We are thrilled to confirm your seat for the upcoming <strong>The Entrepreneur's Meetup</strong>.
            </p>
            
            <div style="background-color: #1A1A1A; border: 1px solid #C9A84C; border-radius: 6px; padding: 20px; margin: 30px 0;">
              <p style="margin: 0; color: #C9A84C; font-weight: bold; font-size: 14px; text-transform: uppercase;">Event Details</p>
              <p style="margin: 10px 0 5px 0; color: #ffffff;">📅 <strong>Date:</strong> May 02, 2026</p>
              <p style="margin: 0; color: #ffffff;">📍 <strong>Venue:</strong> Will be shared closer to the event</p>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8);">
              Please keep this email as proof of your registration. We look forward to seeing you there and building something incredible together!
            </p>
            
            <p style="font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.8); margin-top: 40px;">
              Best regards,<br>
              <span style="color: #C9A84C; font-style: italic;">Navya Gowda & Team</span>
            </p>
          </div>
          
        </div>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('SMTP Error:', error);
    return res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
}
