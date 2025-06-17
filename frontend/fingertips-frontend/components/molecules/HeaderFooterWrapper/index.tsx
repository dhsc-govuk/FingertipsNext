'use client';

import { usePathname } from 'next/navigation';
import { FTHeader } from '@/components/molecules/Header';
import { FTFooter } from '@/components/molecules/Footer';
import '../../../global.css';
import { Session } from 'next-auth';

export function HeaderFooterWrapper({
  children,
  tag,
  hash,
  session,
}: Readonly<{
  children: React.ReactNode;
  tag?: string;
  hash?: string;
  session?: Session;
}>) {
  const pathname = usePathname();
  const isChartPage = pathname.startsWith('/chart');

  return (
    <>
      <FTHeader chartPage={isChartPage} session={session} />
      {children}
      <FTFooter tag={tag} hash={hash} chartPage={isChartPage} />
    </>
  );
}
