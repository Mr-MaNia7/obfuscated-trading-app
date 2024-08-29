import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
import _ from 'lodash';
// material
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  CircularProgress,
  TableContainer
} from '@mui/material';
// utils
import Axios from '../../utils/axios';
import { SUPPORTED_COINS } from '../../utils/staticData';
import { fNumberWithDecimal } from '../../utils/formatNumber';
//
import Label from '../Label';
import Scrollbar from '../Scrollbar';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const STATUS = ['pending', 'failed', 'Success'];

// eslint-disable-next-line react/prop-types
export default function FriendlyTrxDetails({ reloadTrx }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLatestWithdrawTrx = async () => {
      try {
        const res = await Axios.get('/api/v1/transactions/getLastestFriendlyTrx');
        const { data } = res.data;
        setTransactions(data?.docs);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    getLatestWithdrawTrx();
  }, [reloadTrx]);

  return (
    <>
      <Card>
        <CardHeader title="Latest Friendly-Transfer Transactions" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 600, pb: 3 }}>
            {!loading && (
              <>
                {!_.isEmpty(transactions) && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: 150 }}>Asset</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Friend's account name</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Amount</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Confirmed At</TableCell>
                      </TableRow>
                    </TableHead>
                    <>
                      <TableBody>
                        {transactions.map((row) => (
                          <TableRow key={row._id}>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <img
                                  alt={row.asset}
                                  src={SUPPORTED_COINS[String(row.asset).toLowerCase()]?.icon}
                                  style={{ width: 30 }}
                                />
                                <Typography variant="subtitle2">{row.asset}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{row.friendAccountName}</TableCell>
                            <TableCell>
                              {fNumberWithDecimal(row.amount)} {row.asset}
                            </TableCell>
                            <TableCell>
                              <Label
                                variant={isLight ? 'ghost' : 'filled'}
                                color={(row.status === 2 && 'success') || (row.status === 0 && 'warning') || 'error'}
                              >
                                {sentenceCase(STATUS[row.status])}
                              </Label>
                            </TableCell>
                            <TableCell>{format(new Date(row.createdAt), "yyyy-MM-dd hh:mm aaaaa'm'")}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </>
                  </Table>
                )}
                {_.isEmpty(transactions) && (
                  <Typography sx={{ textAlign: 'center', mt: 2 }}>No Friendly Transfer Transactions</Typography>
                )}
              </>
            )}
            {loading && (
              <Stack alignItems="center">
                <CircularProgress />
              </Stack>
            )}
          </TableContainer>
        </Scrollbar>
      </Card>
    </>
  );
}
