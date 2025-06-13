import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import { render } from '@testing-library/react';

describe('ContainerWithOutline', () => {
  it('should render correctly', () => {
    const { container } = render(<ContainerWithOutline />);
    expect(container.firstChild).toHaveStyleRule(
      'border',
      '1px solid #BFC1C3',
      {
        media: '(min-width:641px)',
      }
    );
  });
});
