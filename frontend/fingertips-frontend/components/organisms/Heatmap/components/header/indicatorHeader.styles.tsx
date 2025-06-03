import { H4, Table } from 'govuk-react';
import styled from 'styled-components';
import { heatmapIndicatorTitleColumnWidth } from '../../heatmapUtil';

export const StyledH4Header = styled(H4)({
  height: '50px',
  margin: 0,
});

export const StyledH4IndicatorHeader = styled(StyledH4Header)({
  width: `${heatmapIndicatorTitleColumnWidth}px`,
});

export const StyledCellHeaderIndicatorTitle = styled(Table.CellHeader)({
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  paddingRight: '10px',
  verticalAlign: 'bottom',
  width: `${heatmapIndicatorTitleColumnWidth}px`,
  paddingLeft: '10px',
});

export const StyledCellHeaderIndicatorInformationValueUnit = styled(
  Table.CellHeader
)({
  verticalAlign: 'bottom',
  paddingRight: '10px',
  paddingLeft: '10px',
  textAlign: 'left',
});

export const StyledCellHeaderIndicatorInformationPeriod = styled(
  Table.CellHeader
)({
  verticalAlign: 'bottom',
  paddingRight: '10px',
  paddingLeft: '10px',
  textAlign: 'right',
});
