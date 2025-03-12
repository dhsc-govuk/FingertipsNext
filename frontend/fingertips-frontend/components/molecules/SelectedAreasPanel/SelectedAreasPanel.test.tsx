import { mockAreaDataForNHSRegion } from '@/mock/data/areaData';
import { render, screen, within } from '@testing-library/react';
import { SelectedAreasPanel } from '.';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';

const mockSelectedAreasData = [
  mockAreaDataForNHSRegion['E40000007'],
  mockAreaDataForNHSRegion['E40000012'],
];

const mockPath = 'some-mock-path';
const mockReplace = jest.fn();

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: jest.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

describe('SelectedAreasPanel', () => {
  it('snapshot test', () => {
    const container = render(
      <SelectedAreasPanel selectedAreasData={mockSelectedAreasData} />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should not render the selected areas pill when there are no areas selected', () => {
    render(<SelectedAreasPanel />);

    expect(screen.getByText(/Selected areas \(0\)/i)).toBeInTheDocument();
    expect(screen.queryByTestId('pill-container')).not.toBeInTheDocument();
  });

  it('should render the selected areas when there are areas selected', () => {
    render(<SelectedAreasPanel selectedAreasData={mockSelectedAreasData} />);

    expect(screen.getByText(/Selected areas \(2\)/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('pill-container')).toHaveLength(2);
  });

  it('should remove the area selected from the url when the remove icon is clicked for the area selected', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=E40000012`,
      `&${SearchParams.AreaTypeSelected}=NHS+Regions`,
    ].join('');

    const user = userEvent.setup();
    render(
      <SelectedAreasPanel
        selectedAreasData={mockSelectedAreasData}
        searchState={{
          [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
          [SearchParams.AreaTypeSelected]: 'NHS Regions',
        }}
      />
    );

    const firstSelectedAreaPill = screen.getAllByTestId('pill-container')[0];
    await user.click(
      within(firstSelectedAreaPill).getByTestId('remove-icon-div')
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
      scroll: false,
    });
  });

  it('should remove the indicators selected from the state/url when the remove icon is clicked for the area selected', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=E40000012`,
      `&${SearchParams.AreaTypeSelected}=NHS+Regions`,
    ].join('');

    const user = userEvent.setup();
    render(
      <SelectedAreasPanel
        selectedAreasData={mockSelectedAreasData}
        searchState={{
          [SearchParams.AreasSelected]: ['E40000012', 'E40000007'],
          [SearchParams.AreaTypeSelected]: 'NHS Regions',
          [SearchParams.IndicatorsSelected]: ['1', '2'],
        }}
      />
    );

    const firstSelectedAreaPill = screen.getAllByTestId('pill-container')[0];
    await user.click(
      within(firstSelectedAreaPill).getByTestId('remove-icon-div')
    );

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, {
      scroll: false,
    });
  });
});
