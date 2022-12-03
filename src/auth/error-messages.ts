const PATTERN =
  'Password should contain at least 6 characters including at least one lowercase, one uppercase and one number.';
const MISMATCH_CONFIRM_PASSWORD = 'New password does not match confirm password, new password cannot be updated.';
const INCORRECT_PASSWORD = 'Your current password is incorrect.';
const REUSE_PASSWORD = 'New password is the same as the current password, please choose a different one.';
const MISSING_FORGOT_PASSWORD_REQ_ID = 'Password reset id is missing.';
const USER_EMAIL_NOT_FOUND = 'User email cannot be found for the password reset request. Request id:';

export const ChangePasswordError = {
  PATTERN,
  MISMATCH_CONFIRM_PASSWORD,
  INCORRECT_PASSWORD,
  REUSE_PASSWORD,
};

export const ResetPasswordError = {
  PATTERN,
  MISMATCH_CONFIRM_PASSWORD,
  MISSING_FORGOT_PASSWORD_REQ_ID,
  USER_EMAIL_NOT_FOUND,
};

export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{8,}$/;
export const MIN_PASSWORD_LEN = 8;

export const InactivateError = {
  INVALID_ROLE: 'User is not an IOM user.',
  INVALID_STATUS: 'User is already deleted.',
  CURRENTLY_LOGGED_IN: 'Should not delete currently logged in user.',
  CASEWORKER_STATUS: 'User is also a case worker, account cannot be deleted.',
  SCORER_STATUS: 'User is also a scorer, account cannot be deleted.',
};
