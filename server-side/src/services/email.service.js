import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock');

export const sendPasswordResetEmail = async (email, token) => {
  const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  try {
    console.log(`[Email] Dispatching recovery code to ${email}: ${token}`);
    
    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject: 'LionDesk - Password Reset Recovery Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e1e5e9; border-radius: 12px; color: #333;">
          <h2 style="color: #004d26; text-align: center;">LionDesk Help-Desk</h2>
          <hr style="border: 0; border-top: 1px solid #e1e5e9; margin: 20px 0;" />
          <p>Hello,</p>
          <p>You requested a password reset for your LionDesk account. Use the 6-digit recovery code below to reset your passcode:</p>
          <div style="background-color: #f4f7f6; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; border-radius: 8px; margin: 20px 0; color: #004d26;">
            ${token}
          </div>
          <p style="font-size: 12px; color: #686a6d; line-height: 1.5;">This recovery code will expire in <strong>15 minutes</strong>. If you did not make this request, please disregard this message.</p>
        </div>
      `
    });

    if (error) {
      console.error('[Email] Resend error details:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[Email] Resend sending failed:', error.message);
    return { success: false, error: error.message };
  }
};
