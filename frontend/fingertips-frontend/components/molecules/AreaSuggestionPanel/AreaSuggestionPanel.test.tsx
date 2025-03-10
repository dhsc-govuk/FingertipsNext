import { render, screen } from '@testing-library/react';
import { AreaAutoCompleteSuggestionPanel } from './index';
import { AreaDocument } from '@/lib/search/searchTypes';
import { SearchParams } from '@/lib/searchStateManager';
import userEvent from '@testing-library/user-event';
import {
  englandAreaType,
  nhsRegionsAreaType,
} from '@/lib/areaFilterHelpers/areaType';
import { englandArea } from '@/mock/data/areas/englandAreas';

const mockAreas: AreaDocument[] = [
  { areaCode: 'GP01', areaName: 'Greenwich', areaType: 'GPs' },
  { areaCode: 'GP02', areaName: 'Cambridge', areaType: 'GPs' },
  { areaCode: 'CT01', areaName: 'Central London', areaType: 'CT' },
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

describe('AreaSuggestionPanel', () => {
  it('should render correctly and match snapshot', () => {
    const { asFragment } = render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchHint=""
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should not render the area suggestion panel when the searchState contains areasSelected', () => {
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={[]}
        searchHint=""
        searchState={{
          [SearchParams.AreasSelected]: ['A001'],
        }}
      />
    );

    expect(
      screen.queryByTestId('area-suggestion-panel')
    ).not.toBeInTheDocument();
  });

  it('should render the suggestedAreas provided', () => {
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchHint=""
      />
    );

    expect(screen.getByText('GP01 - Greenwich')).toBeInTheDocument();
    expect(screen.getByText('GP02 - Cambridge')).toBeInTheDocument();
    expect(screen.getByText('Central London')).toBeInTheDocument();
  });

  it('should render nothing if suggestedAreas are empty', () => {
    const { container } = render(
      <AreaAutoCompleteSuggestionPanel suggestedAreas={[]} searchHint="Lo" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should update the url with the areaCode when an suggested area is clicked', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=GP01`,
    ].join('');

    const user = userEvent.setup();
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchHint=""
      />
    );

    await user.click(screen.getByText('GP01 - Greenwich'));

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });

  it('should remove any previous area filter selection from the state', async () => {
    const expectedPath = [
      `${mockPath}`,
      `?${SearchParams.AreasSelected}=GP01`,
    ].join('');

    const user = userEvent.setup();
    render(
      <AreaAutoCompleteSuggestionPanel
        suggestedAreas={mockAreas}
        searchState={{
          [SearchParams.AreaTypeSelected]: nhsRegionsAreaType.key,
          [SearchParams.GroupTypeSelected]: englandAreaType.key,
          [SearchParams.GroupSelected]: englandArea.code,
        }}
        searchHint=""
      />
    );

    await user.click(screen.getByText('GP01 - Greenwich'));

    expect(mockReplace).toHaveBeenCalledWith(expectedPath, { scroll: false });
  });
});
