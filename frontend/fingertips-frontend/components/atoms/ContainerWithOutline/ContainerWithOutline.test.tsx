import { ContainerWithOutline } from '@/components/atoms/ContainerWithOutline/ContainerWithOutline';
import { render } from '@testing-library/react';

describe('ContainerWithOutline', () => {
  it('should render correctly', () => {
    const { container } = render(
      <ContainerWithOutline>Content</ContainerWithOutline>
    );
    expect(container).toMatchSnapshot();
  });
});
