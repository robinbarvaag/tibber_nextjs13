import TotalYear from "#/components/tibber-components/total-year/total-year";
import TotalYearSkeleton from "#/components/tibber-components/total-year/total-year-skeleton";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  const currentYear: number = new Date().getFullYear();
  const years: number[] = Array.from(
    { length: currentYear - 2022 + 1 },
    (_, index) => currentYear - index
  );

  return (
    <div className="grid grid-cols-1 gap-8">
      {years.map((year) => {
        return (
          <Suspense key={year} fallback={<TotalYearSkeleton />}>
            <Link href={`tibber/${year}`}>
              <TotalYear year={year} />
            </Link>
          </Suspense>
        );
      })}
    </div>
  );
}
