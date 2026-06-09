import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

/* Display + body load from Fontshare (Clash Display + General Sans) via a
   stylesheet link in <head> below — distinctive, warm, premium; not the
   generic geometric sans look. Data/numbers stay on JetBrains Mono. */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Everstead — AI-Powered Energy Intelligence",
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
    title: "Everstead — AI-Powered Energy Intelligence",
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
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Fontshare: Clash Display (display) + General Sans (body/UI) */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
