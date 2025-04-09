import styled from 'styled-components';
import { SpineChartLegendItem } from '@/components/organisms/SpineChartLegend/SpineChartLegendItem';
import { SpineChartLegendTypes } from '@/components/organisms/SpineChartLegend/SpineChartLegend.types';
import { FC } from 'react';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';

const DivContainer = styled.div({
  fontFamily: 'nta, Arial, sans-serif',
  marginBottom: '0.5rem',
});

const FlexDiv = styled.div({
  display: 'flex',
  gap: '1rem',
});

interface SpineChartLegendProps {
  legendsToShow: BenchmarkLegendsToShow;
  benchmarkName?: string;
  groupName?: string;
  areaNames?: string[];
}

export const SpineChartLegend: FC<SpineChartLegendProps> = ({
  legendsToShow,
  benchmarkName = 'England',
  groupName = '',
  areaNames = ['Area'],
}) => {
  return (
    <DivContainer>
      <FlexDiv>
        <SpineChartLegendItem itemType={SpineChartLegendTypes.Benchmark}>
          Benchmark: {benchmarkName}
        </SpineChartLegendItem>
        <SpineChartLegendItem itemType={SpineChartLegendTypes.Group}>
          Group: {groupName}
        </SpineChartLegendItem>
        {areaNames.map((name, index) => (
          <SpineChartLegendItem
            key={`SpineChartLegendItem-${name}`}
            itemType={
              index === 0
                ? SpineChartLegendTypes.Area
                : SpineChartLegendTypes.AreaTwo
            }
          >
            {name}
          </SpineChartLegendItem>
        ))}
      </FlexDiv>

      <BenchmarkLegends legendsToShow={legendsToShow} />
    </DivContainer>
  );
};
