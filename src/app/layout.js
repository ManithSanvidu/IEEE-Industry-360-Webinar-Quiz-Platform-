import './globals.css';

export const metadata = {
  title: "IEEE Industry 360' Webinar Quiz",
  description: "Test your knowledge from the IEEE Industry 360' Webinar interactive quiz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
