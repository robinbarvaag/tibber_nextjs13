import { resolveHref } from "lib/sanity.links";
import Link from "next/link";
import type { HomePagePayload } from "types";
import { Box } from "#/ui/Box";

export interface HomePageProps {
  data: HomePagePayload | null;
}

export function HomePage({ data }: HomePageProps) {
  // Default to an empty object to allow previews on non-existent documents
  const { overview = [], showcaseProjects = [], title = "" } = data ?? {};

  return (
    <div className="space-y-20">
      {title}
      <Box
        image={"/tibber_logo_blue_w1000.png"}
        altText={"Tibber logo"}
        readMore={"Read more info about usage from Tibber"}
        link={"tibber/2023"}
        color={"hsl(187deg 71% 47%)"}
      />
      <Box
        image={"/garden_logo_w1000.png"}
        altText={"Garden logo"}
        readMore={"Read more about Garden-app"}
        link={"garden"}
        color={"hsl(96.92deg 36.84% 51.57%)"}
      />
    </div>
  );
}
