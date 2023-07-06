import LoanVisualizer from "#/components/loan-visualizer/LoanVisualizer";

export default async function Loan() {
  return (
    <div>
      <LoanVisualizer initialInterestRate={5} />
    </div>
  );
}
