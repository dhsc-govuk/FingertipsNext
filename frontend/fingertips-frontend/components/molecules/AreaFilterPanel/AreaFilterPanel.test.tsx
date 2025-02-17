import { render, screen, fireEvent } from '@testing-library/react';
import { AreaAutoCompleteFilterPanel } from './index'; // Adjust the import path if necessary

// Sample data for the test based on the provided AreaDocument structure
const sampleAreas = [
  {
    areaCode: 'A82647',
    areaName: 'Cartmel Surgery',
    areaType: 'GPs',
  },
  {
    areaCode: 'A82650',
    areaName: 'Haverthwaite Surgery',
    areaType: 'GPs',
  },
  {
    areaCode: 'A82651',
    areaName: 'Duddon Valley Medical Practice',
    areaType: 'GPs',
  },
  {
    areaCode: 'A82654',
    areaName: 'Warwick Square Group Practice',
    areaType: 'GPs',
  },
  {
    areaCode: 'A83001',
    areaName: "St Andrew's Medical Practice",
    areaType: 'GPs',
  },
  {
    areaCode: 'A83003',
    areaName: 'Willington Medical Group',
    areaType: 'GPs',
  },
  {
    areaCode: 'A83005',
    areaName: 'Whinfield Medical Practice',
    areaType: 'GPs',
  },
  {
    areaCode: 'A83006',
    areaName: 'Orchard Court Surgery',
    areaType: 'GPs',
  },
  {
    areaCode: 'A83007',
    areaName: 'Blackhall and Peterlee Practice',
    areaType: 'GPs',
  },
];

const mockOnOpen = jest.fn();

describe('test AreaFilterPanel', () => {
  test('should render the link with the correct text when areas are not null', () => {
    render(<AreaAutoCompleteFilterPanel areas={sampleAreas} onOpen={mockOnOpen} />);
    const link = screen.getByTestId('search-form-link-filter-area');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Open a filter to add or change areas');
  });

  test('should render the link with default text when areas length is 0', () => {
    render(<AreaAutoCompleteFilterPanel areas={[]} onOpen={mockOnOpen} />);
    const link = screen.getByTestId('search-form-link-filter-area');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Open area filter');
  });

  test('should call onOpen when the link is clicked', () => {
    render(<AreaAutoCompleteFilterPanel areas={sampleAreas} onOpen={mockOnOpen} />);
    const link = screen.getByTestId('search-form-link-filter-area');
    fireEvent.click(link);
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  test('take a snapshot', () => {
    const { asFragment } = render(
      <AreaAutoCompleteFilterPanel areas={sampleAreas} onOpen={mockOnOpen} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
