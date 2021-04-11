export default (clientName: string, user: Record<string, unknown>): Record<string, Record<string, string>> => {
  const forgotPassword = {
    subject: `Password recovery - ${clientName}`,
    text: `Hi ${user.email},\nYour verification code for password recovery is: ${user.code}\n\nThanks,\nThe ${clientName} team`,
    html: `Hi ${user.email},\nYour verification code for password recovery is: ${user.code}\n\nThanks,\nThe ${clientName} team`,
  };
  const verifyAccount = {
    subject: `Verify account - ${clientName}`,
    text: `Hi ${user.email},\nYour verification code for verify your account is: ${user.code}\n\nThanks,\nThe ${clientName} team`,
    html: `Hi ${user.email},\nYour verification code for verify your account is: ${user.code}\n\nThanks,\nThe ${clientName} team`,
  };
  return {
    forgotPassword,
    verifyAccount,
  };
};
