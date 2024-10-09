import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Rep Tracker | AI-Powered Workout Assistant",
  description:
    "Track your workout reps in real-time with our AI-powered webcam assistant. Improve your form and stay motivated with instant feedback.",
  keywords: [
    "workout tracker",
    "rep counter",
    "AI fitness",
    "exercise assistant",
    "webcam workout",
  ],
  authors: [{ name: "Your Name or Company Name" }],
  openGraph: {
    title: "Rep Tracker | AI-Powered Workout Assistant",
    description:
      "Track your workout reps in real-time with our AI-powered webcam assistant.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rep Tracker Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rep Tracker | AI-Powered Workout Assistant",
    description:
      "Track your workout reps in real-time with our AI-powered webcam assistant.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
