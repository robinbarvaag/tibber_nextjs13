"use client";
import React, { useState, useEffect } from "react";
import GraphWrapper from "./LoanGraphVisualizer";
import NewLoan from "./NewLoan";
import LoanGroupSummary from "./LoanGroupSummary";

import SliderWrapper from "./slider-wrapper";
import LoanTableVisualizer from "./LoanTableVisualizer";

import {
  calculateTotalPayment,
  formatCurrency,
  calculateTotalPaymentWithExtra,
  calculateInterestCost,
  calculateInterestCostWithExtra,
} from "./loan-utils";

const LoanVisualizer: React.FC<LoanVisualizerProps> = (loanGroups) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanGroupss, setLoanGroups] = useState<LoanGroup[]>([]);

  const setLoandsHandler = (loans: Loan[]) => {
    setLoans(loans);
  };

  const setLoanGroupsHandler = (loanGroups: LoanGroup[]) => {
    setLoanGroups(loanGroups);
  };

  useEffect(() => {
    setLoanGroups(loanGroups.loanGroups?.loanGroups ?? []);
  }, [loanGroups]);

  const updateObject = <T extends string | number>(
    event: T,
    loanId: number,
    attribute: string
  ) => {
    let newValue: T;

    if (typeof event === "number") {
      newValue = event;
    } else if (typeof event === "string") {
      const parsedValue = parseFloat(event);
      newValue = isNaN(parsedValue) ? (0 as T) : (parsedValue as T);
    } else {
      // Handle the case when event is neither a number nor a string
      // You can throw an error, log a warning, or perform any other desired action.
      return;
    }

    //find loan on loangroup
    const updatedLoans = loanGroupss.map((loanGroup) => {
      const updatedLoans = loanGroup.loans.map((loan) =>
        loan.id === loanId ? { ...loan, [attribute]: newValue } : loan
      );

      return { ...loanGroup, loans: updatedLoans };
    });

    // const updatedLoans = loans.map((loan) =>
    //   loan.id === loanId ? { ...loan, [attribute]: newValue } : loan
    // );
    setLoanGroups(updatedLoans);
  };

  function calculateFutureValue(
    months: number,
    expectedReturn: number,
    monthlySavings: number,
    inflation: number
  ): number {
    let totalAmount = 0;
    const years = months / 12;

    for (let i = 0; i < years; i++) {
      totalAmount += monthlySavings * 12;
      //subtract inflation
      totalAmount += totalAmount * (expectedReturn / 100);
      totalAmount -= totalAmount * (inflation / 100);
    }

    return totalAmount;
  }

  const differencer = (loan) => {
    const differenceInterest =
      calculateInterestCost(loan) - calculateInterestCostWithExtra(loan);

    const funds = calculateFutureValue(
      loan.paymentTime,
      10,
      loan.extraPaymentEachMonth,
      2
    ) as number;

    return funds - differenceInterest;
  };

  return (
    <div>
      <NewLoan
        loans={loans}
        loanGroups={loanGroupss}
        setLoans={setLoandsHandler}
        setLoanGroups={setLoanGroupsHandler}
      />
      <div className="grid grid-cols-12 gap-6">
        {loanGroupss.map((loanGroup, index) => {
          return (
            <div
              className="col-span-12 mt-5  border border-white rounded p-2"
              key={index}
            >
              <LoanGroupSummary loans={loanGroup.loans} name={loanGroup.name} />
              <div className="grid grid-cols-12 gap-5">
                {loanGroup.loans.map((loan) => {
                  return (
                    <div
                      className="mt-5 col-span-12 lg:col-span-6"
                      key={loan.id}
                    >
                      <button>Delete</button>
                      <SliderWrapper
                        value={loan.interestRate}
                        attribute="interestRate"
                        type="number"
                        loanId={loan.id}
                        changeHandler={updateObject}
                        step={0.05}
                        max={30}
                        label="Interest rate"
                        prefix="%"
                      />
                      <SliderWrapper
                        value={loan.paymentTimeYears}
                        attribute="paymentTimeYears"
                        loanId={loan.id}
                        changeHandler={updateObject}
                        step={1}
                        max={30}
                        label="Payment Time"
                        prefix="years"
                      />
                      <SliderWrapper
                        value={loan.paymentTimeMonths}
                        attribute="paymentTimeMonths"
                        loanId={loan.id}
                        changeHandler={updateObject}
                        step={1}
                        max={12}
                        label="Payment Time (months)"
                        prefix="months"
                      />
                      <SliderWrapper
                        value={loan.loanAmount}
                        attribute="loanAmount"
                        formatCurrency={formatCurrency}
                        loanId={loan.id}
                        changeHandler={updateObject}
                        step={25000}
                        max={15000000}
                        label="Loan Amount"
                      />
                      <SliderWrapper
                        value={loan.fees}
                        attribute="fees"
                        formatCurrency={formatCurrency}
                        loanId={loan.id}
                        changeHandler={updateObject}
                        step={10}
                        max={200}
                        label="Fees"
                      />
                      <SliderWrapper
                        value={loan.extraPaymentEachMonth}
                        attribute="extraPaymentEachMonth"
                        formatCurrency={formatCurrency}
                        loanId={loan.id}
                        changeHandler={updateObject}
                        step={100}
                        max={20000}
                        label="Extra payment each month"
                      />
                      <SliderWrapper
                        value={loan.gracePeriod}
                        attribute="gracePeriod"
                        loanId={loan.id}
                        changeHandler={updateObject}
                        step={1}
                        max={200}
                        label="Grace periode"
                        prefix="months"
                      />

                      <LoanTableVisualizer loan={loan} />

                      <div>
                        <p>
                          Total payment:{" "}
                          {formatCurrency(calculateTotalPayment(loan))}
                        </p>
                        <p>
                          Total payment with extra:{" "}
                          {formatCurrency(calculateTotalPaymentWithExtra(loan))}
                        </p>

                        <p>
                          Total interest:{" "}
                          {formatCurrency(calculateInterestCost(loan))}
                        </p>

                        <p>
                          Total interest with extra{" "}
                          {formatCurrency(calculateInterestCostWithExtra(loan))}
                        </p>
                      </div>

                      <div>
                        <p>
                          Difference in interest with extrapayment:{" "}
                          {formatCurrency(
                            calculateInterestCost(loan) -
                              calculateInterestCostWithExtra(loan)
                          )}
                        </p>
                      </div>

                      <div className="my-4">
                        <p>
                          {`Expected value if you invested ${formatCurrency(
                            loan.extraPaymentEachMonth
                          )} each
                          month, for a total of ${
                            loan.paymentTimeYears
                          } months`}
                        </p>

                        {formatCurrency(
                          calculateFutureValue(
                            loan.paymentTimeYears,
                            10,
                            loan.extraPaymentEachMonth,
                            2
                          )
                        )}
                      </div>

                      <div className="my-4">
                        Difference between investing and paying off loan:{" "}
                        {formatCurrency(differencer(loan))}
                      </div>

                      <div style={{ height: "500px" }}>
                        <GraphWrapper loan={loan} />
                      </div>
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
