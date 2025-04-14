import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import { EMIResults, EMISchedule } from "../../types";

interface ReportProps {
  amount: number;
  totals: EMIResults;
  emiSchedule: EMISchedule[];
  selectedTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  noOfEmis: number;
}

const Report: React.FC<ReportProps> = ({
  amount,
  totals,
  emiSchedule,
  noOfEmis,
}) => {
  const formatCurrency = (value: number) => {
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  };

  const formatDate = (month: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3}}>
          <Typography variant="subtitle2" color="text.secondary">Principal Amount</Typography>
          <Typography variant="h6">{formatCurrency(amount)}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3}}>
          <Typography variant="subtitle2" color="text.secondary">Interest Amount</Typography>
          <Typography variant="h6">{formatCurrency(totals.totalInterest)}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3}}>
          <Typography variant="subtitle2" color="text.secondary">Total EMI Amount</Typography>
          <Typography variant="h6">{formatCurrency(totals.totalAmount)}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3}}>
          <Typography variant="subtitle2" color="text.secondary">EMI to be paid each year</Typography>
          <Typography variant="h6">{formatCurrency(emiSchedule[0]?.emi * noOfEmis || 0)}</Typography>
        </Grid>
      </Grid>

      <TableContainer
        sx={{
          width: '100%',
          maxHeight: '100vh',
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "4px",
            "&:hover": {
              background: "#555",
            },
          },
        }}
      >
        <Table stickyHeader sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '10%' }}>Month</TableCell>
              <TableCell sx={{ width: '15%' }}>Date</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>Principal</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>Interest</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>EMI</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emiSchedule.map((row) => (
              <TableRow key={row.month}>
                <TableCell>{row.month}</TableCell>
                <TableCell>{formatDate(row.month - 1)}</TableCell>
                <TableCell align="right">
                  {formatCurrency(row.principal)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.interest)}
                </TableCell>
                <TableCell align="right">{formatCurrency(row.emi)}</TableCell>
                <TableCell align="right">
                  {formatCurrency(row.balance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Report;