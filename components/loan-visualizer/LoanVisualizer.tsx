"use client";
import React, { useState, useMemo } from "react";
import cn from "classnames";
import classes from "./LoanVisualizer.module.scss";
import LoanGraphVisualizer from "./LoanGraphVisualizer";
import LoanGraphVisualizer2 from "./LoanGraphVisualizer2";

interface LoanGroup {
  id: number;
  loans: Loan[];
  name: string;
}

interface Loan {
  id: number;
  paymentTime: number;
  loanAmount: number;
  extraPayments: number[];
  fees: number;
  insurance: number;
  interestRate: number;
  gracePeriod: number;
  loanGroupId: number;
}

interface LoanVisualizerProps {
  initialInterestRate: number;
}

const LoanVisualizer: React.FC<LoanVisualizerProps> = ({}) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanGroups, setLoanGroups] = useState<LoanGroup[]>([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [loanGroupSelected, setLoanGroupSelected] = useState<LoanGroup | null>(
    null
  );

  const handleInterestRateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    loanId: number
  ) => {
    const newInterestRate = parseFloat(event.target.value);
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId ? { ...loan, interestRate: newInterestRate } : loan
    );
    setLoans(updatedLoans);
  };

  const addLoan = () => {
    if (loanGroupSelected === null) {
      alert("Please select a loan group first");
      return;
    }

    const newLoan: Loan = {
      id: loans.length + 1,
      paymentTime: 360,
      loanAmount: 10122025,
      extraPayments: [],
      fees: 70,
      insurance: 0,
      interestRate: 5.08,
      loanGroupId: loanGroupSelected.id,
      gracePeriod: 80,
    };
    setLoans([...loans, newLoan]);
  };

  const addLoanGroup = () => {
    const newLoanGroupName = document.getElementById(
      "newLoanGroupName"
    ) as HTMLInputElement;
    const newLoanGroup: LoanGroup = {
      id: loanGroups.length + 1,
      loans: [],
      name: newLoanGroupName?.value || "New Loan Group",
    };
    setLoanGroups([...loanGroups, newLoanGroup]);
  };

  const handlePaymentTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    loanId: number
  ) => {
    const newPaymentTimeInYears = parseInt(event.target.value);
    const newPaymentTimeInMonths = newPaymentTimeInYears * 12;
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId
        ? { ...loan, paymentTime: newPaymentTimeInMonths }
        : loan
    );
    setLoans(updatedLoans);
  };

  const handleLoanAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    loanId: number
  ) => {
    const newLoanAmount = parseInt(event.target.value);
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId ? { ...loan, loanAmount: newLoanAmount } : loan
    );
    setLoans(updatedLoans);
  };

  const handleLoanGracePeriode = (
    event: React.ChangeEvent<HTMLInputElement>,
    loanId: number
  ) => {
    const newGracePeriode = parseInt(event.target.value);
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId ? { ...loan, gracePeriod: newGracePeriode } : loan
    );
    setLoans(updatedLoans);
  };

  const handleExtraPaymentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    loanId: number
  ) => {
    const newExtraPayment = parseInt(event.target.value);
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId
        ? { ...loan, extraPayments: [...loan.extraPayments, newExtraPayment] }
        : loan
    );
    setLoans(updatedLoans);
  };

  const handleFeesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    loanId: number
  ) => {
    const newFees = parseInt(event.target.value);
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId
        ? { ...loan, fees: Number.isNaN(newFees) ? 0 : newFees }
        : loan
    );
    setLoans(updatedLoans);
  };

  const handleInsuranceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    loanId: number
  ) => {
    const newInsurance = parseInt(event.target.value);
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId ? { ...loan, insurance: newInsurance } : loan
    );
    setLoans(updatedLoans);
  };

  const calculateMonthlyPayment = (loan: Loan, month: number) => {
    const monthlyInterestRate = loan.interestRate / 12 / 100;
    const numPayments = loan.paymentTime;
    const loanAmountWithFees = loan.loanAmount;
    const monthlyPayment =
      (loanAmountWithFees * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numPayments));
    const totalMonthlyPayment = monthlyPayment + loan.insurance + loan.fees;
    const extraPaymentTotal = loan.extraPayments
      .slice(0, month)
      .reduce((total, payment) => total + payment, 0);
    return (totalMonthlyPayment + extraPaymentTotal).toFixed(2);
  };

  const calculateTotalPaymentGroup = (loans: Loan[]) => {
    const totalPayment = loans.reduce(
      (total, loan) => total + parseFloat(calculateTotalPayment(loan)),
      0
    );
    return formatCurrency(totalPayment);
  };

  const calculateInterestCostGroup = (loans: Loan[]) => {
    const totalPayment = loans.reduce(
      (total, loan) => total + parseFloat(calculateTotalPayment(loan)),
      0
    );
    const loanAmountWithFees = loans.reduce(
      (total, loan) => total + loan.loanAmount + loan.fees,
      0
    );
    return formatCurrency(totalPayment - loanAmountWithFees);
  };

  const calculateTotalPayment = (loan: Loan, format: boolean = false) => {
    const monthlyPayment = parseFloat(
      calculateMonthlyPayment(loan, loan.paymentTime)
    );
    const numPayments = loan.paymentTime;
    if (format) {
      return formatCurrency(monthlyPayment * numPayments);
    }
    return (monthlyPayment * numPayments).toFixed(2);
  };

  const calculateInterestCost = (loan: Loan) => {
    const totalPayment = parseFloat(calculateTotalPayment(loan));
    const loanAmountWithFees = loan.loanAmount + loan.fees;
    return formatCurrency(totalPayment - loanAmountWithFees);
  };

  const generateAmortizationTable = (loan: Loan, addTotal: false) => {
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
    let year = currentDate.getFullYear();
    let yearInterest = 0;
    let yearPrincipal = 0;
    let yearTotal = 0;

    while (remainingLoanAmount > 0 && month <= loan.paymentTime) {
      const interestPayment =
        remainingLoanAmount * (loan.interestRate / 12 / 100);

      let principalPayment = 0;
      let totalPayment = 0;
      let displayMonth = (currentDate.getMonth() + month - monthOffset) % 12;
      let displayYear =
        currentDate.getFullYear() +
        Math.floor((currentDate.getMonth() + month - monthOffset) / 12);

      if (isGracePeriod) {
        principalPayment = 0;
        totalPayment = interestPayment;
      } else {
        principalPayment =
          parseFloat(calculateMonthlyPayment(loan, month)) - interestPayment;
        totalPayment = parseFloat(calculateMonthlyPayment(loan, month));

        displayMonth =
          (currentDate.getMonth() + month - monthOffset - gracePeriodMonths) %
          12;
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

      amortizationTable.push(row);
      month++;
      isGracePeriod = gracePeriodMonths > 0;

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
        year = displayYear;
        yearInterest = 0;
        yearPrincipal = 0;
        yearTotal = 0;
      }
    }

    return amortizationTable;
  };

  const formatCurrency = (value: number): string => {
    // Format the value using Intl.NumberFormat with the appropriate options
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK", // Replace "USD" with the desired currency code
      minimumFractionDigits: 2,
    }).format(value);
  };

  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <div>
      <div>
        <div className="flex flex-col">
          <label htmlFor="newLoanGroupName">Loan group name</label>
          <input
            className="text-black rounded-3xl mt-4"
            type="text"
            id="newLoanGroupName"
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5"
          onClick={addLoanGroup}
        >
          Add Loan group
        </button>
      </div>
      <div>
        {loanGroups.length > 0 && (
          <div className="my-5">
            If you want to connect your loan to an group, select an item from
            the list
          </div>
        )}
        {loanGroups.map((loanGroup, index) => (
          <div
            className={cn(
              "cursor-pointer bg-gray-200 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-full mt-5",
              {
                "bg-green-800 text-white":
                  loanGroupSelected?.id === loanGroup.id,
              }
            )}
            key={index}
            onClick={() => setLoanGroupSelected(loanGroup)}
          >{`${loanGroup.name} (${loanGroup.id}) ${
            loanGroupSelected?.id === loanGroup.id ? " - SELECTED" : ""
          }`}</div>
        ))}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5"
          onClick={addLoan}
        >
          Add Loan
        </button>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {loanGroups.map((loanGroup, index) => {
          const loansForGroup = loans.filter(
            (loan) => loan.loanGroupId === loanGroup.id
          );

          return (
            <div
              className="col-span-12 mt-5  border border-white rounded p-2"
              key={index}
            >
              <h2>{loanGroup.name}</h2>
              <div>
                Total payment for this group:{" "}
                {calculateTotalPaymentGroup(loansForGroup)}
              </div>
              <div>
                Total interest for this group:{" "}
                {calculateInterestCostGroup(loansForGroup)}
              </div>
              <div className="grid grid-cols-12 gap-5">
                {loansForGroup.map((loan) => {
                  let tableContent: any[] = [];

                  if (loans.length > 0) {
                    tableContent = generateAmortizationTable(loan, false);
                  }
                  return (
                    <div className="mt-5 col-span-6" key={loan.id}>
                      <div className="flex flex-col">
                        <label htmlFor="interestRate">Interest Rate:</label>
                        <input
                          className="text-black rounded-3xl mt-4"
                          type="number"
                          id="interestRate"
                          value={loan.interestRate}
                          onChange={(event) =>
                            handleInterestRateChange(event, loan.id)
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor={`paymentTime_${loan.id}`}>
                          Payment Time (years):
                        </label>
                        <input
                          className="text-black rounded-3xl mt-4"
                          type="number"
                          id={`paymentTime_${loan.id}`}
                          value={loan.paymentTime / 12}
                          onChange={(event) =>
                            handlePaymentTimeChange(event, loan.id)
                          }
                        />
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor={`loanAmount_${loan.id}`}>
                          Loan Amount:
                        </label>
                        <input
                          className="text-black rounded-3xl mt-4"
                          type="number"
                          id={`loanAmount_${loan.id}`}
                          value={loan.loanAmount.toString()}
                          onChange={(event) =>
                            handleLoanAmountChange(event, loan.id)
                          }
                        />
                        <div className="flex flex-col">
                          <label htmlFor="gracePeriod">
                            Grace Period (months):
                          </label>
                          <input
                            className="text-black rounded-3xl mt-4"
                            type="number"
                            id="gracePeriod"
                            value={loan.gracePeriod}
                            onChange={(event) =>
                              handleLoanGracePeriode(event, loan.id)
                            }
                          />
                        </div>
                      </div>
                      {/* <div>
                        <label htmlFor={`extraPayment_${loan.id}`}>Extra Payment:</label>
                        <input
                        className="text-black"
                        type="number"
                        id={`extraPayment_${loan.id}`}
                        onChange={(event) => handleExtraPaymentChange(event, loan.id)}
                        />
                    </div> */}
                      <div className="flex flex-col">
                        <label htmlFor={`fees_${loan.id}`}>Fees:</label>
                        <input
                          className="text-black rounded-3xl mt-4"
                          type="number"
                          id={`fees_${loan.id}`}
                          value={loan.fees}
                          onChange={(event) => handleFeesChange(event, loan.id)}
                        />
                      </div>
                      {/* <div>
                        <label htmlFor={`insurance_${loan.id}`}>Insurance:</label>
                        <input
                        className="text-black"
                        type="number"
                        id={`insurance_${loan.id}`}
                        value={loan.insurance}
                        onChange={(event) => handleInsuranceChange(event, loan.id)}
                        />
                    </div> */}
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5"
                        onClick={toggleTableVisibility}
                      >
                        {isTableVisible ? "Hide Table" : "Show Table"}
                      </button>
                      <div
                        className={cn(
                          "grid grid-cols-10 gap-5 align-middle items-center mt-12",
                          {
                            [classes["table-container"]]: true,
                            [classes["table-container__visible"]]:
                              isTableVisible,
                          }
                        )}
                      >
                        <div className="col-span-2">Month</div>
                        <div className="col-span-2">Interest Payment</div>
                        <div className="col-span-2">Principal Payment</div>
                        <div className="col-span-2">Total Payment</div>
                        <div className="col-span-2">Remaining Loan Amount</div>
                        {generateAmortizationTable(loan).map((row) => (
                          <>
                            <div className="col-span-2">{row.month}</div>
                            <div className="col-span-2">
                              {formatCurrency(row.interestPayment)}
                            </div>
                            <div className="col-span-2">
                              {formatCurrency(row.principalPayment)}
                            </div>
                            <div className="col-span-2">
                              {formatCurrency(row.totalPayment)}
                            </div>
                            <div className="col-span-2">
                              {formatCurrency(row.remainingLoanAmount)}
                            </div>
                          </>
                        ))}
                      </div>
                      <div>
                        <p>
                          Total Payment: {calculateTotalPayment(loan, true)}
                        </p>
                        <p>Interest Cost: {calculateInterestCost(loan)}</p>
                      </div>
                      {tableContent.length > 0 && (
                        <LoanGraphVisualizer2
                          width={560}
                          height={300}
                          loan={tableContent}
                          interestRate={loan.interestRate}
                        />
                      )}

                      {/* <LoanGraphVisualizer
                            width={800}
                            height={400}
                            loan={loan}
                            interestRate={interestRate}
                        /> */}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoanVisualizer;
