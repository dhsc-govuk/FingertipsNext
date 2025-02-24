import { render, screen } from '@testing-library/react';
import { AreaAutoCompleteFilterPanel } from './index';

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

describe('AreaFilterPanel', () => {
  test('should render the link with the correct text when areas are not null', () => {
    render(<AreaAutoCompleteFilterPanel areas={sampleAreas} />);
    const link = screen.getByTestId('search-form-link-filter-area');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Open a filter to add or change areas');
  });

  test('should render the link with default text when areas length is 0', () => {
    render(<AreaAutoCompleteFilterPanel areas={[]} />);
    const link = screen.getByTestId('search-form-link-filter-area');
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent('Open area filter');
  });

  test('take a snapshot', () => {
    const { asFragment } = render(
      <AreaAutoCompleteFilterPanel areas={sampleAreas} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
