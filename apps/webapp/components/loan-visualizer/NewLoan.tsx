import { useState } from "react";
import cn from "classnames";
import { toast } from "./../../hooks/use-toast";
const NewLoan = ({ loans, loanGroups, setLoans, setLoanGroups }) => {
  const [loanGroupSelected, setLoanGroupSelected] = useState<LoanGroup | null>(
    null
  );

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

  async function onSubmit() {
    const user = {
      id: "clk7dr72c00006fedlzu5slau",
    };
    const response = await fetch(`/api/user/${user.id}/loan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentTimeYears: 30,
        paymentTimeMonths: 0,
        loanAmount: 10122025,
        extraPaymentEachMonth: 0,
        extraPayments: [],
        fees: 70,
        insurance: 0,
        interestRate: 5.08,
        loanGroupId: 1,
        gracePeriod: 79,
        userId: user.id,
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

  return (
    <>
      <div>
        <div className="flex flex-col">
          <label htmlFor="newLoanGroupName">Loan group name</label>
          <input
            className="text-black rounded-3xl mt-4"
            type="text"
            id="newLoanGroupName"
          />
        </div>
        <div className="flex flex-row gap-5">
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
          Add new loan
        </button>
      </div>
    </>
  );
};

export default NewLoan;
