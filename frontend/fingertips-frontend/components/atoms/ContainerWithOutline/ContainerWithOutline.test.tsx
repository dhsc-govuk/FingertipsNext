import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import { render } from '@testing-library/react';
import { expect } from 'vitest';

describe('ContainerWithOutline', () => {
  it.skip('should render correctly', () => {
    const { container } = render(<ContainerWithOutline />);
    expect(container.firstChild).toHaveStyle({
      border: '1px solid #BFC1C3',
      media: '(min-width:641px)',
    });
  });
});
