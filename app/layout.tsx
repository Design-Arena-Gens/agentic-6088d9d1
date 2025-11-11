import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMM Agent',
  description: 'Social media marketing agent that plans campaigns and posts',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <div className="mx-auto container px-4 container-narrow py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
