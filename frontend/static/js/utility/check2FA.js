export const check2FAStatus = () => {
  const token = localStorage.getItem('token');
  const twoFAStatus = localStorage.getItem('2FA');

  if ((token && twoFAStatus === 'pending') || twoFAStatus === null) {
    window.location.href = '/2fa';
    return false;
  }
  return true;
};
