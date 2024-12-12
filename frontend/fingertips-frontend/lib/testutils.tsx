import StyledComponentsRegistry from '@/lib/registry';

export const registryWrapper = (
  component: React.ReactNode
): React.ReactNode => {
  return <StyledComponentsRegistry>{component}</StyledComponentsRegistry>;
};
