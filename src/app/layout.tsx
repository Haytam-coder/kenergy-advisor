import type { Metadata } from 'next';
import { Inter, Syne, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import ToastProvider from './components/ToastProvider';
import ChatPanel from './components/ChatPanel';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-inter-var',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-syne-var',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant-var',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kenergy Advisor – KI-Energieberatung',
  description: 'Dein persönlicher KI-Energieberater für deutsche Haushalte.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${syne.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
        <ChatPanel />
      </body>
    </html>
  );
}
