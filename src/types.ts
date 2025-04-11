export interface EMISchedule {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EMIResults {
  emi: number;
  totalInterest: number;
  totalAmount: number;
  schedule: EMISchedule[];
} 