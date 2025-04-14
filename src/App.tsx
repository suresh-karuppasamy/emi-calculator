import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Slider,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Tabs,
  Tab,
} from "@mui/material";
import Charts from "./components/Results/Charts";
import Report from "./components/Results/Report";
import TabPanel from "./components/Results/TabPanel";

interface EMISchedule {
  month: number;
  principal: number;
  interest: number;
  total: number;
  balance: number;
  emi: number;
}

interface EMIResults {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  schedule: EMISchedule[];
}

function App() {
  const [noOfEmis, setNoOfEmis] = useState<number>(12);
  const [amount, setAmount] = useState<number>(8000000);
  const [duration, setDuration] = useState<number>(240);
  const [interestRate, setInterestRate] = useState<number>(8.50);
  const [durationUnit, setDurationUnit] = useState<"Months" | "Years">(
    "Months"
  );
  const [selectedTab, setSelectedTab] = useState(0);
  const [emiAmount, setEmiAmount] = useState<number>(0);
  const [currentTotals, setCurrentTotals] = useState<EMIResults>({
    emi: 0,
    totalInterest: 0,
    totalAmount: 0,
    schedule: [],
  });
  const [currentSchedule, setCurrentSchedule] = useState<EMISchedule[]>([]);

  // Predefined amount buttons
  const amountOptions = [
    { label: "10L", value: 1000000 },
    { label: "20L", value: 2000000 },
    { label: "50L", value: 5000000 },
    { label: "1C", value: 10000000 },
    { label: "2C", value: 20000000 },
    { label: "5C", value: 50000000 },
    { label: "10C", value: 100000000 },
  ];

  const calculateEMISchedule = () => {
    const totalMonths = durationUnit === "Years" ? duration * 12 : duration;

    // Calculate EMI using standard formula for 12 EMIs per year
    const monthlyRate = interestRate / (12 * 100);
    const emi =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    // For 13 EMIs per year, we'll calculate until balance becomes zero
    const adjustedMonthlyRate =
      noOfEmis === 13
        ? interestRate / (13 * 100) // For 13 EMIs per year
        : monthlyRate; // For 12 EMIs per year

    const schedule: EMISchedule[] = [];
    let balance = amount;
    let totalInterest = 0;
    let month = 1;

    while (balance > 0 && month <= totalMonths * 2) {
      // Safety check to prevent infinite loop
      const interest = balance * adjustedMonthlyRate;
      const principal = emi - interest;
      balance = Math.max(0, balance - principal);

      schedule.push({
        month,
        principal: Number(principal.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        total: Number(emi.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        emi: Number(emi.toFixed(2)),
      });

      totalInterest += interest;
      month++;

      // Break if balance is very close to zero
      if (balance < 1) break;
    }

    return {
      emi,
      totalInterest,
      totalAmount: amount + totalInterest,
      schedule,
    };
  };

  // Update useEffect to recalculate when noOfEmis changes
  useEffect(() => {
    const totals = calculateEMISchedule();
    setEmiAmount(Math.round(totals.emi));
    setCurrentTotals(totals);
    setCurrentSchedule(totals.schedule);
  }, [amount, interestRate, duration, durationUnit, noOfEmis]);

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleInterestRateChange = (value: number) => {
    setInterestRate(value);
  };

  const handleDurationChange = (value: number) => {
    setDuration(value);
  };

  const handleDurationUnitChange = (
    _: React.MouseEvent<HTMLElement>,
    newUnit: "Months" | "Years"
  ) => {
    if (newUnit !== null) {
      setDurationUnit(newUnit);
      if (newUnit === "Years") {
        setDuration(Math.round(duration / 12));
      } else {
        setDuration(duration * 12);
      }
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setNoOfEmis(newValue === 1 ? 13 : 12);
  };

  const handleEmiAmountChange = (newValue: number) => {
    setEmiAmount(newValue);
    const newSchedule = calculateEMISchedule();
    setCurrentSchedule(newSchedule.schedule);
    setCurrentTotals(newSchedule);
  };

  return (
    <Box sx={{ p: 3, margin: "0 auto" }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Calculate EMI for your Housing Loan
          </Typography>

          <Grid container spacing={1} component="div">
            {/* Left side - Input form */}
            <Grid size={{ xs: 12, md: 4 }} component="div">
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Amount
                </Typography>
                <TextField
                  fullWidth
                  value={amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                  {amount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {amountOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        amount === option.value ? "contained" : "outlined"
                      }
                      onClick={() => handleAmountChange(option.value)}
                      sx={{
                        bgcolor:
                          amount === option.value ? "#002A4C" : "transparent",
                        color: amount === option.value ? "white" : "#002A4C",
                        "&:hover": {
                          bgcolor:
                            amount === option.value
                              ? "#002A4C"
                              : "rgba(0, 42, 76, 0.1)",
                        },
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  EMI Amount
                </Typography>
                <TextField
                  fullWidth
                  value={emiAmount}
                  onChange={(e) =>
                    handleEmiAmountChange(Number(e.target.value))
                  }
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                  }}
                />
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                  {emiAmount.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Illustrative Interest Rate (p.a)*
                </Typography>
                <TextField
                  fullWidth
                  value={interestRate}
                  onChange={(e) =>
                    handleInterestRateChange(Number(e.target.value))
                  }
                  InputProps={{
                    endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                  }}
                />
                <Slider
                  value={interestRate}
                  onChange={(_, value) =>
                    handleInterestRateChange(value as number)
                  }
                  min={5.0}
                  max={16.65}
                  step={0.01}
                  sx={{
                    color: "#002A4C",
                    "& .MuiSlider-thumb": {
                      bgcolor: "white",
                      border: "2px solid currentColor",
                    },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption">10.85%</Typography>
                  <Typography variant="caption">16.65%</Typography>
                </Box>
              </Box>

              <Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Typography variant="subtitle1">Duration</Typography>
                  <ToggleButtonGroup
                    value={durationUnit}
                    exclusive
                    onChange={handleDurationUnitChange}
                    size="small"
                  >
                    <ToggleButton
                      value="Months"
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: "#002A4C",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#002A4C",
                          },
                        },
                      }}
                    >
                      Months
                    </ToggleButton>
                    <ToggleButton
                      value="Years"
                      sx={{
                        "&.Mui-selected": {
                          bgcolor: "#002A4C",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#002A4C",
                          },
                        },
                      }}
                    >
                      Years
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <TextField
                  fullWidth
                  value={duration}
                  onChange={(e) => handleDurationChange(Number(e.target.value))}
                  InputProps={{
                    endAdornment: (
                      <Typography sx={{ ml: 1 }}>{durationUnit}</Typography>
                    ),
                  }}
                />
                <Slider
                  value={duration}
                  onChange={(_, value) => handleDurationChange(value as number)}
                  min={durationUnit === "Years" ? 1 : 12}
                  max={durationUnit === "Years" ? 30 : 360}
                  step={durationUnit === "Years" ? 1 : 1}
                  sx={{
                    color: "#002A4C",
                    "& .MuiSlider-thumb": {
                      bgcolor: "white",
                      border: "2px solid currentColor",
                    },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption">
                    {durationUnit === "Years" ? "1 Year" : "12 Months"}
                  </Typography>
                  <Typography variant="caption">
                    {durationUnit === "Years" ? "30 Years" : "360 Months"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right side - Results */}
            {currentTotals && (
              <>
                <Grid size={{ xs: 12, md: 8 }} component="div">
                  <Tabs value={selectedTab} onChange={handleTabChange}>
                    <Tab label="12 EMIs per year (Fixed EMI)" />
                    <Tab label="13 EMIs per year (Same EMI)" />
                  </Tabs>

                  <TabPanel value={selectedTab} index={0}>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12, md: 8 }} component="div">
                        <Report
                          amount={amount}
                          totals={currentTotals}
                          emiSchedule={currentSchedule}
                          selectedTab={0}
                          onTabChange={handleTabChange}
                          noOfEmis={12}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }} component="div">
                        <Charts
                          amount={amount}
                          totals={currentTotals}
                          noOfEmis={noOfEmis}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>

                  <TabPanel value={selectedTab} index={1}>
                    <Grid container spacing={1} component="div">
                      <Grid size={{ xs: 12, md: 8 }} component="div">
                        <Report
                          amount={amount}
                          totals={currentTotals}
                          emiSchedule={currentSchedule}
                          selectedTab={1}
                          onTabChange={handleTabChange}
                          noOfEmis={13}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }} component="div">
                        <Charts
                          amount={amount}
                          totals={currentTotals}
                          noOfEmis={noOfEmis}
                        />
                      </Grid>
                    </Grid>
                  </TabPanel>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
