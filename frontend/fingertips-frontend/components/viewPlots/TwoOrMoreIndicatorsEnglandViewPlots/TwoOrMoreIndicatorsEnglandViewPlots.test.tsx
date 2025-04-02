import { TwoOrMoreIndicatorsEnglandViewPlots } from '@/components/viewPlots/TwoOrMoreIndicatorsEnglandViewPlots/index';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { BenchmarkComparisonMethod, IndicatorPolarity, IndicatorsApi } from '@/generated-sources/ft-api-client';
import { mockDeep } from 'jest-mock-extended';
import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';


const mockSearchParams: SearchStateParams = {
  [SearchParams.IndicatorsSelected]: ['1', '2'],
  [SearchParams.AreasSelected]: [areaCodeForEngland],
};

const mockIndicatorData = [ 
  {indicatorId: 1,   
    name: ' ',  
    polarity: IndicatorPolarity.Unknown,   
    benchmarkMethod: BenchmarkComparisonMethod.Unknown,   
    areaHealthData: []}, 
  {indicatorId: 2,   
    name: ' ',  
    polarity: IndicatorPolarity.Unknown,   
    benchmarkMethod: BenchmarkComparisonMethod.Unknown,   
    areaHealthData: []} ]

const mockIndicatorMetaData = [
  {   indicatorID: '4444',   
    indicatorName: 'mockIndicator',  
    indicatorDefinition: '',   
    dataSource: '',  
    earliestDataPeriod: '',  
    latestDataPeriod: '',   
    lastUpdatedDate: new Date(),  
    associatedAreaCodes: [''],  
    hasInequalities: false,   
    unitLabel: '',  
    usedInPoc: false }, 
  
  {   indicatorID: '5555',   
    indicatorName: 'mockIndicator',  
    indicatorDefinition: '',   
    dataSource: '',  
    earliestDataPeriod: '',  
    latestDataPeriod: '',   
    lastUpdatedDate: new Date(),  
    associatedAreaCodes: [''],  
    hasInequalities: false,   
    unitLabel: '',  
    usedInPoc: false } 
]


describe('TwoOrMoreIndicatorsEnglandView', () => {
  
  it('should call TwoOrMoreIndicatorsEnglandViewPlots with the correct props', async () => {
    
    const page = await TwoOrMoreIndicatorsEnglandViewPlots(
      { searchState: mockSearchParams, 
        indicatorData: mockIndicatorData, 
        indicatorMetadata: mockIndicatorMetaData})
  
  
  // expect(page.props.searchState).toEqual(mockSearchParams);
    expect(page.props.indicatorData).toEqual(mockIndicatorData);
  });
});