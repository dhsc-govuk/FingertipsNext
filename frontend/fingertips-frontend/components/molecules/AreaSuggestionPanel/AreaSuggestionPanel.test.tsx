import { render, fireEvent } from '@testing-library/react';
import { AreaAutoCompleteSuggestionPanel } from './index';
import { AreaDocument } from '@/lib/search/searchTypes';

// Mock data
const mockAreas: AreaDocument[] = [
  { areaCode: 'GP01', areaName: 'Greenwich', areaType: 'GP' },
  { areaCode: 'GP02', areaName: 'Cambridge', areaType: 'GP' },
  { areaCode: 'CT01', areaName: 'Central London', areaType: 'CT' },
];

describe('test AreaSuggestionPanel', () => {
  it('should render correctly and match snapshot', () => {
    const { asFragment } = render(
      <AreaAutoCompleteSuggestionPanel
        areas={mockAreas}
        onItemSelected={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render correct area name', () => {
    const { getByText } = render(
      <AreaAutoCompleteSuggestionPanel
        areas={mockAreas}
        onItemSelected={jest.fn()}
      />
    );

    expect(getByText('GP01 - Greenwich')).toBeInTheDocument();
    expect(getByText('GP02 - Cambridge')).toBeInTheDocument();
    expect(getByText('Central London')).toBeInTheDocument();
  });

  it('should call onItemSelected when an item is clicked', () => {
    const mockOnItemSelected = jest.fn();
    const { getByText } = render(
      <AreaAutoCompleteSuggestionPanel
        areas={mockAreas}
        onItemSelected={mockOnItemSelected}
      />
    );

    fireEvent.click(getByText('GP01 - Greenwich'));
    expect(mockOnItemSelected).toHaveBeenCalledWith(mockAreas[0]);

    fireEvent.click(getByText('Central London'));
    expect(mockOnItemSelected).toHaveBeenCalledWith(mockAreas[2]);
  });

  it('should render nothing if areas are empty', () => {
    const { container } = render(
      <AreaAutoCompleteSuggestionPanel areas={[]} onItemSelected={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it.each([
    ['GP01', 'GP', 'Greenwich', 'GP01 - Greenwich'],
    ['CT01', 'CT', 'Central London', 'Central London'],
  ])(
    'should format and render area correctly for areaCode = %s and areaType = %s and areaType = %s',
    (areaCode, areaType, areaName, expectedText) => {
      const area = { areaCode, areaName, areaType } as AreaDocument;
      const { getByText } = render(
        <AreaAutoCompleteSuggestionPanel
          areas={[area]}
          onItemSelected={jest.fn()}
        />
      );
      expect(getByText(expectedText)).toBeInTheDocument();
    }
  );
});
