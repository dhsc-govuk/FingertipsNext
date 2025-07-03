import { HighChartsWrapper } from '@/components/molecules/HighChartsWrapper/HighChartsWrapper';

vi.mock('@/components/molecules/HighChartsWrapper/HighChartsWrapper');
export const mockHighChartsWrapper = HighChartsWrapper as unknown as ReturnType<
  typeof vi.fn
>;

export const mockHighChartsWrapperSetup = () => {
  mockHighChartsWrapper.mockImplementation(({ children }) => (
    <div>{children}</div>
  ));
};
