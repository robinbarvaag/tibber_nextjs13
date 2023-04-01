import type { NextApiRequest, NextApiResponse } from "next";
import { TibberData } from "../tibber/tibber-prices";

var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
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

export type PricePerYear = {
  month: string;
  monthNumber: string;
  prices: number;
};

export default async function index(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const tibber_cost_response: Response = await fetch(
    `https://tibber-nextjs13.vercel.app/api/tibber/tibber-prices`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const tibberData: TibberData = await tibber_cost_response.json();
  const priceForYear: PricePerYear[] = [];

  if (req.query.year === "2022") {
    for (const month of ["11"]) {
      const prices = await fetchForMonth(month, req.query.year as string);
      priceForYear.push({
        month: monthNames[parseInt(month) - 1],
        prices: prices.coveredPriceInclTax,
        monthNumber: month,
      });
    }

    const typedReturn = priceForYear.map((x) => {
      var consumptionForMonth =
        tibberData.data.viewer.homes[0].consumption?.nodes.filter(
          (node) => node.from.substring(5, 7) === x.monthNumber
        ) ?? [];
      return {
        month: x.month,
        whatwepay: consumptionForMonth[0]?.cost ?? 0,
        whattheypay:
          ((consumptionForMonth[0]?.consumption ?? 0) * x.prices) / 100,
      };
    });

    return res.status(200).json(typedReturn);
  }

  try {
    return res.status(200).json([
      {
        month: "January",
        whatwepay: 0,
        whattheypay: 0,
      },
    ]);

    // const tibberData: TibberData = await tibber_cost_response.json();
    // const priceForYear: PricePerYear[] = [];

    // if (req.query.year === "2022") {
    //   for (const month of ["09", "10", "11", "12"]) {
    //     const prices = await fetchForMonth(month, req.query.year as string);
    //     priceForYear.push({
    //       month: monthNames[parseInt(month) - 1],
    //       prices: prices.coveredPriceInclTax,
    //       monthNumber: month,
    //     });
    //   }
    // }

    // if (req.query.year === "2023") {
    //   for (const month of monthNumber) {
    //     const prices = await fetchForMonth(month, req.query.year as string);
    //     priceForYear.push({
    //       month: monthNames[parseInt(month) - 1],
    //       prices: prices.coveredPriceInclTax,
    //       monthNumber: month,
    //     });
    //   }
    // }

    // const typedReturn = priceForYear.map((x) => {
    //   var consumptionForMonth =
    //     tibberData.data.viewer.homes[0].consumption?.nodes.filter(
    //       (node) => node.from.substring(5, 7) === x.monthNumber
    //     ) ?? [];
    //   return {
    //     month: x.month,
    //     whatwepay: consumptionForMonth[0]?.cost ?? 0,
    //     whattheypay:
    //       ((consumptionForMonth[0]?.consumption ?? 0) * x.prices) / 100,
    //   };
    // });

    // return res.status(200).json(typedReturn);
  } catch (error) {
    console.log(error);
  }
}

async function fetchForMonth(month: string, year: string) {
  try {
    const cost_price_response = await fetch(
      `https://tibber-nextjs13.vercel.app/api/hvakosterstrom/fetch-prices-for-month?month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return await cost_price_response.json();
  } catch (e) {
    console.log(e);
  }
}
