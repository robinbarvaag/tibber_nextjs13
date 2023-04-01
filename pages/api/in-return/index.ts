import type { NextApiRequest, NextApiResponse } from "next";
import { TibberData } from "../tibber/tibber-prices";
import monthData from "./../../../data/prices.json";

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

  try {
    const tibberData: TibberData = await tibber_cost_response.json();
    const priceForYear: PricePerYear[] = [];

    if (req.query.year === "2022") {
      for (const month of ["09", "10", "11", "12"]) {
        const prices = monthData.filter(
          (x) => x.month === month && x.year === req.query.year
        )[0];
        priceForYear.push({
          month: monthNames[parseInt(month) - 1],
          prices: prices?.coveredPriceInclTax ?? 0,
          monthNumber: month,
        });
      }
    }

    if (req.query.year === "2023") {
      for (const month of monthNumber) {
        if (
          req.query.year === "2023" &&
          parseInt(month) > new Date().getMonth() + 1
        ) {
          continue;
        }
        const prices = monthData.filter(
          (x) => x.month === month && x.year === req.query.year
        )[0];
        priceForYear.push({
          month: monthNames[parseInt(month) - 1],
          prices: prices?.coveredPriceInclTax ?? 0,
          monthNumber: month,
        });
      }
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
  } catch (error) {
    console.log(error);
  }
}

async function fetchForMonth(month: string, year: string) {
  try {
    return monthData.filter((x) => x.month === month && x.year === year)[0];
  } catch (e) {
    console.log(e);
  }
}
