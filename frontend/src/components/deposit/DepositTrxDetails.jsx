import { useEffect, useState } from 'react';
import { format } from 'date-fns';
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

const STATUS = ['Waiting for funds', 'Expired', 'Success'];
const EXPEIRE_TIME = 2 * 3600 * 1000;

// eslint-disable-next-line react/prop-types
export default function DepositTrxDetails({ reloadTrx }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLatestDepositTrx = async () => {
      try {
        const res = await Axios.get('/api/v1/transactions/getLatestDepositTrx');
        const { data } = res.data;
        setTransactions(data?.docs);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    getLatestDepositTrx();
  }, [reloadTrx]);

  return (
    <>
      <Card>
        <CardHeader title="Latest Deposit Transactions" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720, pb: 3 }}>
            {!loading && (
              <>
                {!_.isEmpty(transactions) && (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: 150 }}>Asset</TableCell>
                        <TableCell sx={{ minWidth: 150 }}>Reference Code</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Amount</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Requested At</TableCell>
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
                            <TableCell>{row.referenceCode}</TableCell>
                            <TableCell>
                              {fNumberWithDecimal(row.amount)} {row.asset}
                            </TableCell>
                            <TableCell>
                              <Label
                                variant={isLight ? 'ghost' : 'filled'}
                                color={(row.status === 2 && 'success') || (row.status === 0 && 'warning') || 'error'}
                              >
                                {row?.status === 0 &&
                                  (Date.now() >= Date.parse(row.createdAt) + EXPEIRE_TIME ? STATUS[1] : STATUS[0])}
                                {row?.status === 2 && STATUS[2]}
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
                  <Typography sx={{ textAlign: 'center', mt: 2 }}>No Deposit Transactions</Typography>
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
