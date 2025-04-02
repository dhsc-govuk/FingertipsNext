import { GovukColours } from '@/lib/styleHelpers/colours';
import { Table } from 'govuk-react';
import styled from 'styled-components';
import {
  CellType,
  heatmapDataColumnWidth,
  heatmapIndicatorTitleColumnWidth,
} from './heatmapUtil';
import { JSX } from 'react';

const StyledCellText = styled(Table.Cell)({
  minHeight: '70px',
  paddingRight: 0,
});

const StyledCellNumeric = styled(Table.Cell)({
  textAlign: 'center',
  minHeight: '70px',
  width: `${heatmapDataColumnWidth}px`,
  padding: 0,
});

const StyledCellData = styled(StyledCellNumeric)<{
  $color?: string;
  $backgroundColor?: string;
}>`
  color: ${(props) => (props.$color ? props.$color : GovukColours.Black)};
  background-color: ${(props) =>
    props.$backgroundColor ? props.$backgroundColor : GovukColours.White};
`;

const StyledDivDataCellContent = styled.div({
  minWidth: '60px',
  maxWidth: '80px',
  display: 'inline',
});

const StyledDivIndicatorTitleCellContent = styled.div({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: `${heatmapIndicatorTitleColumnWidth}px`,
  display: '-webkit-box',
  WebkitLineClamp: 4,
  WebkitBoxOrient: 'vertical',
});

const StyledDivIndicatorInformationCellContent = styled.div({
  minWidth: '40px',
  paddingRight: '20px',
});

interface HeatmapCellProps {
  cellType: CellType;
  content: string;
  textColour?: string;
  backgroundColour?: string;
}

export const HeatmapCell = ({
  cellType,
  content,
  textColour,
  backgroundColour,
}: HeatmapCellProps): JSX.Element => {
  switch (cellType) {
    case CellType.IndicatorTitle:
      return (
        <Table.Cell>
          <StyledDivIndicatorTitleCellContent>
            {content}
          </StyledDivIndicatorTitleCellContent>
        </Table.Cell>
      );
    case CellType.IndicatorInformation:
      return (
        <StyledCellText>
          <StyledDivIndicatorInformationCellContent>
            {content}
          </StyledDivIndicatorInformationCellContent>
        </StyledCellText>
      );
    case CellType.Data:
      return (
        <StyledCellData $color={textColour} $backgroundColor={backgroundColour}>
          <StyledDivDataCellContent>
            <StyledDivDataCellContent>{content}</StyledDivDataCellContent>
          </StyledDivDataCellContent>
        </StyledCellData>
      );
  }
};
