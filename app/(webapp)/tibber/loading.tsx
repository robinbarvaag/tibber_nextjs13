import { Suspense } from "react";

export default function Posts() {
  return (
    <section>
      <Suspense fallback={<p>Loading feed...</p>}>
        <span>Loading tibber content</span>
      </Suspense>
    </section>
  );
}
