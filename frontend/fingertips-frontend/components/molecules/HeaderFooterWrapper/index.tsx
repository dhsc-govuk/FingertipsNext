'use client';

import { usePathname } from 'next/navigation';
import { FTHeader } from '@/components/molecules/Header';
import { FTFooter } from '@/components/molecules/Footer';
import '../../../global.css';

export function HeaderFooterWrapper({
  children,
  tag,
  hash,
}: Readonly<{
  children: React.ReactNode;
  tag?: string;
  hash?: string;
}>) {
  const pathname = usePathname();
  const isChartPage = pathname.startsWith('/chart');

  return (
    <>
      <FTHeader chartPage={isChartPage} />
      {children}
      <FTFooter tag={tag} hash={hash} chartPage={isChartPage} />
    </>
  );
}
