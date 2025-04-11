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
  Button,
} from "@mui/material";
import * as XLSX from "xlsx";
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
  selectedTab,
  noOfEmis,
}) => {
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const formatDate = (month: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      emiSchedule.map((item) => ({
        Month: item.month,
        Date: formatDate(item.month - 1),
        EMI: item.emi,
        Principal: item.principal,
        Interest: item.interest,
        Balance: item.balance,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      `EMI_Schedule_${noOfEmis}_Months`
    );
    XLSX.writeFile(workbook, `emi_schedule_${noOfEmis}_months.xlsx`);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">
          {noOfEmis === 13
            ? "13 EMIs per Year Schedule"
            : "12 EMIs per Year Schedule"}
        </Typography>
      </Box>

      <TableContainer
        sx={{
          maxHeight: 400,
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
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Principal</TableCell>
              <TableCell align="right">Interest</TableCell>
              <TableCell align="right">EMI</TableCell>
              <TableCell align="right">Balance</TableCell>
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
