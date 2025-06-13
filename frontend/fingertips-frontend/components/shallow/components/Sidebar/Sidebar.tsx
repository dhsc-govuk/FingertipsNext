import { ReactNode } from 'react';
import { SidebarDiv } from '@/components/shallow/components/Sidebar/Sidebar.styles';

interface SidebarProps {
  children?: ReactNode;
}

export function Sidebar({ children }: Readonly<SidebarProps>) {
  return <SidebarDiv>{children}</SidebarDiv>;
}
