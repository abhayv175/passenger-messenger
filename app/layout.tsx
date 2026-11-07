import type { Metadata } from 'next';
import ToasterContext from './context/ToasterContext';
import AuthContext from './context/AuthContext';
import ActiveStatus from './components/ActiveStatus';
import './globals.css';

export const metadata: Metadata = {
  title: 'Passenger Messenger | Fluid Real-Time Messaging',
  description: 'Next-generation real-time messenger built with Next.js, Prisma, NextAuth, and Pusher.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
