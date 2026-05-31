import { createClient } from '@/lib/supabase/server'
import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { ToastProvider } from "@/components/shared/Toast";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TokoKita - Belanja Hemat Kualitas Premium",
  description: "Semua produk langsung dari Shopee dengan harga terbaik",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('fb_pixel_id').eq('id', 1).single()
  const rawPixelId = settings?.fb_pixel_id
  const pixelId = rawPixelId && /^\d{10,20}$/.test(rawPixelId) ? rawPixelId : null

  return (
    <html
      lang="id"
      className={`${nunito.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {pixelId && (
          <>
            <Script
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img height="1" width="1" style={{ display: 'none' }} src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
            </noscript>
          </>
        )}
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
