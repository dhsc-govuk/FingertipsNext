import { Table } from 'govuk-react';
import styled from 'styled-components';
import { heatmapIndicatorTitleColumnWidth } from '../../../heatmapUtil';
import { BorderColour } from '@/lib/styleHelpers/colours';

export const IndicatorCell = styled(Table.Cell)({
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  paddingRight: '0.5em',
  borderRight: `solid #${BorderColour} 1px`,
});

export const TextCell = styled(Table.Cell)({
  minHeight: '70px',
  paddingRight: 0,
});

export const IndicatorTitleCellContent = styled.div({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: `${heatmapIndicatorTitleColumnWidth}px`,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  paddingLeft: '10px',
});

export const IndicatorInfoCellContent = styled.div({
  minWidth: '40px',
  paddingRight: '10px',
  paddingLeft: '10px',
});

export const IndicatorValueUnitCellContent = styled(IndicatorInfoCellContent)({
  textAlign: 'left',
});

export const IndicatorPeriodCellContent = styled(IndicatorInfoCellContent)({
  textAlign: 'right',
});
