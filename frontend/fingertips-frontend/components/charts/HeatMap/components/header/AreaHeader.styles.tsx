import { GovukColours } from '@/lib/styleHelpers/colours';
import { H4, Table } from 'govuk-react';
import styled from 'styled-components';
import { heatmapDataColumnWidth } from '../../heatmapConstants';

export const HeaderTitleWrapper = styled.div({
  position: 'relative',
  height: '50px',
});

export const Title = styled(H4)({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
  display: 'block',
  margin: '0px',
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '4px 8px',
  transformOrigin: 'top left',
  transform: 'translate(0, 15px) rotate(-60deg)',
});

export const BenchmarkGroupHeaderTitle = styled(Title)({
  backgroundColor: GovukColours.MidGrey,
});

export const NonBenchmarkGroupHeaderTitle = styled(Title)({
  backgroundColor: GovukColours.LightGrey,
});

export const HeaderCell = styled(Table.CellHeader)({
  verticalAlign: 'bottom',
  width: `${heatmapDataColumnWidth}px`,
  paddingRight: '0px',
  paddingLeft: '10px',
  height: '300px',
});
