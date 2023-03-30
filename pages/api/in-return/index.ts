import type { NextApiRequest, NextApiResponse } from "next";
import { Pokedex } from "../tibber/tibber-prices";

export default async function CurrentElectricalPrice(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.query.year === "2022") {
      const tibber_cost_response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/tibber/tibber-prices`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 600 },
        }
      );

      const data: Pokedex = await tibber_cost_response.json();

      const septemberPrices = await fetchForMonth(
        "09",
        req.query.year as string
      );
      const oktoberPrices = await fetchForMonth("10", req.query.year as string);
      const novemberPrices = await fetchForMonth(
        "11",
        req.query.year as string
      );
      const desemberPrices = await fetchForMonth(
        "12",
        req.query.year as string
      );

      var consumptionForSep =
        data.data.viewer.homes[0].consumption?.nodes.filter(
          (node) => node.from.substring(5, 7) === "09"
        ) ?? [];

      var consumptionForOkt =
        data.data.viewer.homes[0].consumption?.nodes.filter(
          (node) => node.from.substring(5, 7) === "10"
        ) ?? [];

      var consumptionForNob =
        data.data.viewer.homes[0].consumption?.nodes.filter(
          (node) => node.from.substring(5, 7) === "11"
        ) ?? [];

      var consumptionForDes =
        data.data.viewer.homes[0].consumption?.nodes.filter(
          (node) => node.from.substring(5, 7) === "12"
        ) ?? [];

      return res.status(200).json([
        {
          month: "September",
          whatwepay: consumptionForSep[0].cost,
          whattheypay:
            (consumptionForSep[0].consumption *
              septemberPrices.coveredPriceInclTax) /
            100,
        },
        {
          month: "Oktober",
          whatwepay: consumptionForOkt[0].cost,
          whattheypay:
            (consumptionForOkt[0].consumption *
              oktoberPrices.coveredPriceInclTax) /
            100,
        },
        {
          month: "November",
          whatwepay: consumptionForNob[0].cost,
          whattheypay:
            (consumptionForNob[0].consumption *
              novemberPrices.coveredPriceInclTax) /
            100,
        },
        {
          month: "Desember",
          whatwepay: consumptionForDes[0].cost,
          whattheypay:
            (consumptionForDes[0].consumption *
              desemberPrices.coveredPriceInclTax) /
            100,
        },
      ]);
    }

    if (req.query.year === "2023") {
      const tibber_cost_response: Response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tibber/tibber-prices`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          next: { revalidate: 600 },
        }
      );

      const data: Pokedex = await tibber_cost_response.json();

      const januarPrices = await fetchForMonth("01", req.query.year as string);
      const februaryPrices = await fetchForMonth(
        "02",
        req.query.year as string
      );

      var consumptionForJanuary =
        data.data.viewer.homes[0].consumption?.nodes.filter(
          (node) => node.from.substring(5, 7) === "01"
        ) ?? [];

      var consumptionForFebruary =
        data.data.viewer.homes[0].consumption?.nodes.filter(
          (node) => node.from.substring(5, 7) === "02"
        ) ?? [];

      var consumptionForMarch =
        data.data.viewer.homes[0].consumption?.nodes.filter(
          (node) => node.from.substring(5, 7) === "03"
        ) ?? [];

      return res.status(200).json([
        {
          month: "Januar",
          whatwepay: consumptionForJanuary[0].cost,
          whattheypay:
            (consumptionForJanuary[0].consumption *
              januarPrices.coveredPriceInclTax) /
            100,
        },
        {
          month: "Februar",
          whatwepay: consumptionForFebruary[0].cost,
          whattheypay:
            (consumptionForFebruary[0].consumption *
              februaryPrices.coveredPriceInclTax) /
            100,
        },
        {
          month: "March",
          whatwepay: consumptionForMarch[0].cost,
          whattheypay:
            (consumptionForMarch[0].consumption *
              februaryPrices.coveredPriceInclTax) /
            100,
        },
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchForMonth(month: string, year: string) {
  try {
    const cost_price_response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/hvakosterstrom/fetch-prices-for-month?month=${month}&year=${year}`,
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
