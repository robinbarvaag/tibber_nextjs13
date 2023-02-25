import type { NextApiRequest, NextApiResponse } from "next";

export interface Pokedex {
  data: Data;
}

export interface Data {
  viewer: Viewer;
}

export interface Viewer {
  homes: Home[];
}

export interface Home {
  primaryHeatingSource: string;
  consumption: Consumption | null;
}

export interface Consumption {
  nodes: Node[];
}

export interface Node {
  from: string;
  to: string;
  cost: number;
  unitPrice: number;
  unitPriceVAT: number;
  consumption: number;
  consumptionUnit: string;
}

const currentEnergyPriceQuery = {
  query: `
    {
        viewer {
            homes 
            {
                primaryHeatingSource,
                consumption(resolution: MONTHLY, first: 100) 
                {
                    nodes {
                        from
                        to
                        cost
                        unitPrice
                        unitPriceVAT
                        consumption
                        consumptionUnit
                    }
                }
            }
        }
    }
    `,
  variables: null,
  operationName: null,
};

export const getCurrentEnergyPrice = async (): Promise<any> => {
  const url: string = process.env.TIBBER_API_BASE_URL as string;

  const res: Response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TIBBER_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(currentEnergyPriceQuery),
  });

  const data: Pokedex = await res.json();

  return data;
};

export default async function CurrentElectricalPrice(
  req: NextApiRequest,
  res: NextApiResponse<Pokedex>
) {
  const homeData = await getCurrentEnergyPrice();

  res.status(200).json(homeData);
}
