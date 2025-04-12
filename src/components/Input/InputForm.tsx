import {
  Box,
  TextField,
  Slider,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

interface InputFormProps {
  amount: number;
  emiAmount: number;
  interestRate: number;
  duration: number;
  durationUnit: "Months" | "Years";
  onAmountChange: (value: number) => void;
  onInterestRateChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onDurationUnitChange: (event: React.MouseEvent<HTMLElement>, newUnit: "Months" | "Years") => void;
}

const amountOptions = [
  { label: "10L", value: 1000000 },
  { label: "20L", value: 2000000 },
  { label: "50L", value: 5000000 },
  { label: "1C", value: 10000000 },
  { label: "2C", value: 20000000 },
  { label: "5C", value: 50000000 },
  { label: "10C", value: 100000000 },
];

export const InputForm: React.FC<InputFormProps> = ({
  amount,
  emiAmount,
  interestRate,
  duration,
  durationUnit,
  onAmountChange,
  onInterestRateChange,
  onDurationChange,
  onDurationUnitChange,
}) => {
  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Amount
        </Typography>
        <TextField
          fullWidth
          value={amount}
          onChange={(e) => onAmountChange(Number(e.target.value))}
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
              variant={amount === option.value ? "contained" : "outlined"}
              onClick={() => onAmountChange(option.value)}
              sx={{
                bgcolor: amount === option.value ? "#002A4C" : "transparent",
                color: amount === option.value ? "white" : "#002A4C",
                "&:hover": {
                  bgcolor: amount === option.value ? "#002A4C" : "rgba(0, 42, 76, 0.1)",
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
          disabled
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
          onChange={(e) => onInterestRateChange(Number(e.target.value))}
          InputProps={{
            endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
          }}
        />
        <Slider
          value={interestRate}
          onChange={(_, value) => onInterestRateChange(value as number)}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="subtitle1">Duration</Typography>
          <ToggleButtonGroup
            value={durationUnit}
            exclusive
            onChange={onDurationUnitChange}
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
          onChange={(e) => onDurationChange(Number(e.target.value))}
          InputProps={{
            endAdornment: (
              <Typography sx={{ ml: 1 }}>{durationUnit}</Typography>
            ),
          }}
        />
        <Slider
          value={duration}
          onChange={(_, value) => onDurationChange(value as number)}
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
    </>
  );
}; 