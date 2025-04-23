import { render } from '@testing-library/react';
import { DataSource } from './DataSource';

describe('data source', () => {
  it('should display nothing if no data source provided', () => {
    const screen = render(<DataSource dataSource={undefined} />);

    expect(screen.queryByTestId('data-source')).not.toBeInTheDocument();
  });

  it('should render the data source if provided', () => {
    const dataSource = 'Black Mesa Research Facility';
    const screen = render(<DataSource dataSource={dataSource} />);

    expect(screen.getByTestId('data-source')).toBeInTheDocument();
    expect(screen.getByText(`Data source: ${dataSource}`)).toBeInTheDocument();
  });
});
