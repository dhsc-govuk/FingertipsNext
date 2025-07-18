import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';

const DefaultMinimumWidthForTablePanel = 250;

export const StylePopulationPyramidTableSection = styled('section')({
  'display': 'flex',
  'flexDirection': 'row',
  'flexWrap': 'nowrap',
  'justifyContent': 'flex-start',
  'alignItems': 'stretch',
  'marginBottom': '1rem',
  '& table ': {
    'margin': '0px !important',
    'border': '0px',

    '& th': {
      padding: '10px !important',
    },
    '& td': {
      padding: '10px 10px 10px 0px !important',
    },
  },
});

export const StyleBenchmarkDataDiv = styled('div')({
  'flexGrow': 2,
  'marginLeft': 'auto',
  'backgroundColor': GovukColours.MidGrey,
  '& table ': {
    '& td, th': {
      borderBottomColor: GovukColours.LightGrey,
      borderTopColor: GovukColours.LightGrey,
      textAlign: 'right',
    },
  },
  'minWidth': DefaultMinimumWidthForTablePanel,
  '& h3': {
    textAlign: 'center',
  },
});

export const StyleScrollableContentDiv = styled('div')({
  'display': 'flex',
  'flexDirection': 'row',
  'flexWrap': 'nowrap',
  'flexGrow': 8,
  'overflow': 'hidden',
  'clear': 'both',
  '@media only screen and (min-width: 480px)': {
    overflowX: 'auto',
  },
});

export const StyleGroupTableContentDiv = styled('div')({
  'flexGrow': 2,
  'backgroundColor': GovukColours.LightGrey,
  '& table ': {
    '& td, th': {
      borderBottomColor: GovukColours.MidGrey,
      borderTopColor: GovukColours.MidGrey,
      textAlign: 'right',
    },
  },
  'minWidth': DefaultMinimumWidthForTablePanel,
});

export const StyleSelectedAreaTableContextDiv = styled('div')({
  'flexGrow': 8,
  'minWidth': DefaultMinimumWidthForTablePanel + 40,
  '& table': {
    '& td:first-child, th:first-child': {
      minWidth: '90px',
      textAlign: 'left',
      paddingLeft: '10px !important',
    },
    '& td, th': {
      borderTopColor: GovukColours.MidGrey,
      borderBottomColor: GovukColours.MidGrey,
      textAlign: 'right',
    },
  },
});
