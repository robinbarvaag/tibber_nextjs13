import React, { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { GradientTealBlue } from "@visx/gradient";
import letterFrequency, {
  LetterFrequency,
} from "@visx/mock-data/lib/mocks/letterFrequency";
import { scaleBand, scaleLinear } from "@visx/scale";

const data = letterFrequency.slice(5);
const verticalMargin = 120;

// accessors
const getLetter = (d: LetterFrequency) => d.letter;
const getLetterFrequency = (d: LetterFrequency) => Number(d.frequency) * 100;

const getMonthNumber = (d: any) => d.month;
const getRemainingLoanAmount = (d: any) => d.principalPayment;
const getinterestPayment = (d: any) => d.interestPayment;

export type BarsProps = {
  width: number;
  height: number;
  events?: boolean;
  loan: any;
  interestRate: number;
};

interface Loan {
  id: number;
  paymentTime: number;
  loanAmount: number;
  extraPayments: number[];
  fees: number;
  insurance: number;
}

export default function LoanGraphVisualizer({
  width,
  height,
  events = false,
  loan,
  interestRate,
}: BarsProps) {
  // bounds
  const xMax = width;
  const yMax = height - verticalMargin;

  const calculateMonthlyPayment = (loan: Loan, month: number) => {
    const monthlyInterestRate = interestRate / 12 / 100;
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

  const generateAmortizationTable = (loan: Loan) => {
    const amortizationTable: any[] = [];
    let remainingLoanAmount = loan.loanAmount;
    let month = 1;

    while (remainingLoanAmount > 0 && month <= loan.paymentTime) {
      const interestPayment = remainingLoanAmount * (interestRate / 12 / 100);
      const principalPayment =
        parseFloat(calculateMonthlyPayment(loan, month)) - interestPayment;
      const totalPayment = parseFloat(calculateMonthlyPayment(loan, month));
      remainingLoanAmount -= principalPayment;

      const row = {
        month,
        interestPayment: interestPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        totalPayment: totalPayment.toFixed(2),
        remainingLoanAmount: Math.max(remainingLoanAmount, 0).toFixed(2),
      };

      amortizationTable.push(row);
      month++;
    }

    return amortizationTable;
  };

  const loanData = generateAmortizationTable(loan);

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: loanData.map(getMonthNumber),
        padding: 0.4,
      }),
    [xMax, loanData]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...loanData.map(getRemainingLoanAmount))],
      }),
    [yMax, loanData]
  );

  const yScale2 = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...loanData.map(getinterestPayment))],
      }),
    [yMax, loanData]
  );

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <GradientTealBlue id="teal" />
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {loanData.map((d) => {
          const letter = getMonthNumber(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(getRemainingLoanAmount(d)) ?? 0);
          const barHeight2 = yMax - (yScale2(getinterestPayment(d)) ?? 0);
          const barX = xScale(letter);
          const barY = yMax - barHeight;
          const barY2 = yMax - barHeight2;
          return (
            <>
              <Bar
                key={`bar-${letter}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
                onClick={() => {
                  alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                  if (events)
                    alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                }}
              />
              {/* <Bar
                key={`bar-${letter}-2`}
                x={barX}
                y={barY2}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
                onClick={() => {
                  alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                  if (events)
                    alert(`clicked: ${JSON.stringify(Object.values(d))}`);
                }}
              /> */}
            </>
          );
        })}
      </Group>
    </svg>
  );
}
