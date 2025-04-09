import { render, screen } from '@testing-library/react';
import { ThematicMapCredits } from '.';
import { mapMetaDataEncoder } from '@/components/organisms/ThematicMap/thematicMapHelpers';

const mockDataSource = 'Mock Data Provider';
const mockAreaType = 'regions';

describe('ThematicMapCredits', () => {
  it('should display the map source, copyright and data source', async () => {
    render(
      <ThematicMapCredits areaType={mockAreaType} dataSource={mockDataSource} />
    );
    const copyrightLines =
      mapMetaDataEncoder[mockAreaType].mapCopyright.split(/\n/);

    expect(
      screen.getByText(`Map source:`, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockDataSource, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(copyrightLines[0], { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(copyrightLines[1].trim(), { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      mapMetaDataEncoder[mockAreaType].mapSourceURL
    );
  });

  it('should not display data source when metadata does not exist', async () => {
    render(<ThematicMapCredits areaType={mockAreaType} />);
    expect(screen.queryByText('Data source: ')).not.toBeInTheDocument();
  });
});
