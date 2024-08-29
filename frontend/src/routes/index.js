import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          )
        },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'get-account-name', element: <GetAccountName /> },
        { path: 'verify', element: <VerifyCode /> }
      ]
    },

    // Dashboard Routes
    {
      path: 'en-US',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/en-US/wallet" replace /> },
        { path: 'wallet', element: <Wallet /> },
        { path: 'deposit', element: <Deposit /> },
        { path: 'withdraw', element: <Withdraw /> },
        { path: 'friendly-transfer', element: <FriendlyTransfer /> },
        { path: 'memberTier', element: <MemberTier /> },
        {
          path: 'app',
          children: [
            { element: <Navigate to="/en-US/app/four" replace /> },
            { path: 'update-password', element: <UpdatePassword /> },
            { path: 'update-transaction-key', element: <UpdateTransactionKey /> }
          ]
        },
        {
          path: 'admin',
          children: [
            { element: <Navigate to="/en-US/admin/send-message" replace /> },
            { path: 'send-message', element: <SendMessage /> },
            { path: 'send-email', element: <SendEmail /> }
          ]
        },
        { path: 'faq', element: <FAQ /> },
        { path: 'Contact-us', element: <ContactUs /> }
      ]
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [{ element: <LandingPage /> }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Register = Loadable(lazy(() => import('../pages/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const GetAccountName = Loadable(lazy(() => import('../pages/authentication/GetAccountName')));
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));
// Dashboard
const Wallet = Loadable(lazy(() => import('../pages/Wallet')));
const Deposit = Loadable(lazy(() => import('../pages/Deposit')));
const Withdraw = Loadable(lazy(() => import('../pages/Withdraw')));
const FriendlyTransfer = Loadable(lazy(() => import('../pages/FriendlyTransfer')));
const MemberTier = Loadable(lazy(() => import('../pages/MemberTier')));
const FAQ = Loadable(lazy(() => import('../pages/FAQ')));
const ContactUs = Loadable(lazy(() => import('../pages/ContactUs')));
const UpdatePassword = Loadable(lazy(() => import('../pages/UpdatePassword')));
const UpdateTransactionKey = Loadable(lazy(() => import('../pages/UpdateTransactionKey')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
//
const SendMessage = Loadable(lazy(() => import('../pages/SendMessage')));
const SendEmail = Loadable(lazy(() => import('../pages/SendEmail')));
// Main
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
