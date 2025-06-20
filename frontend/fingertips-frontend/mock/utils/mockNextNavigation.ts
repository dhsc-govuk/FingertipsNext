export const mockReplace = jest.fn();
export const mockUsePathname = jest.fn();
export const mockUseSearchParams = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: mockUsePathname,
    useSearchParams: mockUseSearchParams,
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});
