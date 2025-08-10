import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "./core/ui/elements/Toaster";
import TansTackProvider from "./core/ui/components/TanStackProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Socially",
  description: "Social Media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TansTackProvider>
    <html lang="en">

      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

         <Toaster />
         {/* <Analytics /> */}
        {children}

        <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','G-17F2SJDKR2');
              `,
            }}
          />

        <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=G-17F2SJDKR2"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-17F2SJDKR2"
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-17F2SJDKR2', {
                  page_path: window.location.pathname,
                  send_page_view: false
                });
              `,
            }}
          />
      </body>
    </html>
    </TansTackProvider>
  );
}
