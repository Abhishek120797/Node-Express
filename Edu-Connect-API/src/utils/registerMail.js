import { Resend } from "resend";

const sendRegisterMail = async (emailId) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [emailId],
      subject: "Welcome to Edu-Connect",
      html: `<strong>Registration succesfully to Edu-Conect</strong>`,
    });

    return {
      success: true,
      message: "User registeration email send successfully",
    };
  } catch (error) {
    console.log("Error while sending registeration mail");
    return { success: false, message: "User registeration email throws error" };
  }
};

const sendVerificationMail = async (emailId, verifyCode) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [emailId],
      subject: "Verify your Email",
      html: `<strong>Verification code ${verifyCode}</strong>`,
    });

    return { success: true, message: "Verification email send successfully" };
  } catch (error) {
    console.log("Error while sending verification mail");
    return { success: false, message: "User Verification email throws error" };
  }
};

export { sendRegisterMail, sendVerificationMail };
