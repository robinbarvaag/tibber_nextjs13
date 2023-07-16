"use client";
import React, { useState, useEffect } from "react";
import cn from "classnames";
import classes from "./LoanVisualizer.module.scss";
import LoanGraphVisualizer from "./LoanGraphVisualizer";
import { Slider } from "#/components/slider/slider";
import { toast } from "./../../hooks/use-toast";

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

const LoanVisualizer: React.FC<LoanVisualizerProps> = ({ data }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loanGroups, setLoanGroups] = useState<LoanGroup[]>([]);
  const [loanGroupSelected, setLoanGroupSelected] = useState<LoanGroup | null>(
    null
  );

  async function onSubmit() {
    const user = {
      id: 1,
    };
    const response = await fetch(`/api/user/${user.id}/loan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loanDetails: loans,
      }),
    });

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your salary details was not updated. Please try again.",
        variant: "destructive",
      });
    }

    toast({
      description: "Your loan has been updated.",
      duration: 5000,
      variant: "success",
    });

    // start transition
    // startTransition(() => {
    //   onFormSubmitSuccess?.();
    //   // Refresh the current route and fetch new data from the server without
    //   // losing client-side browser or React state.
    //   router.refresh();
    // });
  }

  useEffect(() => {
    const savedLoans = data.flatMap((user: any) => {
      const savedLoans = JSON.parse(user.savedLoanJson);

      return savedLoans.loanDetails.map((loan: any) => {
        return {
          id: loan.id,
          paymentTimeYears: loan.paymentTimeYears,
          paymentTimeMonths: loan.paymentTimeMonths,
          loanAmount: loan.loanAmount,
          extraPayments: loan.extraPayments,
          extraPaymentEachMonth: loan.extraPaymentEachMonth,
          fees: loan.fees,
          insurance: loan.insurance,
          interestRate: loan.interestRate,
          gracePeriod: loan.gracePeriod,
          loanGroupId: 1,
        };
      });
    });

    setLoans(savedLoans);

    const loanGroups: LoanGroup[] = data.map((user: any) => {
      return {
        id: 1,
        name: user.name,
      };
    });
    setLoanGroups(loanGroups ?? []);
  }, [data]);

  const handleInterestRateChange = (
    event: React.ChangeEvent<HTMLInputElement> | number,
    loanId: number
  ) => {
    let newInterestRate;

    if (typeof event === "number") {
      newInterestRate = event;
    } else if (event.target instanceof HTMLInputElement) {
      newInterestRate = parseFloat(event.target.value);
    } else {
      // Handle the case when event is neither a number nor an HTMLInputElement
      // You can throw an error, log a warning, or perform any other desired action.
      return;
    }

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
      paymentTimeYears: 30,
      paymentTimeMonths: 0,
      loanAmount: 10122025,
      extraPaymentEachMonth: 0,
      extraPayments: [],
      fees: 70,
      insurance: 0,
      interestRate: 5.08,
      loanGroupId: loanGroupSelected.id,
      gracePeriod: 79,
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
    event: React.ChangeEvent<HTMLInputElement> | number,
    loanId: number
  ) => {
    let newPaymentTimeInYears;
    if (typeof event === "number") {
      newPaymentTimeInYears = event;
    } else if (event.target instanceof HTMLInputElement) {
      newPaymentTimeInYears = parseFloat(event.target.value);
    } else {
      // Handle the case when event is neither a number nor an HTMLInputElement
      // You can throw an error, log a warning, or perform any other desired action.
      return;
    }
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId
        ? { ...loan, paymentTimeYears: newPaymentTimeInYears }
        : loan
    );
    setLoans(updatedLoans);
  };

  const handlePaymentTimeMonthChange = (
    event: React.ChangeEvent<HTMLInputElement> | number,
    loanId: number
  ) => {
    let newPaymentTimeInMonths;
    if (typeof event === "number") {
      newPaymentTimeInMonths = event;
    } else if (event.target instanceof HTMLInputElement) {
      newPaymentTimeInMonths = parseFloat(event.target.value);
    } else {
      // Handle the case when event is neither a number nor an HTMLInputElement
      // You can throw an error, log a warning, or perform any other desired action.
      return;
    }
    const updatedLoans = loans.map((loan) =>
      loan.id === loanId
        ? { ...loan, paymentTimeMonths: newPaymentTimeInMonths }
        : loan
    );
    setLoans(updatedLoans);
  };

  const handleLoanAmountChange = (
    event: React.ChangeEvent<HTMLInputElement> | number,
    loanId: number
  ) => {
    let newLoanAmount;

    if (typeof event === "number") {
      newLoanAmount = event;
    } else if (event.target instanceof HTMLInputElement) {
      newLoanAmount = parseFloat(event.target.value);
    } else {
      // Handle the case when event is neither a number nor an HTMLInputElement
      // You can throw an error, log a warning, or perform any other desired action.
      return;
    }

    const updatedLoans = loans.map((loan) =>
      loan.id === loanId ? { ...loan, loanAmount: newLoanAmount } : loan
    );
    setLoans(updatedLoans);
  };

  const handleLoanGracePeriode = (
    event: React.ChangeEvent<HTMLInputElement> | number,
    loanId: number
  ) => {
    let newGracePeriode;

    if (typeof event === "number") {
      newGracePeriode = event;
    } else if (event.target instanceof HTMLInputElement) {
      newGracePeriode = parseFloat(event.target.value);
    } else {
      // Handle the case when event is neither a number nor an HTMLInputElement
      // You can throw an error, log a warning, or perform any other desired action.
      return;
    }

    const updatedLoans = loans.map((loan) =>
      loan.id === loanId ? { ...loan, gracePeriod: newGracePeriode } : loan
    );
    setLoans(updatedLoans);
  };

  const handleExtraPaymentEachMonth = (
    event: React.ChangeEvent<HTMLInputElement> | number,
    loanId: number
  ) => {
    let newExtraPaymentEachMont;

    if (typeof event === "number") {
      newExtraPaymentEachMont = event;
    } else if (event.target instanceof HTMLInputElement) {
      newExtraPaymentEachMont = parseFloat(event.target.value);
    } else {
      // Handle the case when event is neither a number nor an HTMLInputElement
      // You can throw an error, log a warning, or perform any other desired action.
      return;
    }

    const updatedLoans = loans.map((loan) =>
      loan.id === loanId
        ? {
            ...loan,
            extraPaymentEachMonth: Number.isNaN(newExtraPaymentEachMont)
              ? 0
              : newExtraPaymentEachMont,
          }
        : loan
    );
    setLoans(updatedLoans);
  };

  const handleFeesChange = (
    event: React.ChangeEvent<HTMLInputElement> | number,
    loanId: number
  ) => {
    let newFees;

    if (typeof event === "number") {
      newFees = event;
    } else if (event.target instanceof HTMLInputElement) {
      newFees = parseFloat(event.target.value);
    } else {
      // Handle the case when event is neither a number nor an HTMLInputElement
      // You can throw an error, log a warning, or perform any other desired action.
      return;
    }

    const updatedLoans = loans.map((loan) =>
      loan.id === loanId
        ? { ...loan, fees: Number.isNaN(newFees) ? 0 : newFees }
        : loan
    );
    setLoans(updatedLoans);
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

  const calculateMonthlyPayment = (loan: Loan) => {
    const monthlyInterestRate = loan.interestRate / 12 / 100;
    const numPayments = loan.paymentTimeYears * 12 + loan.paymentTimeMonths;
    const loanAmountWithFees = loan.loanAmount;
    const monthlyPayment =
      (loanAmountWithFees * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numPayments));
    const totalMonthlyPayment = monthlyPayment;
    return totalMonthlyPayment + loan.insurance + loan.fees;
  };

  const calculateTotalPaymentGroup = (loans: Loan[]) => {
    const totalPayment = loans.reduce(
      (total, loan) => total + calculateTotalPayment(loan),
      0
    );
    return totalPayment;
  };

  const calculateTotalPaymentGroupWithExtra = (loans: Loan[]) => {
    const totalPayment = loans.reduce(
      (total, loan) => total + calculateTotalPaymentWithExtra(loan),
      0
    );
    return totalPayment;
  };

  const calculateInterestCostGroup = (loans: Loan[]) => {
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

  const calculateInterestCostGroupWithExtra = (loans: Loan[]) => {
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

  const calculateNextPaymentGroup = (loans: Loan[]) => {
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

  const calculateTotalPayment = (loan: Loan) => {
    const monthlyPayment = calculateMonthlyPayment(loan);
    const numPayments = loan.paymentTimeYears * 12 + loan.paymentTimeMonths;
    return monthlyPayment * numPayments;
  };

  const calculateTotalPaymentWithExtra = (loan: Loan) => {
    const monthlyPayment = calculateMonthlyPaymentWithoutExtra(loan);
    const numPayments = loan.paymentTimeYears * 12 + loan.paymentTimeMonths;
    return monthlyPayment * numPayments;
  };

  const calculateInterestCost = (loan: Loan) => {
    const totalPayment = calculateTotalPayment(loan);
    const loanAmountWithFees = loan.loanAmount + loan.fees;
    return totalPayment - loanAmountWithFees;
  };

  const calculateInterestCostWithExtra = (loan: Loan) => {
    const totalPayment = calculateTotalPaymentWithExtra(loan);
    const loanAmountWithFees = loan.loanAmount + loan.fees;
    return totalPayment - loanAmountWithFees;
  };

  const generateAmortizationTable = (
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

  const toggleTableVisibility = (id) => {
    const updatedTableVisibility = loans.map((loan) =>
      loan.id === id ? { ...loan, showTable: !loan.showTable } : loan
    );
    setLoans(updatedTableVisibility);
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
          className="bg-theme1-primary hover:bg-theme1-primay100 text-white font-bold py-2 px-4 rounded-full mt-5"
          onClick={addLoanGroup}
        >
          Add Loan group
        </button>
        <button
          className="bg-theme1-primary hover:bg-theme1-primay100 text-white font-bold py-2 px-4 rounded-full mt-5"
          onClick={onSubmit}
        >
          Lagre / oppdatere info
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
            key={index}
            className={cn(
              "cursor-pointer bg-gray-200 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-full mt-5",
              {
                "bg-green-800 text-white":
                  loanGroupSelected?.id === loanGroup.id,
              }
            )}
            onClick={() => setLoanGroupSelected(loanGroup)}
          >{`${loanGroup.name} (${loanGroup.id}) ${
            loanGroupSelected?.id === loanGroup.id ? " - SELECTED" : ""
          }`}</div>
        ))}
        <button
          className="bg-theme1-primary hover:bg-theme1-primay100 text-white font-bold py-2 px-4 rounded-full mt-5"
          onClick={addLoan}
        >
          Add Loan
        </button>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {loanGroups.map((loanGroup, index) => {
          const loansForGroup = loans?.filter(
            (loan) => loan.loanGroupId === loanGroup.id
          );

          return (
            <div
              className="col-span-12 mt-5  border border-white rounded p-2"
              key={index}
            >
              <h2>{loanGroup.name}</h2>
              <div className="grid grid-cols-12">
                <div className="col-span-6">
                  Total payment for this group:{" "}
                  {formatCurrency(calculateTotalPaymentGroup(loansForGroup))}
                  <div>
                    Total interest for this group:{" "}
                    {formatCurrency(calculateInterestCostGroup(loansForGroup))}
                  </div>
                </div>
                <div className="col-span-6">
                  <div>
                    Total payment for this group with extra payment:{" "}
                    {formatCurrency(
                      calculateTotalPaymentGroupWithExtra(loansForGroup)
                    )}
                  </div>

                  <div>
                    Total interest for this group with extra payment:{" "}
                    {formatCurrency(
                      calculateInterestCostGroupWithExtra(loansForGroup)
                    )}
                  </div>
                </div>

                <div className="col-start-5 col-span-6 my-5">
                  Difference in interest with extrapayment:{" "}
                  {formatCurrency(
                    calculateInterestCostGroup(loansForGroup) -
                      calculateInterestCostGroupWithExtra(loansForGroup)
                  )}
                </div>
              </div>

              <div className="bg-green-800 text-center p-3 mt-3 rounded-xl">
                What should we pay next month?{" "}
                {formatCurrency(calculateNextPaymentGroup(loansForGroup))}
              </div>

              <div className="grid grid-cols-12 gap-5">
                {loansForGroup.map((loan) => {
                  let tableContent: any[] = [];

                  if (loans.length > 0) {
                    tableContent = generateAmortizationTable(
                      loan,
                      false,
                      null
                    ) as any[];
                  }

                  return (
                    <div className="mt-5 col-span-6" key={loan.id}>
                      <div className="flex flex-col gap-3 border-theme1-primay100 border p-3 m-2 rounded-md">
                        <label className="block" htmlFor="interestRate">
                          Interest Rate:
                        </label>
                        <div className="flex flex-row items-center flex-1 gap-3">
                          <Slider
                            value={[loan.interestRate]}
                            max={30}
                            step={0.05}
                            onValueChange={(event) =>
                              handleInterestRateChange(event[0], loan.id)
                            }
                            prevButtonHandler={() =>
                              handleInterestRateChange(
                                parseFloat(
                                  (loan.interestRate - 0.05).toFixed(2)
                                ),
                                loan.id
                              )
                            }
                            nextButtonHandler={() =>
                              handleInterestRateChange(
                                parseFloat(
                                  (loan.interestRate + 0.05).toFixed(2)
                                ),
                                loan.id
                              )
                            }
                          />

                          <input
                            className="text-black rounded-3xl fit-content w-20"
                            type="text"
                            id="interestRate"
                            value={loan.interestRate}
                            onChange={(event) =>
                              handleInterestRateChange(event, loan.id)
                            }
                            max={30}
                          />
                          <span className="text-3xl font-bold">%</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 border-theme1-primay100 border p-3 m-2 rounded-md">
                        <label
                          className="block"
                          htmlFor={`paymentTimeYears_${loan.id}`}
                        >
                          Payment Time:
                        </label>
                        <div className="flex flex-row items-center flex-1 gap-3">
                          <Slider
                            value={[loan.paymentTimeYears]}
                            max={30}
                            step={1}
                            onValueChange={(event) =>
                              handlePaymentTimeChange(event[0], loan.id)
                            }
                            prevButtonHandler={() =>
                              handlePaymentTimeChange(
                                loan.paymentTimeYears - 1,
                                loan.id
                              )
                            }
                            nextButtonHandler={() =>
                              handlePaymentTimeChange(
                                loan.paymentTimeYears + 1,
                                loan.id
                              )
                            }
                          />

                          <input
                            className="text-black rounded-3xl fit-content w-20"
                            type="text"
                            id={`paymentTimeYears_${loan.id}`}
                            value={loan.paymentTimeYears}
                            onChange={(event) =>
                              handlePaymentTimeChange(event, loan.id)
                            }
                            max={30}
                          />
                          <span className="text-3xl font-bold">år</span>
                        </div>

                        <label
                          className="block"
                          htmlFor={`paymentTimeMonths_${loan.id}`}
                        >
                          Payment Time (months):
                        </label>
                        <div className="flex flex-row items-center flex-1 gap-3">
                          <Slider
                            value={[loan.paymentTimeMonths]}
                            max={12}
                            step={1}
                            onValueChange={(event) =>
                              handlePaymentTimeMonthChange(event[0], loan.id)
                            }
                            prevButtonHandler={() =>
                              handlePaymentTimeMonthChange(
                                loan.paymentTimeMonths - 1,
                                loan.id
                              )
                            }
                            nextButtonHandler={() =>
                              handlePaymentTimeMonthChange(
                                loan.paymentTimeMonths + 1,
                                loan.id
                              )
                            }
                          />

                          <input
                            className="text-black rounded-3xl fit-content w-20"
                            type="text"
                            id={`paymentTimeMonths_${loan.id}`}
                            value={loan.paymentTimeMonths}
                            onChange={(event) =>
                              handlePaymentTimeMonthChange(event, loan.id)
                            }
                            max={12}
                          />
                          <span className="text-3xl font-bold">months</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 border-theme1-primay100 border p-3 m-2 rounded-md">
                        <label
                          className="block"
                          htmlFor={`loanAmount_${loan.id}`}
                        >
                          Loan Amount:
                        </label>
                        <div className="flex flex-row items-center flex-1 gap-3">
                          <Slider
                            value={[loan.loanAmount]}
                            max={15000000}
                            step={25000}
                            onValueChange={(event) =>
                              handleLoanAmountChange(event[0], loan.id)
                            }
                            prevButtonHandler={() =>
                              handleLoanAmountChange(
                                loan.loanAmount - 25000,
                                loan.id
                              )
                            }
                            nextButtonHandler={() =>
                              handleLoanAmountChange(
                                loan.loanAmount + 25000,
                                loan.id
                              )
                            }
                          />

                          <input
                            className="text-black rounded-3xl fit-content w-80"
                            type="text"
                            id={`paymentTime_${loan.id}`}
                            value={formatCurrency(loan.loanAmount)}
                            onChange={(event) =>
                              handleLoanAmountChange(event, loan.id)
                            }
                            max={30}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 border-theme1-primay100 border p-3 m-2 rounded-md">
                        <label className="block" htmlFor={`fees_${loan.id}`}>
                          Fees:
                        </label>
                        <div className="flex flex-row items-center flex-1 gap-3">
                          <Slider
                            value={[loan.fees]}
                            max={200}
                            step={10}
                            onValueChange={(event) =>
                              handleFeesChange(event[0], loan.id)
                            }
                            prevButtonHandler={() =>
                              handleFeesChange(loan.fees - 10, loan.id)
                            }
                            nextButtonHandler={() =>
                              handleFeesChange(loan.fees + 20, loan.id)
                            }
                          />

                          <input
                            className="text-black rounded-3xl fit-content w-24"
                            type="text"
                            id={`fees_${loan.id}`}
                            value={formatCurrency(loan.fees)}
                            onChange={(event) =>
                              handleFeesChange(event, loan.id)
                            }
                            max={30}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 border-theme1-primay100 border p-3 m-2 rounded-md">
                        <label
                          className="block"
                          htmlFor={`extrapayment_${loan.id}`}
                        >
                          Extra payment each month:
                        </label>
                        <div className="flex flex-row items-center flex-1 gap-3">
                          <Slider
                            value={[loan.extraPaymentEachMonth]}
                            max={20000}
                            step={500}
                            onValueChange={(event) =>
                              handleExtraPaymentEachMonth(event[0], loan.id)
                            }
                            prevButtonHandler={() =>
                              handleExtraPaymentEachMonth(
                                loan.extraPaymentEachMonth - 500,
                                loan.id
                              )
                            }
                            nextButtonHandler={() =>
                              handleExtraPaymentEachMonth(
                                loan.extraPaymentEachMonth + 500,
                                loan.id
                              )
                            }
                          />

                          <input
                            className="text-black rounded-3xl fit-content w-32"
                            type="text"
                            id={`extrapayment_${loan.id}`}
                            value={formatCurrency(loan.extraPaymentEachMonth)}
                            onChange={(event) =>
                              handleExtraPaymentEachMonth(event, loan.id)
                            }
                            max={20000}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 border-theme1-primay100 border p-3 m-2 rounded-md">
                        <label
                          className="block"
                          htmlFor={`graceperiode_${loan.id}`}
                        >
                          Grace periode:
                        </label>
                        <div className="flex flex-row items-center flex-1 gap-3">
                          <Slider
                            value={[loan.gracePeriod]}
                            max={200}
                            step={1}
                            onValueChange={(event) =>
                              handleLoanGracePeriode(event[0], loan.id)
                            }
                            prevButtonHandler={() =>
                              handleLoanGracePeriode(
                                loan.gracePeriod - 1,
                                loan.id
                              )
                            }
                            nextButtonHandler={() =>
                              handleLoanGracePeriode(
                                loan.gracePeriod + 1,
                                loan.id
                              )
                            }
                          />

                          <input
                            className="text-black rounded-3xl fit-content w-20"
                            type="text"
                            id={`graceperiode_${loan.id}`}
                            value={loan.gracePeriod}
                            onChange={(event) =>
                              handleLoanGracePeriode(event, loan.id)
                            }
                            max={200}
                          />
                          <span className="text-3xl font-bold">months</span>
                        </div>
                      </div>
                      <button
                        className="bg-theme1-primary hover:bg-theme1-primay100 text-white font-bold py-2 px-4 rounded-full mt-5"
                        onClick={() => toggleTableVisibility(loan.id)}
                      >
                        {loan.showTable ? "Hide" : "Show"} table
                      </button>

                      <div
                        className={cn(
                          "relative overflow-x-auto shadow-md sm:rounded-lg py-6",
                          {
                            [classes["table-container"]]: true,
                            [classes["table-container__visible"]]:
                              loan.showTable,
                          }
                        )}
                      >
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-white uppercase bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th scope="col" className="px-6 py-3">
                                Month
                              </th>
                              <th scope="col" className="px-2 py-3">
                                Interest Payment
                              </th>
                              <th scope="col" className="px-2 py-3">
                                Principal Payment
                              </th>
                              <th scope="col" className="px-2 py-3">
                                Total Payment
                              </th>
                              <th scope="col" className="px-2 py-3">
                                Remaining Loan Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(
                              generateAmortizationTable(
                                loan,
                                true,
                                null
                              ) as any[]
                            ).map((row, index) => (
                              <tr
                                key={index}
                                className={`text-white border-b bg-gray-${
                                  index % 2 === 0 ? "900" : "700"
                                } dark:border-gray-700`}
                              >
                                <th
                                  scope="row"
                                  className="px-6 py-4 font-medium whitespace-nowrap text-white"
                                >
                                  {row.month}
                                </th>
                                <td className="py-4">
                                  {formatCurrency(row.interestPayment)}
                                </td>
                                <td className="py-4">
                                  {formatCurrency(row.principalPayment)}
                                </td>
                                <td className="py-4">
                                  {formatCurrency(row.totalPayment)}
                                </td>
                                <td className="py-4">
                                  {formatCurrency(row.remainingLoanAmount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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

                      {tableContent.length > 0 && (
                        <LoanGraphVisualizer
                          width={560}
                          height={300}
                          loan={tableContent}
                          interestRate={loan.interestRate}
                        />
                      )}
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
