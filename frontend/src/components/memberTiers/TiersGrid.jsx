// material
import { Grid } from '@mui/material';
//
import { varFadeInUp, MotionInView, varFadeInDown } from '../animate';
import PlanCard from './PlanCard';

export default function TiersGrid() {
  const PLANS = [
    {
      tier: 0,
      license: 'Basic',
      required: 0,
      commons: ['Deposit', 'Withdraw', 'Daily withdrawal limit: 20 USD', 'Transaction fee: 2%'],
      options: [],
      disabled: ['Friendly transfer', 'Friendly receive', 'Friendly limit: 0 USD/day', 'Savings reward: Not supported'],
      icon: '/static/tiers/basic.svg'
    },
    {
      tier: 1,
      license: 'Bronze',
      required: 200,
      commons: ['Deposit', 'Withdraw', 'Daily withdrawal limit: 500 USD', 'Transaction fee: 1%'],
      options: ['Friendly transfer', 'Friendly receive', 'Friendly limit: 1,000 USD/day'],
      disabled: ['Savings reward: Not supported'],
      icon: '/static/tiers/bronze.svg'
    },
    {
      tier: 2,
      license: 'Silver',
      required: 500,
      commons: ['Deposit', 'Withdraw', 'Daily withdrawal limit: 1,000 USD', 'Transaction fee: 0.5%'],
      options: ['Friendly transfer', 'Friendly receive', 'Friendly limit: 5,000 USD/day', 'Savings reward: 2.48 % APY'],
      disabled: [],
      icon: '/static/tiers/silver.svg'
    },
    {
      tier: 3,
      license: 'Gold',
      required: 1000,
      commons: ['Deposit', 'Withdraw', 'Daily withdrawal limit: 5,000 USD', 'Transaction fee: 0.5%'],
      options: [
        'Friendly transfer',
        'Friendly receive',
        'Friendly limit: 20,000 USD/day',
        'Savings reward: 3.99 % APY'
      ],
      disabled: [],
      icon: '/static/tiers/gold.svg'
    },
    {
      tier: 4,
      license: 'Platinum',
      required: 2000,
      commons: ['Deposit', 'Withdraw', 'Daily withdrawal limit: Unlimited', 'Transaction fee: 0.2%'],
      options: [
        'Friendly transfer',
        'Friendly receive',
        'Friendly limit: 100,000 USD/day',
        'Savings reward: 8.35 % APY'
      ],
      disabled: [],
      icon: '/static/tiers/platinum.svg'
    },
    {
      tier: 5,
      license: 'Diamond',
      required: 10000,
      commons: ['Deposit', 'Withdraw', 'Daily withdrawal limit: Unlimited', 'Transaction fee: 0.1%'],
      options: ['Friendly transfer', 'Friendly receive', 'Friendly limit: Unlimited', 'Savings reward: 10.62 % APY'],
      disabled: [],
      icon: '/static/tiers/diamond.svg'
    }
  ];

  return (
    <Grid container spacing={5}>
      {PLANS.map((plan, index) => (
        <Grid key={plan.license} item xs={12} md={4}>
          <MotionInView variants={index === 1 ? varFadeInDown : varFadeInUp}>
            <PlanCard plan={plan} cardIndex={index} />
          </MotionInView>
        </Grid>
      ))}
    </Grid>
  );
}
