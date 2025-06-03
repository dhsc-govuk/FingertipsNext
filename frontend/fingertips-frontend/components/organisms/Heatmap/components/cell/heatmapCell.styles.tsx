import { Table } from 'govuk-react';
import styled from 'styled-components';
import { heatmapIndicatorTitleColumnWidth } from '../../heatmapUtil';
import { GovukColours } from '@/lib/styleHelpers/colours';

const stickyLeft = {
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  paddingRight: '0.5em',
};

export const StyledIndicatorCell = styled(Table.Cell)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  borderRight: 'solid #bfc1c3 1px',
});

export const StyledCellText = styled(Table.Cell)({
  minHeight: '70px',
  paddingRight: 0,
});

export const StyledCellNumeric = styled(Table.Cell)({
  textAlign: 'center',
  padding: 0,
  position: 'relative',
  borderLeft: `1px solid #bfc1c3`,
  verticalAlign: 'middle',
});

export const StyledCellData = styled(StyledCellNumeric)<{
  $color?: string;
  $backgroundColor?: string;
}>`
  color: ${(props) => props.$color ?? GovukColours.Black};
  background-color: ${(props) => props.$backgroundColor ?? GovukColours.White};
`;

export const StyledDivDataCellContent = styled.div({
  margin: '2px',
  padding: '10px',
  minWidth: '40px',
  maxWidth: '120px',
  minHeight: '2em',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const StyledDivIndicatorTitleCellContent = styled.div({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: `${heatmapIndicatorTitleColumnWidth}px`,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
  paddingLeft: '10px',
});

export const StyledDivIndicatorInformationCellContent = styled.div({
  minWidth: '40px',
  paddingRight: '10px',
  paddingLeft: '10px',
});

export const StyledDivIndicatorInformationValueUnitCellContent = styled(
  StyledDivIndicatorInformationCellContent
)({
  textAlign: 'left',
});

export const StyledDivIndicatorInformationPeriodCellContent = styled(
  StyledDivIndicatorInformationCellContent
)({
  textAlign: 'right',
});
