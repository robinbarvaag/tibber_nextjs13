"use client";
import React, { useState } from "react";

interface Loan {
  id: number;
  paymentTime: number;
  loanAmount: number;
  extraPaymentEachMonth: number;
  interestRate: number;
}

interface LoanVisualizerProps {}

const LoanVisualizer2: React.FC<LoanVisualizerProps> = ({}) => {
  const [loans, setLoans] = useState<Loan[]>([
    {
      id: 1,
      paymentTime: 12,
      loanAmount: 1000,
      extraPaymentEachMonth: 0,
      interestRate: 10,
    },
    {
      id: 2,
      paymentTime: 12,
      loanAmount: 1000,
      extraPaymentEachMonth: 10,
      interestRate: 10,
    },
  ]);

  function calculateMonthlyPayment(PV: number, i: number, n: number): number {
    const interestEachMonth = i / 12;
    console.log("Interest each month: ", interestEachMonth);
    console.log("Total loan amount: ", PV);
    console.log("Number of payments: ", n);
    let PMT =
      PV * (interestEachMonth / (1 - Math.pow(1 + interestEachMonth, -n)));
    return PMT;
  }

  function calculateMonhlyPaymentWithExtra(
    PV: number,
    i: number,
    n: number,
    extra: number
  ): number {
    PV = PV - extra * n;
    let PMT = (PV * i) / (1 - Math.pow(1 + i, -n));
    return PMT;
  }

  function calculateTotalInterest(PV: number, i: number, n: number): number {
    let PMT = (PV * i) / (1 - Math.pow(1 + i, -n));
    return n * PMT - PV;
  }

  function calculateTotalInterestExtra(
    PV: number,
    i: number,
    n: number,
    extra
  ): number {
    PV = PV - extra * n;
    let PMT = (PV * i) / (1 - Math.pow(1 + i, -n));
    return n * PMT - PV;
  }

  const calculateTotalPayment = (loan: Loan) => {
    const monthlyInterestRate = loan.interestRate / 12 / 100;
    const numPayments = loan.paymentTime;
    const loanAmount = loan.loanAmount;

    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numPayments));

    return monthlyPayment * numPayments;
  };

  const calculateTotalPaymentWithExtra = (loan: Loan) => {
    const monthlyInterestRate = loan.interestRate / 12 / 100;
    const numPayments = loan.paymentTime;
    const loanAmount = loan.loanAmount;
    const extraPaymentEachMonth = loan.extraPaymentEachMonth;

    let remainingLoan = loanAmount;
    let totalPayment = 0;

    for (let i = 0; i < numPayments; i++) {
      const interestPayment = remainingLoan * monthlyInterestRate;
      const principalPayment =
        (loanAmount - extraPaymentEachMonth) / numPayments;

      totalPayment += interestPayment + principalPayment;
      remainingLoan -= principalPayment;
    }

    return totalPayment;
  };

  const calculateInterestCostWithoutExtra = (loan: Loan) => {
    const totalPayment = calculateTotalPayment(loan);
    const loanAmount = loan.loanAmount;

    return totalPayment - loanAmount;
  };

  const calculateInterestCost = (loan: Loan) => {
    const totalPaymentWithExtra = calculateTotalPaymentWithExtra(loan);
    const loanAmount = loan.loanAmount;

    return totalPaymentWithExtra - loanAmount;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 mt-5 border border-white rounded p-2">
          <div className="grid grid-cols-12 gap-5">
            {loans.map((loan) => {
              return (
                <div className="mt-5 col-span-6" key={loan.id}>
                  <div>
                    <p>
                      Total Payment:{" "}
                      {/* {formatCurrency(calculateTotalPayment(loan))} */}
                      {formatCurrency(
                        calculateMonthlyPayment(1903393, 0.0515, 81)
                      )}
                      {/* <div>
                        {formatCurrency(
                          calculateTotalInterest(1923938, 0.0515, 81)
                        )}
                      </div>
                      <div>
                        {formatCurrency(
                          calculateMonhlyPaymentWithExtra(25000, 0.04, 3, 10)
                        )}
                      </div>
                      <div>
                        {formatCurrency(
                          calculateTotalInterestExtra(25000, 0.04, 3, 10)
                        )}
                      </div> */}
                    </p>
                    {/* <p>
                      Total Payment with extra:{" "}
                      {formatCurrency(calculateTotalPaymentWithExtra(loan))}
                    </p>
                    <p>
                      Interest cost without extra:{" "}
                      {formatCurrency(calculateInterestCostWithoutExtra(loan))}
                    </p>
                    <p>
                      Interest cost with extra:{" "}
                      {formatCurrency(calculateInterestCost(loan))}
                    </p> */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanVisualizer2;
