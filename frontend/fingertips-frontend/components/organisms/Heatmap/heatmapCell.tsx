import { GovukColours } from '@/lib/styleHelpers/colours';
import { Table } from 'govuk-react';
import styled from 'styled-components';
import {
  CellType,
  heatmapDataColumnWidth,
  heatmapIndicatorTitleColumnWidth,
  heatmapTitleColumnWidth,
} from './heatmapUtil';
import { JSX } from 'react';

const StyledCellText = styled(Table.Cell)({
  width: heatmapTitleColumnWidth,
  minHeight: '70px',
  padding: 0,
});

const StyledCellNumeric = styled(Table.Cell)({
  textAlign: 'center',
  width: heatmapDataColumnWidth,
  minHeight: '70px',
  padding: 0,
});

const StyledCellDataWithBackground = styled(StyledCellNumeric)<{
  $backgroundColor?: string;
}>`
  background-color: ${(props) =>
    props.$backgroundColor ? props.$backgroundColor : GovukColours.White};
`;

const StyledDivIndicatorCellContent = styled.div({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: heatmapIndicatorTitleColumnWidth,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
});

interface HeatmapCellProps {
  cellType: CellType;
  content: string;
  backgroundColour?: string;
}

export const HeatmapCell = ({
  cellType,
  content,
  backgroundColour,
}: HeatmapCellProps): JSX.Element => {
  switch (cellType) {
    case CellType.IndicatorTitle:
      return (
        <Table.Cell>
          <StyledDivIndicatorCellContent>
            {content}
          </StyledDivIndicatorCellContent>
        </Table.Cell>
      );
    case CellType.IndicatorInformation:
      return <StyledCellText>{content}</StyledCellText>;
    case CellType.Data:
      return (
        <StyledCellDataWithBackground $backgroundColor={backgroundColour}>
          {content}
        </StyledCellDataWithBackground>
      );
  }
};
