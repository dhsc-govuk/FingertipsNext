import { render, screen } from '@testing-library/react';
import { TabContainer } from '.';

describe('tab container', () => {
  const items = [
    {
      id: 'foo',
      title: 'Foo',
      content: <p>Lorem ipsum</p>,
    },
    {
      id: 'bar',
      title: 'Bar',
      content: <p>dolor sit</p>,
    },
    {
      id: 'baz',
      title: 'Baz',
      content: <p>amet, consectetur.</p>,
    },
  ];
  it('should preserve order between item titles and item content', () => {
    const expectedTitleText = ['Foo', 'Bar', 'Baz'];
    const expectedContentText = [
      'Lorem ipsum',
      'dolor sit',
      'amet, consectetur.',
    ];

    render(<TabContainer items={items} />);

    const titles = screen.getAllByRole('link');
    titles.map((_, index) => {
      expect(titles[index].textContent).toBe(expectedTitleText[index]);
    });

    const panels = screen.getAllByRole('paragraph');
    panels.map((_, index) => {
      expect(panels[index].textContent).toBe(expectedContentText[index]);
    });
  });
});
