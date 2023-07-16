/* eslint-disable @next/next/no-html-link-for-pages */

export function PreviewBanner() {
  return (
    <div className="bg-red-800 p-3 text-center text-white absolute bottom-5 left-1/2">
      {"Previewing draft content. "}
      <a
        className="underline transition hover:opacity-50"
        href="/api/exit-preview"
      >
        Exit preview mode
      </a>
    </div>
  );
}
