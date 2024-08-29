// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/en-US';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  getAccountName: path(ROOTS_AUTH, '/get-account-name'),
  verify: path(ROOTS_AUTH, '/verify')
};

// ----------------------------------------------------------------------

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    wallet: path(ROOTS_DASHBOARD, '/wallet'),
    deposit: path(ROOTS_DASHBOARD, '/deposit'),
    withdraw: path(ROOTS_DASHBOARD, '/withdraw'),
    friendlyTransfer: path(ROOTS_DASHBOARD, '/friendly-transfer'),
    memberTier: path(ROOTS_DASHBOARD, '/memberTier'),
    faq: path(ROOTS_DASHBOARD, '/faq'),
    contactUS: path(ROOTS_DASHBOARD, '/contact-us')
  },
  app: {
    root: path(ROOTS_DASHBOARD, '/app'),
    updatePassword: path(ROOTS_DASHBOARD, '/app/update-password'),
    updateTrxKey: path(ROOTS_DASHBOARD, '/app/update-transaction-key')
  },
  admin: {
    sendMessage: path(ROOTS_DASHBOARD, '/admin/send-message'),
    sendEmail: path(ROOTS_DASHBOARD, '/admin/send-email')
  }
};
