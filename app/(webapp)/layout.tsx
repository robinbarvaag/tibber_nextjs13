import "#/styles/globals.css";
import { AddressBar } from "#/ui/AddressBar";
import { GlobalNav } from "#/ui/GlobalNav";
import { Logo } from "#/ui/Logo";
import { readToken } from "lib/sanity.api";
import { getClient } from "lib/sanity.client";
import { draftMode } from "next/headers";
import { settingsQuery } from "lib/sanity.queries";
import { SettingsPayload } from "types";
import { PreviewBanner } from "components/preview/PreviewBanner";
import PreviewProvider from "components/preview/PreviewProvider";

const fallbackSettings: SettingsPayload = {
  menuItems: [],
  footer: [],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const preview = draftMode().isEnabled ? { token: readToken! } : undefined;
  const client = getClient(preview);
  const settings =
    (await client.fetch<SettingsPayload | null>(settingsQuery)) ??
    fallbackSettings;

  const layout = (
    <html
      lang="en"
      className="[color-scheme:dark]"
      suppressHydrationWarning={true}
    >
      <head />
      <body
        className="overflow-y-scroll bg-gray-1100"
        suppressHydrationWarning={true}
      >
        <GlobalNav />
        {preview && <PreviewBanner />}
        <div className="lg:pl-72">
          <div className="mx-auto max-w-7xl space-y-8 px-2 pt-20 lg:py-8 lg:px-8">
            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black">
                <AddressBar />
              </div>
            </div>

            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
            </div>

            <div className="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
              <div className="rounded-lg bg-black">
                <Byline />
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );

  if (preview) {
    return <PreviewProvider token={preview.token}>{layout}</PreviewProvider>;
  }

  return layout;
}

function Byline() {
  return (
    <div className="flex items-center justify-between gap-x-4 p-3.5 lg:px-5 lg:py-3">
      <div className="flex items-center gap-x-1.5">
        <div className="text-sm text-gray-400">By</div>
        <a href="https://vercel.com" title="Vercel">
          <div className="w-16 text-gray-100 hover:text-gray-50">
            <Logo />
          </div>
        </a>
      </div>

      <div className="text-sm text-gray-400">
        <a
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-4 hover:text-gray-400"
          href="https://github.com/robinbarvaag/tibber_nextjs13"
          target="_blank"
        >
          View code
        </a>
        {" or "}
        <a
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-4 hover:text-gray-400"
          href="https://vercel.com/templates/next.js/app-directory"
          target="_blank"
        >
          create your own from the template i used
        </a>
      </div>
    </div>
  );
}
