export const generateAmortizationTable = (
  loan: Loan,
  addTotal,
  returnWhenDateIsFound: Date | null = null
): any[] | number => {
  const amortizationTable: any[] = [];
  const startDate = new Date();
  const currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1
  );
  const monthOffset = currentDate.getMonth();
  let remainingLoanAmount = loan.loanAmount;
  let month = currentDate.getMonth(); // Start from the current month
  let gracePeriodMonths = loan.gracePeriod;
  let isGracePeriod = loan.gracePeriod > 0;

  // Variables to track yearly totals
  let yearInterest = 0;
  let yearPrincipal = 0;
  let yearTotal = 0;

  while (isFinite(remainingLoanAmount) && remainingLoanAmount > 0) {
    const interestPayment =
      remainingLoanAmount * (loan.interestRate / 12 / 100);

    let principalPayment = 0;
    let totalPayment = 0;
    let displayMonth = (currentDate.getMonth() + month - monthOffset) % 12;
    let displayYear =
      currentDate.getFullYear() +
      Math.floor((currentDate.getMonth() + month - monthOffset) / 12);

    if (isGracePeriod) {
      principalPayment = loan.extraPaymentEachMonth;
      totalPayment = interestPayment + loan.extraPaymentEachMonth;
    } else {
      const totalMonthlyPayment = calculateMonthlyPayment(loan);
      principalPayment = totalMonthlyPayment - interestPayment;
      totalPayment = totalMonthlyPayment;

      displayMonth =
        (currentDate.getMonth() + month - monthOffset - gracePeriodMonths) % 12;
      displayYear =
        currentDate.getFullYear() +
        Math.floor(
          (currentDate.getMonth() + month - monthOffset - gracePeriodMonths) /
            12
        );
    }

    remainingLoanAmount -= principalPayment;
    gracePeriodMonths = Math.max(gracePeriodMonths - 1, 0);

    yearInterest += interestPayment; // Accumulate yearly interest
    yearPrincipal += principalPayment; // Accumulate yearly principal
    yearTotal += totalPayment; // Accumulate yearly total

    const row = {
      month: `${displayMonth + 1}/15/${displayYear}`,
      interestPayment: interestPayment.toFixed(2),
      principalPayment: principalPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      remainingLoanAmount: Math.max(remainingLoanAmount, 0).toFixed(2),
    };

    if (
      returnWhenDateIsFound !== null &&
      returnWhenDateIsFound?.getMonth() === displayMonth &&
      returnWhenDateIsFound?.getFullYear() === displayYear
    ) {
      return totalPayment;
    }
    month++;
    isGracePeriod = gracePeriodMonths > 0;
    amortizationTable.push(row);

    // Check if it's a new year
    if (displayMonth == 11 && addTotal) {
      const yearEndRow = {
        month: `SUM ${displayYear}`,
        interestPayment: yearInterest.toFixed(2),
        principalPayment: yearPrincipal.toFixed(2),
        totalPayment: yearTotal.toFixed(2),
        remainingLoanAmount: row.remainingLoanAmount,
      };

      amortizationTable.push(yearEndRow);

      // Reset yearly totals
      yearInterest = 0;
      yearPrincipal = 0;
      yearTotal = 0;
    }
  }

  //   //find last row in table
  //   const lastRow = amortizationTable[amortizationTable.length - 1];
  //   const lastRowDate = new Date(lastRow.month);
  //   const lastRowMonth = lastRowDate.getMonth();
  //   const lastRowYear = lastRowDate.getFullYear();

  //   const compareDebtDate = debtFreeDate;
  //   const compareDebtMonth = compareDebtDate.getMonth();
  //   const compareDebtYear = compareDebtDate.getFullYear();

  //   const desiredId = loan.loanGroupId;
  //   //get all loans with the same id as current loan
  //   const loansWithSameId = loans.filter(
  //     (loan) => loan.loanGroupId === desiredId
  //   );
  //   //check if current loan, is the loan with the highest loan amount
  //   const loanWithHighestLoanAmount = loansWithSameId.reduce(
  //     (maxLoan, currentLoan) => {
  //       if (currentLoan.loanAmount > maxLoan.loanAmount) {
  //         return currentLoan;
  //       }
  //       return maxLoan;
  //     }
  //   );

  //   console.log(lastRowYear < compareDebtYear);

  //   if (
  //     loanWithHighestLoanAmount.id === loan.id &&
  //     lastRowYear < compareDebtYear
  //   ) {
  //     setDebtFreeDate(lastRowDate);
  //   }

  return amortizationTable;
};

