import { ApiResponse } from "../types/ApiResponse";
import VerificationEmail from "../../../emails/VerificationEmail";
import { Resend } from "resend";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verfication email sent successfully" };
  } catch (emailError) {
    console.log("error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
