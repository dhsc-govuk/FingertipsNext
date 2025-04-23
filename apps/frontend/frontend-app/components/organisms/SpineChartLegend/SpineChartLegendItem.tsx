import styled from 'styled-components';
import { SpineChartLegendTypes } from '@/components/organisms/SpineChartLegend/SpineChartLegend.types';
import { FC } from 'react';
import { getLegendSymbol } from '@/components/organisms/SpineChartLegend/SpineChartLegendSymbols';

const FlexDiv = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
});

interface SpineChartLegendItemProps {
  children: React.ReactNode;
  itemType: SpineChartLegendTypes;
}

export const SpineChartLegendItem: FC<SpineChartLegendItemProps> = ({
  children,
  itemType,
}) => {
  const SymbolComponent = getLegendSymbol(itemType);
  return (
    <FlexDiv>
      <SymbolComponent />
      <span>{children}</span>
    </FlexDiv>
  );
};
