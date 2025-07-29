import { render, screen } from '@testing-library/react';
import { BasicTable } from '@/components/charts/BasicTable/BasicTable';
import { BasicTableData } from '@/components/charts/BasicTable/basicTable.types';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';

const mockTableData: BasicTableData[] = [
  {
    indicatorId: 1,
    indicatorName: ' ',
    period: '2008',
    count: 389,
    value: 278.29134,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    unitLabel: '',
  },
  {
    indicatorId: 2,
    indicatorName: 'no data indicator',
    period: '',
    unitLabel: '',
  },
];

describe('BasicTable', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-12-25T12:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should include a title', () => {
    render(<BasicTable tableData={mockTableData} />);
    const title = screen.getByRole('heading', { level: 4 });
    expect(title).toHaveTextContent('Overview of selected indicators');
  });

  it('should match snapshot', () => {
    render(<BasicTable tableData={mockTableData} />);
    const table = screen.getByRole('table');
    expect(table).toMatchSnapshot();
  });

  it('should render BasicTable component', () => {
    render(<BasicTable tableData={mockTableData} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByTestId('basic-table-component')).toBeInTheDocument();
  });

  it('should always display indicator name when no health data for the indicator is present', () => {
    render(<BasicTable tableData={mockTableData} />);

    expect(screen.getAllByRole('row')[3]).toHaveTextContent(
      'no data indicator'
    );
    expect(screen.getAllByRole('cell')[3]).toHaveTextContent('X');
  });

  it('should display X in the table cell if there is no value', () => {
    render(<BasicTable tableData={mockTableData} />);

    const noValueCells = screen.getAllByText('X');
    expect(noValueCells).toHaveLength(5);
  });

  it('should display the correct aria label when then is no value', () => {
    render(<BasicTable tableData={mockTableData} />);

    const noValueCells = screen.getAllByLabelText('Not compared');
    expect(noValueCells).toHaveLength(5);
  });

  it('should render the correct trend label for the data in the table', () => {
    render(<BasicTable tableData={mockTableData} />);

    const trendTags = screen.getAllByTestId('trend-tag-component');
    expect(trendTags).toHaveLength(2);
    expect(trendTags[0].textContent).toEqual('No recent trend data available');
    expect(trendTags[1].textContent).toEqual('No recent trend data available');
  });
});
