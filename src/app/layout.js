import Providers from "@/store/Providers";
import "./globals.css";
import { Inter } from "next/font/google";
import Outlet from "@/middleware/Outlet";
import NextThemeProvider from "./NextThemeProvider";
import NavBar from "@/components/nav";
import AuthProvider from "./AuthProvider";
import MainFooter from "@/components/footer";
import Head from "next/head";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Home - PhotoSTAD",
	description:  'PhotoSTAD is one of the final project that was build by a group of ISTAD student. PhotoSTAD is a cutting-edge print shop that offers a state-of-the-art watermark maker,enabling photographers to protect their valuable images from unauthorized use.Additionally PhotoSTAD provides a powerful certificate generator,allowing professionals to create authentic certificates for their artwork and  establish credibility in the industry',
	images: "https://photostad.istad.co/_next/image?url=%2Fassets%2Fimage%2Fmainlogo-blackv2.png&w=256&q=75",
	openGraph: {
	  title: 'PhotoSTAD',
    description:  'PhotoSTAD is one of the final project that was build by a group of ISTAD student. PhotoSTAD is a cutting-edge print shop that offers a state-of-the-art watermark maker,enabling photographers to protect their valuable images from unauthorized use.Additionally PhotoSTAD provides a powerful certificate generator,allowing professionals to create authentic certificates for their artwork and  establish credibility in the industry',
	  url: 'https://photostad.istad.co/',
	  images: "https://photostad.istad.co/_next/image?url=%2Fassets%2Fimage%2Fmainlogo-blackv2.png&w=256&q=75",
	},
}	;
  
<Head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@200&display=swap"
    rel="stylesheet"
  />
  {/* <title>{metadata.title}</title>
  <meta name="description" content={metadata.description} /> */}
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel='icon' href='/favicon.ico' sizes="64*32"/>
</Head>;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>

 
            <AuthProvider>
              <NextThemeProvider>
                <NavBar />
                <Suspense fallback={<Loading />}>
                {children}
                </Suspense>
                <MainFooter />
              </NextThemeProvider>
            </AuthProvider>

        </Providers>
      </body>
    </html>
  );
}
