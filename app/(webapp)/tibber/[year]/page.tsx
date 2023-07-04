// import { RenderingInfo } from "#/ui/RenderingInfo";
import { notFound } from "next/navigation";
import ProgressBar from "#/components/progressbar/progressbar";
import colors from "tailwindcss/colors";
import Link from "next/link";

export const revalidate = 60;

async function getData(year: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/in-return?year=${year}`,
    {
      next: { revalidate: 10 },
    }
  );
  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

// export async function generateStaticParams() {
//   // Generate two pages at build time and the rest (3-100) on-demand
//   return [{ year: "2022" }, { year: "2023" }];
// }

export default async function Page({ params }: { params: { year: string } }) {
  const data = await getData(params.year);

  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <Link
        className="bg-gray-500 text-white font-medium flex p-2 rounded-lg justify-items-center"
        href="/tibber"
      >
        Back
      </Link>
      {data?.map((monthInfo, index) => {
        if (monthInfo === undefined) {
          return null;
        }
        const progress =
          (monthInfo?.powerSupport?.toFixed(2) /
            monthInfo?.paidToTibber?.toFixed(2)) *
          100;

        //create an switch case for progress and change color based on progress
        let indicatorColor = "";

        if (progress < 30) indicatorColor = colors.red[600];
        else if (progress > 30 && progress < 50)
          indicatorColor = colors.orange[600];
        else indicatorColor = colors.green[600];

        const whatWePaid =
          monthInfo?.paidToTibber.toFixed(2) -
          monthInfo?.powerSupport.toFixed(2);

        return (
          <div key={index} className="col-span-6 flex flex-row justify-between">
            <div>
              <h2 className="font-medium text-gray-500 ">{monthInfo.month}</h2>
              <div className="text-gray-500">
                {/* Only display two numbers */}
                Hva vi betalte til Tibber: {monthInfo?.paidToTibber.toFixed(2)}
              </div>
              <div className="font-semibold text-gray-500">
                Hva vi fikk igjen fra strømstøtten{" "}
                {monthInfo?.powerSupport.toFixed(2)}
              </div>
              <div className="text-gray-500">
                Hva vi faktisk betalte i strøm: {whatWePaid.toFixed(2)}
              </div>
            </div>
            <div>
              <ProgressBar
                size={120}
                progress={progress}
                indicatorWidth={10}
                trackWidth={10}
                trackColor={"#0a0a0b"}
                indicatorColor={indicatorColor}
                indicatorCap={"butt"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
