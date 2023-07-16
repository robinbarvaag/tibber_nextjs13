interface LoanGroup {
  id: number;
  loans: Loan[];
  name: string;
}

interface Loan {
  id: number;
  paymentTimeYears: number;
  paymentTimeMonths: number;
  loanAmount: number;
  extraPayments: number[];
  extraPaymentEachMonth: number;
  fees: number;
  insurance: number;
  interestRate: number;
  gracePeriod: number;
  loanGroupId: number;
  showTable?: boolean;
}

interface LoanVisualizerProps {
  data: any;
}
