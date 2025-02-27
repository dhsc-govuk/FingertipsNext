import { render } from '@testing-library/react';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import OneIndicatorOneAreaView from './OneIndicatorOneAreaView';
import { ViewsContext } from './ViewsContext';

jest.mock('./OneIndicatorOneAreaView/', () => {
  console.log('in mockOneIndicatorOneAreaView');
  return {
    OneIndicatorOneAreaView: function OneIndicatorOneAreaView() {
      console.log('deeper in mockOneIndicatorOneAreaView');
      return <div></div>;
    },
  };
});

jest.mock('./OneIndicatorTwoOrMoreAreasView/', () => {
  console.log('in mockOneIndicatorTwoOrMoreAreasView');
  return {
    OneIndicatorTwoOrMoreAreasView: function OneIndicatorTwoOrMoreAreasView() {
      console.log('deeper in mockOneIndicatorTwoOrMoreAreasView');
      return <div></div>;
    },
  };
});

jest.mock('./TwoOrMoreIndicatorsAreasView/', () => {
  console.log('in mockTwoOrMoreIndicatorsAreasView');
  return {
    TwoOrMoreIndicatorsAreasView: function TwoOrMoreIndicatorsAreasView() {
      console.log('deeper in mockTwoOrMoreIndicatorsAreasView');
      return <div></div>;
    },
  };
});

jest.mock('./TwoOrMoreIndicatorsEnglandView/', () => {
  console.log('in mockTwoOrMoreIndicatorsEnglandView');
  return {
    TwoOrMoreIndicatorsEnglandView: function TwoOrMoreIndicatorsEnglandView() {
      console.log('deeper in mockTwoOrMoreIndicatorsEnglandView');
      return <div></div>;
    },
  };
});

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('ViewsContext', () => {
  it.each([
    [['foo'], ['zam']],
    // [['foo', 'bar'], 'twoAreasView'],
    // [['foo', 'bar', 'baz'], 'threeOrMoreAreasView'],
    // [['foo', 'bar', 'baz', 'bert'], 'threeOrMoreAreasView'],
    // [[areaCodeForEngland], 'englandView'],
  ])('should return the expected view', async (areaCodes, indicators) => {
    const searchParams: SearchStateParams = {
      [SearchParams.AreasSelected]: areaCodes,
      [SearchParams.IndicatorsSelected]: indicators,
    };
    console.log(searchParams);
    render(
      <ViewsContext searchState={await generateSearchParams(searchParams)} />
    );
    expect(OneIndicatorOneAreaView).toHaveBeenCalled();
  });
});
