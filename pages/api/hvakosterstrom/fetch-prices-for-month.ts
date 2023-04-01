import type { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");
const path = require("path");

var monthNumber = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

var years = ["2022", "2023"];

export default async function index(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "s-maxage=86400");
  const pricesEachYear: any[] = [];
  for (const year of years) {
    for (const month of monthNumber) {
      //if current month is bigger then month and year is 2023 continue
      if (year === "2023" && parseInt(month) > new Date().getMonth() + 1) {
        continue;
      }
      let responseArray: any[] = [];
      for (let i = 1; i <= 31; i++) {
        let day: string = i + "";
        if (i < 10) {
          day = "0" + i;
        }
        let urlToFetch = `https://www.hvakosterstrommen.no/api/v1/prices/${year}/${month}-${day}_NO5.json`;
        const response = await fetch(urlToFetch, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 600 },
        }).then((res) => {
          if (res.status !== 200) {
            return [];
          }
          const json = res.json();
          return json;
        });

        responseArray.push(...response);
      }

      //get the sum of all prices
      let sum = 0;
      responseArray.forEach((element) => {
        sum += element.NOK_per_kWh * 100;
      });

      let sumBeingCovered = 0;
      responseArray.forEach((element) => {
        const inOrer = element.NOK_per_kWh * 100;
        const beingCovered = inOrer - 70;
        sumBeingCovered += beingCovered;
      });

      const coveredPriceExclTax =
        (sumBeingCovered / responseArray.length) * 0.9;
      const coveredPriceInclTax = coveredPriceExclTax * 1.25;

      // console.log("covered excl mva", coveredPriceExclTax);
      // console.log("covered incl mva", coveredPriceInclTax);

      const averageExclTax = sum / responseArray.length;
      const avargePriceInclTax = averageExclTax * 1.25;

      const afterCoveredPrice = avargePriceInclTax - coveredPriceInclTax;

      // console.log("To-pay per kwh incl tax", afterCoveredPrice);
      // const whatWeShouldPay = (afterCoveredPrice * 2789) / 100;
      // const whatWeArePaying = 10836;
      // console.log("What we should pay in desember", whatWeShouldPay);
      // console.log("Total we are getting back", whatWeArePaying - whatWeShouldPay);

      // res.status(200).json({ coveredPriceInclTax: coveredPriceInclTax } as any);
      pricesEachYear.push({
        year: year,
        month: month,
        coveredPriceInclTax: afterCoveredPrice,
      });
    }
  }

  const filePath = path.join(process.cwd(), "data", "prices.json");
  fs.writeFile(filePath, JSON.stringify(pricesEachYear), (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });

  res.status(200).json({ message: "true" });
}
