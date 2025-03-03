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
    const expectedTabTitleText = ['Foo', 'Bar', 'Baz'];
    const expectedContentText = [
      'Lorem ipsum',
      'dolor sit',
      'amet, consectetur.',
    ];

    render(<TabContainer id="some-container" items={items} />);

    const titles = screen.getAllByRole('link');
    titles.map((_, index) => {
      expect(titles[index].textContent).toBe(expectedTabTitleText[index]);
    });

    const panels = screen.getAllByRole('paragraph');
    panels.map((_, index) => {
      expect(panels[index].textContent).toBe(expectedContentText[index]);
    });
  });

  it('should render the footer with each item', () => {
    const footerContent = 'Thrice!';

    render(
      <TabContainer
        id="some-container"
        items={items}
        footer={<>{footerContent}</>}
      />
    );

    expect(screen.getAllByText(footerContent)).toHaveLength(3);
  });
});
