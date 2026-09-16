import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel Admin — CV Sumber Wangi Madiun Group',
  description: 'Panel pengelolaan produk resmi CV Sumber Wangi Madiun Group.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#0a0a0a]">{children}</div>;
}
