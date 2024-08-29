// material
import { styled, useTheme, alpha } from '@mui/material/styles';
import { Box, Container, Typography, Card } from '@mui/material';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../components/animate';
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15)
  }
}));

// ----------------------------------------------------------------------

const FAQS = [
  {
    title: 'How often is each account used? How long does it take to upgrade the account limit authorization?',
    detail:
      'Except for Basic tier, which lasts for 1 month, the usage time of other accounts is permanent, and the quota permission is also permanently enjoyed.'
  },
  {
    title: 'The newly registered account level is Basic, what permissions do I have?',
    detail:
      'The platform is open for tourist registration. Anyone can register their own account. The level of the newly registered account is Basic tier (you can deposit , withdraw). These are free, and you can operate without upgrading your account.'
  },
  {
    title: 'What does the upgrade of account tier do and what are the benefits?',
    detail:
      ' If your account needs to receive transfers from others and exchange electronic checks from others, you need to use the payment limit. (At this time, accounts with Basic tier will not be able to receive money.) You need to upgrade your account with Basic tier to at least Bronze tier in order to use the payment function including friendly transfer. The higher the level, the different daily and monthly allowances, please upgrade as needed.'
  },
  {
    title: 'Can assets be transferred?',
    detail:
      'Yes, if you are the owner of two accounts and have a large amount of funds, you can apply for account asset transfer and the transfer is limited according to the tiers of the two accounts. Please use Friendly transfer function. The friendly transfer function allows you to simply transfer your assets to your another account without the transaction key.'
  },
  {
    title: 'I want to transfer assets to a friend, but is not going through, why?',
    detail:
      'That`s because the tier level of your friend`s account is not high enough to meet the transfer amount. See Member Tier section. Please let your friend deposit assets into his account and upgrade tier level.'
  },
  // {
  //   title: 'I can`t access my account email. Now how can I do?',
  //   detail:
  //     'In some cases, you may not be able to access your account email, including if your email has been hacked. In this case, you can create an account with another secure email, upgrade the tier level of that account, and transfer your assets via the friendly transfer feature.'
  // },
  {
    title: 'Why hasn`t the withdrawal arrived yet?',
    detail:
      'Due to the large number of withdrawals made by members every day, the system will take time to settle. Adhering to the queuing mode, payment is made according to the time. Therefore, during the peak period, when the number of users is large, it will naturally feel slower than usual, usually 24 hours. The process is completed within the time limit; another reason is that the withdrawal address you filled in is incorrect, which will cause the withdrawal to fail.'
  },
  {
    title: 'The transfer is wrong, can I get it back?',
    detail:
      ' This is the same reason that your bank card transfers money wrongly, and it is an irreversible operation; if you make a wrong transfer, you can contact customer service, and customer service will send an email to the other party. If the other party agrees, you can get it back. If the other party does not reply, we have no right to interfere; including the loss of funds due to the leakage of your own account password. Please keep your private information safe!'
  }
];

export default function FAQ() {
  const theme = useTheme();

  const isLight = theme.palette.mode === 'light';
  return (
    <Page title="FAQs | CryptoEver">
      <RootStyle>
        <Container maxWidth="lg">
          <Box sx={{ mb: 10, textAlign: 'center' }}>
            <MotionInView variants={varFadeInDown}>
              <Typography variant="h2" sx={{ mb: 3 }}>
                FAQs
              </Typography>
            </MotionInView>
            {FAQS.map((el, index) => (
              <MotionInView variants={varFadeInUp} key={index}>
                <Card
                  sx={{
                    p: 5,
                    boxShadow: (theme) =>
                      `0px 48px 80px ${alpha(isLight ? theme.palette.grey[500] : theme.palette.common.black, 0.48)}`,
                    textAlign: 'left',
                    mb: 4
                  }}
                >
                  <Typography variant="h5" mb={2}>
                    {el.title}
                  </Typography>
                  <Typography>{el.detail}</Typography>
                </Card>
              </MotionInView>
            ))}
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
