export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const demos: { name: string; items: Item[] }[] = [
  {
    name: "Playground",
    items: [
      {
        name: "Tibber",
        slug: "tibber",
        description: "Create UI that is shared across routes",
      },
      {
        name: "Garden",
        slug: "garden",
        description: "Organize routes without affecting URL paths",
      },
      {
        name: "Volvo",
        slug: "volvo",
        description:
          "Streaming data fetching from the server with React Suspense",
      },
    ],
  },
];
