import { render } from '@testing-library/react';
import { ShowHideContainer } from '.';

describe('ShowHideContainer', () => {
  it('should not show the side bar when showSideBarWhenOpen is false', async () => {
    /**
     * In the snapshot you will still the following style
     * .c1 div {
     *   border-left: none;
     * }
     * This indicates the sidebar was not rendered
     */

    const container = render(
      <ShowHideContainer summary="Some summary" showSideBarWhenOpen={false}>
        <div data-testid="inner-component">Some child element</div>
      </ShowHideContainer>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should not show the side bar when showSideBarWhenOpen is true', async () => {
    /**
     * In the snapshot you will still the following style
     * .c1 div {
     *   border-left: 5px #A1A2A3 solid;
     *   padding-left: 1em;
     * }
     * This indicates the sidebar was rendered
     */

    const container = render(
      <ShowHideContainer summary="Some summary" showSideBarWhenOpen={true}>
        <div data-testid="inner-component">Some child element</div>
      </ShowHideContainer>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
