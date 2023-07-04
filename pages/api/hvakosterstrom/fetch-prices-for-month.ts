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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
        }).then((res) => {
          if (res.status !== 200) {
            return [];
          }
          const json = res.json();
          return json;
        });

        responseArray.push(...response);
      }

      //averge price this month
      let averageSumThisMonth = 0;
      responseArray.forEach((element) => {
        averageSumThisMonth += element.NOK_per_kWh;
      });

      averageSumThisMonth = averageSumThisMonth / responseArray.length;

      let sumBeeingCovered = 0;
      responseArray.forEach((element) => {
        //cover is only 90% for everything above 70 øre
        const beingCovered = (element.NOK_per_kWh - 0.7) * 0.9;
        sumBeeingCovered += beingCovered;
      });
      const totalSumBeeingCovered = sumBeeingCovered;
      sumBeeingCovered = sumBeeingCovered / responseArray.length;

      pricesEachYear.push({
        year: year,
        month: month,
        coveredPriceInclTax: sumBeeingCovered < 0 ? 0 : sumBeeingCovered * 1.25,
        totalConveredInclTax:
          totalSumBeeingCovered < 0 ? 0 : totalSumBeeingCovered,
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
