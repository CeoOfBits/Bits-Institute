import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'BITS Institute — Bright Information Technology Solutions | Premier Tech & Cyber Academy',
  description:
    'Learn Cisco Networking, Ethical Hacking, AI, and Full-Stack Software Engineering with physical hardware labs, certified mentors, and verifiable credentials.',
  keywords: [
    'BITS Institute',
    'Bright Information Technology Solutions',
    'CCNA Pakistan',
    'Cyber Security Training',
    'Ethical Hacking',
    'Full Stack Web Development',
    'Verifiable Certificate',
  ],
  icons: {
    icon: '/bits-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
