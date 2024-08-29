import React from 'react';
// material
import { Grid } from '@mui/material';
// components
import TotalBalance from './TotalBalance';
import TrendingBox from './TrendingBox';
import CurrentBalance from './CurrentBalance';

export default function InternalWallet() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <TotalBalance />
        <TrendingBox />
      </Grid>

      <Grid item xs={12} md={5}>
        <CurrentBalance />
      </Grid>
    </Grid>
  );
}
