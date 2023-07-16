import { useMemo, useState, useEffect } from "react";
import classes from "./LoanVisualizer.module.scss";
import {
  formatCurrency,
  calculateTotalPaymentGroup,
  calculateInterestCostGroup,
  calculateTotalPaymentGroupWithExtra,
  calculateInterestCostGroupWithExtra,
  calculateNextPaymentGroup,
  generateAmortizationTable,
} from "./loan-utils";

const LoanGroupSummary = ({ name, loans }) => {
  //find loan with the highest loan amount
  const lastMonthForEachLoan = useMemo(() => {
    return loans.map((loan) => {
      const amortizationTable = generateAmortizationTable(
        loan,
        false,
        null
      ) as any;
      return amortizationTable[amortizationTable.length - 1];
    });
  }, [loans]);

  //check which loan has the highest year and month
  let highestYear = 0;
  let highestMonth = 0;
  let highestObject: any = null;

  for (const obj of lastMonthForEachLoan) {
    const dateString = obj.month;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (year > highestYear || (year === highestYear && month > highestMonth)) {
      highestYear = year;
      highestMonth = month;
      highestObject = obj;
    }
  }

  // State to control the display of the commented-out code
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);

    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [highestObject]);

  return (
    <>
      <h2 className="my-8 font-bold text-4xl text-center">{name}</h2>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-6 bg-gray-900 rounded-lg p-4">
          <h2 className="underline font-bold">Default for this loan group</h2>
          <div className="my-3">
            Total payment:{" "}
            <span className="underline font-bold">
              {formatCurrency(calculateTotalPaymentGroup(loans))}
            </span>
          </div>
          <div className="my-3">
            Total interest:{" "}
            <span className="underline font-bold">
              {formatCurrency(calculateInterestCostGroup(loans))}
            </span>
          </div>
        </div>
        <div className="col-span-6 bg-gray-900 rounded-lg p-4">
          <h2 className="underline font-bold">
            After extra payment for this loan group
          </h2>
          <div className="my-3">
            Total payment:{" "}
            <span className="underline font-bold">
              {formatCurrency(calculateTotalPaymentGroupWithExtra(loans))}
            </span>
          </div>

          <div className="my-3">
            Total interest:{" "}
            <span className="underline font-bold">
              {formatCurrency(calculateInterestCostGroupWithExtra(loans))}
            </span>
          </div>
        </div>

        <div className="col-span-12 text-center my-5">
          Difference in interest after extra payment:{" "}
          {formatCurrency(
            calculateInterestCostGroup(loans) -
              calculateInterestCostGroupWithExtra(loans)
          )}
        </div>
      </div>

      <div className="bg-orange-400 text-black font-bold text-center p-3 mt-3 rounded-xl">
        What should we pay next month?{" "}
        {formatCurrency(calculateNextPaymentGroup(loans))}
      </div>

      <div className="bg-green-800  font-bold text-center p-3 mt-3 rounded-xl">
        <div>DEBT FREE</div>{" "}
        <div>
          {new Date(highestObject?.month ?? "").toLocaleDateString("nb-NO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        {showAnimation && (
          <div className={classes["container"]}>
            <div className={classes["pyro"]}>
              <div className={classes["before"]}></div>
              <div className={classes["after"]}></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoanGroupSummary;
