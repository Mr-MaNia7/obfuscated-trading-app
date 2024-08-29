import { Icon } from '@iconify/react';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import SvgIconStyle from '../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => (
  <SvgIconStyle src={`/static/icons/navbar/${name}.svg`} sx={{ width: '100%', height: '100%' }} />
);

const ICONS = {
  user: <Icon icon="ic:baseline-security" style={{ fontSize: '25px' }} />,
  deposit: getIcon('ic_ecommerce'),
  wallet: <Icon icon="clarity:wallet-solid" style={{ fontSize: '25px' }} />,
  withdraw: <Icon icon="uil:money-withdrawal" style={{ fontSize: '25px' }} />,
  friendlyTransfer: <Icon icon="fa6-solid:money-bill-transfer" style={{ fontSize: '25px' }} />,
  memberTier: <Icon icon="carbon:skill-level-intermediate" style={{ fontSize: '25px' }} />,
  faq: <Icon icon="wpf:faq" style={{ fontSize: '25px' }} />,
  contactUS: <Icon icon="healthicons:contact-support" style={{ fontSize: '25px' }} />
};

const sidebarConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Payment',
    items: [
      { title: 'Wallet', path: PATH_DASHBOARD.general.wallet, icon: ICONS.wallet },
      { title: 'Deposit', path: PATH_DASHBOARD.general.deposit, icon: ICONS.deposit },
      { title: 'Withdraw', path: PATH_DASHBOARD.general.withdraw, icon: ICONS.withdraw },
      { title: 'Friendly Transfer', path: PATH_DASHBOARD.general.friendlyTransfer, icon: ICONS.friendlyTransfer },
      { title: 'Member Tier', path: PATH_DASHBOARD.general.memberTier, icon: ICONS.memberTier }
    ]
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Support',
    items: [
      {
        title: 'Security',
        path: PATH_DASHBOARD.app.root,
        icon: ICONS.user,
        children: [
          { title: 'Update Password', path: PATH_DASHBOARD.app.updatePassword },
          { title: 'Update Transaction Key', path: PATH_DASHBOARD.app.updateTrxKey }
        ]
      },
      { title: 'FAQs', path: PATH_DASHBOARD.general.faq, icon: ICONS.faq },
      { title: 'Contact Us', path: PATH_DASHBOARD.general.contactUS, icon: ICONS.contactUS }
    ]
  }
];

export default sidebarConfig;
