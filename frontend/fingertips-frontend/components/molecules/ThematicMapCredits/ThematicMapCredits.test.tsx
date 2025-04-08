import { render, screen } from '@testing-library/react';
import { ThematicMapCredits } from '.';
import { mapMetaDataEncoder } from '@/components/organisms/ThematicMap/thematicMapHelpers';

const mockDataSource = 'BJSS Leeds';
const mockAreaType = 'regions';

describe('ThematicMapCredits', () => {
  it('should display the map source, copyright and data source', async () => {
    render(
      <ThematicMapCredits areaType={mockAreaType} dataSource={mockDataSource} />
    );

    expect(
      screen.getByText(`Map source:`, { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText(RegExp(mockDataSource))).toBeInTheDocument();
    expect(screen.getByText(RegExp(mockDataSource))).toBeInTheDocument();
    expect(
      screen.getByText(RegExp(mapMetaDataEncoder[mockAreaType].mapCopyright), {
        collapseWhitespace: false,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      mapMetaDataEncoder[mockAreaType].mapSourceURL
    );
  });

  it('should not display data source when metadata does not exist', async () => {
    render(<ThematicMapCredits areaType={mockAreaType} />);
    expect(screen.queryByText(/Data source: /)).not.toBeInTheDocument();
  });
});
