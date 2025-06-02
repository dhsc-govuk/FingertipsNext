import { ExportOnly } from '@/components/molecules/Export/exportHelpers';
import { FC, ReactNode } from 'react';

interface ExportOnlyWrapperProps {
  children: ReactNode;
}

export const ExportOnlyWrapper: FC<ExportOnlyWrapperProps> = ({ children }) => {
  return (
    <div className={ExportOnly} style={{ display: 'none' }}>
      {children}
    </div>
  );
};
