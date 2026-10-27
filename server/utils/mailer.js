const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: Number(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_USER || 'mock_user',
      pass: process.env.SMTP_PASS || 'mock_pass',
    },
  });
};

const sendBookingConfirmation = async (booking) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"HotelPro Grand Palace" <concierge@hotelpro-luxury.com>',
      to: booking.guestEmail,
      subject: `Booking Confirmed: Ref #${booking.bookingReference} - ${booking.roomTitle}`,
      html: `
        <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #324328; border-radius: 8px; background-color: #12180e; color: #fefce8;">
          <h1 style="color: #fef08a; text-align: center; margin-bottom: 8px;">HotelPro Grand Palace & Spa</h1>
          <p style="text-align: center; color: #d1d5db; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Official Booking Confirmation</p>
          <hr style="border: 0; border-top: 1px solid #324328; margin: 20px 0;" />
          
          <p>Dear <strong>${booking.guestName}</strong>,</p>
          <p>We are delighted to confirm your upcoming stay with us. Your sanctuary of luxury and refinement awaits.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #1e2a18; border-radius: 6px; overflow: hidden;">
            <tr><td style="padding: 12px; color: #9ca3af; border-bottom: 1px solid #324328;">Booking Reference</td><td style="padding: 12px; font-weight: bold; color: #fef08a; border-bottom: 1px solid #324328;">${booking.bookingReference}</td></tr>
            <tr><td style="padding: 12px; color: #9ca3af; border-bottom: 1px solid #324328;">Suite</td><td style="padding: 12px; color: #ffffff; border-bottom: 1px solid #324328;">${booking.roomTitle} (Room ${booking.roomNumber})</td></tr>
            <tr><td style="padding: 12px; color: #9ca3af; border-bottom: 1px solid #324328;">Check-In Date</td><td style="padding: 12px; color: #ffffff; border-bottom: 1px solid #324328;">${booking.checkInDate} (From 3:00 PM)</td></tr>
            <tr><td style="padding: 12px; color: #9ca3af; border-bottom: 1px solid #324328;">Check-Out Date</td><td style="padding: 12px; color: #ffffff; border-bottom: 1px solid #324328;">${booking.checkOutDate} (Until 11:00 AM)</td></tr>
            <tr><td style="padding: 12px; color: #9ca3af; border-bottom: 1px solid #324328;">Duration & Guests</td><td style="padding: 12px; color: #ffffff; border-bottom: 1px solid #324328;">${booking.nights} night(s) · ${booking.guestsCount} guests</td></tr>
            <tr><td style="padding: 12px; color: #9ca3af;">Total Settled</td><td style="padding: 12px; font-weight: bold; color: #fde047; font-size: 18px;">$${booking.totalAmount.toLocaleString()} USD (Paid in full)</td></tr>
          </table>

          <p style="font-size: 13px; color: #9ca3af; line-height: 1.6;">
            Your NFC Digital Smart Key will activate on your mobile device automatically upon arrival.<br/>
            For personalized concierge services, airport transfers, or Michelin dining reservations, please reply to this email or call our 24/7 Butler Desk at +1 (555) 789-0123.
          </p>
          <hr style="border: 0; border-top: 1px solid #324328; margin: 20px 0;" />
          <p style="text-align: center; font-size: 12px; color: #6b7280;">HotelPro Grand Palace · 1000 Luxury Boulevard, Beverly Hills, CA 90210</p>
        </div>
      `,
    };

    // If SMTP credentials aren't live external credentials, log virtual email to console gracefully
    if (process.env.SMTP_USER === 'mock_user' || !process.env.SMTP_HOST) {
      console.log(`[Email Service Simulation] Sent confirmation email to ${booking.guestEmail} for ref #${booking.bookingReference}`);
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Service] Confirmation email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`[Email Service Warning] Could not send email (${error.message}). Logged for record.`);
    return { success: false, error: error.message };
  }
};

const sendCancellationNotice = async (booking) => {
  try {
    console.log(`[Email Service Simulation] Sent cancellation & full refund receipt to ${booking.guestEmail} for ref #${booking.bookingReference}`);
    return { success: true, simulated: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendCancellationNotice,
};
