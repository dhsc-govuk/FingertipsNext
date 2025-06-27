import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeaderFooterWrapper } from './index';

let mockPathname = '/';
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

vi.mock('@/components/molecules/Header', () => ({
  FTHeader: ({ chartPage }: { chartPage: boolean }) => (
    <div data-testid="header">
      {chartPage ? 'Chart Header' : 'Normal Header'}
    </div>
  ),
}));
vi.mock('@/components/molecules/Footer', () => ({
  FTFooter: ({ chartPage }: { chartPage: boolean }) => (
    <div data-testid="footer">
      {chartPage ? 'Chart Footer' : 'Normal Footer'}
    </div>
  ),
}));

describe('HeaderFooterWrapper', () => {
  afterEach(() => {
    mockPathname = '/';
  });

  it('renders chart header/footer when on chart page', () => {
    mockPathname = '/chart/123';
    render(
      <HeaderFooterWrapper>
        <div>Chart Content</div>
      </HeaderFooterWrapper>
    );
    expect(screen.getByTestId('header')).toHaveTextContent('Chart Header');
    expect(screen.getByTestId('footer')).toHaveTextContent('Chart Footer');
  });

  it('renders normal header/footer when not on chart page', () => {
    mockPathname = '/about';
    render(
      <HeaderFooterWrapper>
        <div>Normal Content</div>
      </HeaderFooterWrapper>
    );
    expect(screen.getByTestId('header')).toHaveTextContent('Normal Header');
    expect(screen.getByTestId('footer')).toHaveTextContent('Normal Footer');
  });
});
