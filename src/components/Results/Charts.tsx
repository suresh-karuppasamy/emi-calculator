import { Box, Typography, Paper } from "@mui/material";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { EMIResults } from "../../types";

ChartJS.register(ArcElement, ChartTooltip, Legend);

interface ChartsProps {
  amount: number;
  totals: EMIResults;
  noOfEmis: number;
}

const Charts = ({ amount, totals }: ChartsProps) => {
  const pieData = {
    labels: ["Principal Amount", "Total Interest"],
    datasets: [
      {
        data: [amount, Math.round(totals.totalInterest)],
        backgroundColor: ["#002A4C", "#FF6B6B"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `₹${value.toLocaleString("en-IN")}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#FFF5EB",
        p: 3,
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle1">Monthly EMI</Typography>
          <Typography variant="h3" sx={{ color: "#002A4C", mb: 3 }}>
            ₹{Math.round(totals.emi).toLocaleString("en-IN")}*
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Principal Amount
              </Typography>
              <Typography variant="body1" sx={{ color: "#002A4C" }}>
                ₹{amount.toLocaleString("en-IN")}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Interest Payable
              </Typography>
              <Typography variant="body1" sx={{ color: "#002A4C" }}>
                ₹{Math.round(totals.totalInterest).toLocaleString("en-IN")}*
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Amount Payable
              </Typography>
              <Typography variant="body1" sx={{ color: "#002A4C" }}>
                ₹{Math.round(totals.totalAmount).toLocaleString("en-IN")}*
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ height: 200, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Payment Breakdown
          </Typography>
          <Pie data={pieData} options={pieOptions} />
        </Box>
      </Box>
    </Paper>
  );
};

export default Charts;
