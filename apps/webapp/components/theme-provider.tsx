"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

function ThemeProvider({ children, ...other }: any) {
  return <NextThemesProvider {...other}>{children}</NextThemesProvider>;
}

export { ThemeProvider };
