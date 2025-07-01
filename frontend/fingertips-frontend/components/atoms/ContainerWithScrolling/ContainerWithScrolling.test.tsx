import React from 'react';
import { render } from '@testing-library/react';
import { ContainerWithScrolling } from './ContainerWithScrolling'; // adjust import path

describe('ContainerWithScrolling', () => {
  it('applies both horizontal and vertical scrolling when both props are true', () => {
    const { container } = render(
      <ContainerWithScrolling horizontal vertical />
    );
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle('overflow-x: auto');
    expect(div).toHaveStyle('overflow-y: auto');
  });

  it('applies only horizontal scrolling when only horizontal is true', () => {
    const { container } = render(<ContainerWithScrolling horizontal />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle('overflow-x: auto');
    expect(div).toHaveStyle('overflow-y: hidden');
  });

  it('applies only vertical scrolling when only vertical is true', () => {
    const { container } = render(<ContainerWithScrolling vertical />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle('overflow-x: hidden');
    expect(div).toHaveStyle('overflow-y: auto');
  });

  it('applies no scrolling when neither prop is provided', () => {
    const { container } = render(<ContainerWithScrolling />);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveStyle('overflow-x: hidden');
    expect(div).toHaveStyle('overflow-y: hidden');
  });
});
