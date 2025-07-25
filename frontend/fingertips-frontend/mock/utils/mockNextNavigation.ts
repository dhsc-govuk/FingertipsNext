export const mockReplace = vi.fn();
export const mockUsePathname = vi.fn();
export const mockUseSearchParams = vi.fn();

vi.mock('next/navigation', async () => {
  const originalModule =
    await vi.importActual<typeof import('next/navigation')>('next/navigation');

  return {
    ...originalModule,
    usePathname: mockUsePathname,
    useSearchParams: mockUseSearchParams,
    useRouter: vi.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});