export const calculateMonthlyPayment = (loan: Loan) => {
  const monthlyInterestRate = loan.interestRate / 12 / 100;
  const numPayments = loan.paymentTimeYears * 12 + loan.paymentTimeMonths;
  const loanAmountWithFees = loan.loanAmount;
  const monthlyPayment =
    (loanAmountWithFees * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numPayments));
  const totalMonthlyPayment = monthlyPayment;
  return totalMonthlyPayment + loan.insurance + loan.fees;
};

export const formatCurrency = (value: number): string => {
  // Format the value using Intl.NumberFormat with the appropriate options
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK", // Replace "USD" with the desired currency code
    minimumFractionDigits: 2,
  }).format(value);
};

export const calculateTotalPayment = (loan: Loan) => {
  const monthlyPayment = calculateMonthlyPayment(loan);
  const numPayments = loan.paymentTimeYears * 12 + loan.paymentTimeMonths;
  return monthlyPayment * numPayments;
};

const calculateMonthlyPaymentWithoutExtra = (loan: Loan) => {
  const monthlyInterestRate = loan.interestRate / 12 / 100;
  const numPayments = loan.paymentTimeYears * 12 + loan.paymentTimeMonths;
  const loanAmountWithFees =
    loan.loanAmount -
    loan.extraPaymentEachMonth *
      (loan.paymentTimeYears * 12 + loan.paymentTimeMonths);
  const monthlyPayment =
    (loanAmountWithFees * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numPayments));
  const totalMonthlyPayment = monthlyPayment + loan.insurance + loan.fees;
  return totalMonthlyPayment;
};

export const calculateTotalPaymentWithExtra = (loan: Loan) => {
  const monthlyPayment = calculateMonthlyPaymentWithoutExtra(loan);
  const numPayments = loan.paymentTimeYears * 12 + loan.paymentTimeMonths;
  return monthlyPayment * numPayments;
};

export const calculateTotalPaymentGroup = (loans: Loan[]) => {
  const totalPayment = loans.reduce(
    (total, loan) => total + calculateTotalPayment(loan),
    0
  );
  return totalPayment;
};

export const calculateInterestCostWithExtra = (loan: Loan) => {
  const totalPayment = calculateTotalPaymentWithExtra(loan);
  const loanAmountWithFees = loan.loanAmount + loan.fees;
  return totalPayment - loanAmountWithFees;
};

export const calculateTotalPaymentGroupWithExtra = (loans: Loan[]) => {
  const totalPayment = loans.reduce(
    (total, loan) => total + calculateTotalPaymentWithExtra(loan),
    0
  );
  return totalPayment;
};

export const calculateInterestCost = (loan: Loan) => {
  const totalPayment = calculateTotalPayment(loan);
  const loanAmountWithFees = loan.loanAmount + loan.fees;
  return totalPayment - loanAmountWithFees;
};

export const calculateInterestCostGroup = (loans: Loan[]) => {
  const totalPayment = loans.reduce(
    (total, loan) => total + calculateTotalPayment(loan),
    0
  );
  const loanAmountWithFees = loans.reduce(
    (total, loan) => total + loan.loanAmount + loan.fees,
    0
  );
  return totalPayment - loanAmountWithFees;
};

export const calculateInterestCostGroupWithExtra = (loans: Loan[]) => {
  const totalPayment = loans.reduce(
    (total, loan) => total + calculateTotalPaymentWithExtra(loan),
    0
  );
  const loanAmountWithFees = loans.reduce(
    (total, loan) => total + loan.loanAmount + loan.fees,
    0
  );
  return totalPayment - loanAmountWithFees;
};

export const calculateNextPaymentGroup = (loans: Loan[]) => {
  if (loans.length === 0) {
    return 0;
  }

  if (loans[0] === undefined) {
    return 0;
  }

  const nextPayment = loans.reduce(
    (total, loan) =>
      total + (generateAmortizationTable(loan, false, new Date()) as number),
    0
  );

  // var nextPayment = generateAmortizationTable(loans[0], false, new Date());

  return nextPayment as number;
};
