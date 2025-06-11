import { ReactNode } from 'react';
import {
  SidebarDiv,
  SidebarTop,
} from '@/components/shallow/components/Sidebar/Sidebar.styles';

interface SidebarProps {
  title?: string;
  children?: ReactNode;
}

export function Sidebar({ title, children }: Readonly<SidebarProps>) {
  return <SidebarDiv>{children}</SidebarDiv>;
}
