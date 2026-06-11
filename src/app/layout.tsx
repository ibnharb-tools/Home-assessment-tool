import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display, Jost } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

/* Headings/titles: Playfair Display (bold). Body/paragraphs: Jost (a free,
   Futura-like geometric sans — Futura itself is licensed). Data: JetBrains Mono. */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Everstead: AI-Powered Energy Intelligence",
    template: "%s · Everstead",
  },
  description:
    "Discover your property's clean energy potential in minutes. No utility bill needed. AI-designed path to energy independence.",
  applicationName: "Everstead",
  keywords: [
    "renewable energy",
    "solar",
    "wind",
    "geothermal",
    "energy assessment",
    "clean energy",
  ],
  openGraph: {
    title: "Everstead: AI-Powered Energy Intelligence",
    description:
      "Discover your property's clean energy potential in minutes. No utility bill needed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${jost.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
