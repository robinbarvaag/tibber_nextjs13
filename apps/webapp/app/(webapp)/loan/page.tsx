import LoanVisualizer from "#/components/loan-visualizer/LoanVisualizer";
import LoanVisualizer2 from "#/components/loan-visualizer/LoanVisualizer2";
import prisma from "./../../../lib/prisma";

async function getData(year: string) {
  const feed = await prisma.loans.findMany();
  return feed;
}

export default async function Loan() {
  const data = await getData("2022");
  return (
    <div>
      <LoanVisualizer data={data} />
    </div>
  );
}
