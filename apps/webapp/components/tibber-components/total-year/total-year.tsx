import colors from "tailwindcss/colors";
import ProgressBar from "#/components/progressbar/progressbar";
async function getData(year: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/in-return?year=${year}`,
    { cache: "no-store" }
  );

  if (res === undefined) {
    return undefined;
  }

  const responseBody = await res.json();
  //find object that contains total amount for year
  const totalAmount = responseBody.find((item: any) => item.month === "Total");
  return {
    year,
    paidToTibber: totalAmount?.paidToTibber?.toFixed(2),
    powerSupport: totalAmount?.powerSupport?.toFixed(2),
  };
}

async function TotalYear({ year }: { year: number }): Promise<JSX.Element> {
  const item = await getData(year);
  if (item === undefined) return <div>undefined</div>;

  const progress = (item?.powerSupport / item?.paidToTibber) * 100;

  //create an switch case for progress and change color based on progress
  let indicatorColor = "";

  if (progress < 30) indicatorColor = colors.red[600];
  else if (progress > 30 && progress < 50) indicatorColor = colors.orange[600];
  else indicatorColor = colors.green[600];

  const whatWePaid = item?.paidToTibber - item?.powerSupport;

  return (
    <div key={item.year} className="col-span-6 flex flex-row justify-between">
      <div>
        <h2 className="font-medium text-gray-500 ">{item.year}</h2>
        <div className="text-gray-500">
          {/* Only display two numbers */}
          Hva vi betalte til Tibber: {item?.paidToTibber}
        </div>
        <div className="font-semibold text-gray-500">
          Hva vi fikk igjen fra strømstøtten {item?.powerSupport}
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
}
export default TotalYear;
