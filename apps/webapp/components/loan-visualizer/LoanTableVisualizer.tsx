import { useState } from "react";
import classes from "./LoanVisualizer.module.scss";
import cn from "classnames";
import { formatCurrency, generateAmortizationTable } from "./loan-utils";

const LoanTableVisualizer = ({ loan }) => {
  const [displayTable, setDisplayTable] = useState(false);
  const toggleTableVisibility = (id) => {
    setDisplayTable(!displayTable);
  };

  return (
    <>
      <button
        className="bg-theme1-primary hover:bg-theme1-primay100 text-white font-bold py-2 px-4 rounded-full mt-5"
        onClick={() => toggleTableVisibility(loan.id)}
      >
        {displayTable ? "Hide" : "Show"} table
      </button>
      <div
        className={cn("relative overflow-x-auto shadow-md sm:rounded-lg py-6", {
          [classes["table-container"]]: true,
          [classes["table-container__visible"]]: displayTable,
        })}
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
            {(generateAmortizationTable(loan, true, null) as any[]).map(
              (row, index) => (
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
                  <td className="py-4">{formatCurrency(row.totalPayment)}</td>
                  <td className="py-4">
                    {formatCurrency(row.remainingLoanAmount)}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LoanTableVisualizer;
