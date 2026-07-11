import './globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ieee-industry-360-webinar.vercel.app'),
  title: "IEEE Industry 360' Webinar Quiz",
  description: "Test your knowledge from the IEEE Industry 360' Webinar interactive quiz",
  openGraph: {
    title: "IEEE Industry 360' Webinar Quiz",
    description: "Test your knowledge from the IEEE Industry 360' Webinar interactive quiz",
    url: 'https://ieee-industry-360-webinar.vercel.app',
    siteName: 'IEEE Industry 360 Quiz',
    images: [
      {
        url: '/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'IEEE Industry 360 Webinar Quiz',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "IEEE Industry 360' Webinar Quiz",
    description: "Test your knowledge from the IEEE Industry 360' Webinar interactive quiz",
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/image1.png',
    shortcut: '/image1.png',
    apple: '/image1.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
