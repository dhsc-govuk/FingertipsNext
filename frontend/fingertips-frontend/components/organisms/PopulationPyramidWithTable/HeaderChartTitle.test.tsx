import { render, screen } from '@testing-library/react';
import { HeaderChartTitle } from './HeaderChartTitle';
import '@testing-library/jest-dom';

describe('HeaderChartTitle Component', () => {
  test('renders correctly with a given title', () => {
    render(<HeaderChartTitle title="Test Chart Title" />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Test Chart Title'
    );
  });

  test('renders correctly with an empty title', () => {
    render(<HeaderChartTitle title="" />);

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('');
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<HeaderChartTitle title="Snapshot Title" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
