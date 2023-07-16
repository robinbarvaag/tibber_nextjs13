import { Toaster } from "#/components/loan-visualizer/toaster";
import { ThemeProvider } from "#/components/theme-provider";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // className={`${mono.variable} ${sans.variable} ${serif.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
