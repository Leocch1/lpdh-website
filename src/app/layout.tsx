import type { Metadata } from 'next';
import './globals.css';
import { ConditionalLayout } from '@/components/conditional-layout';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'Las Pinas Doctors Hospital',
  description: 'Las Piñas Doctors Hospital - Your health, our commitment.',
  icons: '/favicon.ico',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased bg-background text-foreground">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Toaster />
      </body>
    </html>
  );
}