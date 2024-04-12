import { Resend } from "resend";
import { ApiError } from "./ApiError.js";

const registerMail = async (emailId) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [emailId],
      subject: "Welcome to Edu-Connect",
      html: `<strong>Registration succesfully to Edu-Conect</strong>`,
    });

    if (error) {
      throw new ApiError(400, "mail not send ", [error]);
    }

    return data;
  } catch (error) {
    throw new ApiError(500, "Error while sending mail", [error]);
  }
};

export default registerMail;
