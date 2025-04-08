import { render, screen } from '@testing-library/react';
import { ThematicMapCredits } from '.';

const mockDataSource = 'BJSS Leeds';
const mockAreaType = 'regions';

describe('ThematicMapCredits', () => {
  it('should display the map source and data source', async () => {
    render(
      <ThematicMapCredits areaType={mockAreaType} dataSource={mockDataSource} />
    );

    expect(
      screen.getByText(`Map source: `, { exact: false })
    ).toBeInTheDocument();
    expect(screen.queryByText(RegExp(mockDataSource))).toBeInTheDocument();
    expect(
      screen.getByText(`Data source: ${mockDataSource}`)
    ).toBeInTheDocument();
  });

  it('should not display data source when metadata does not exist', async () => {
    render(<ThematicMapCredits areaType={mockAreaType} />);
    screen.debug();

    expect(screen.queryByText(/Data source: /)).not.toBeInTheDocument();
  });
});
