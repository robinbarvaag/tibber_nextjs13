export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // className={`${mono.variable} ${sans.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
