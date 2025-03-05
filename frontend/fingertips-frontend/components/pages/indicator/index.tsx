'use client';

import {
  Caption,
  H1,
  H2,
  H3,
  H4,
  Link,
  ListItem,
  Paragraph,
  SectionBreak,
  Table,
  UnorderedList,
} from 'govuk-react';
import styled from 'styled-components';
import { spacing } from '@govuk-react/lib';

export type IndicatorMetadata = {
  valueType: string;
  denominatorType: string;
  ciMethod: string;
  unitLabel: string;
  unitValue: string;
  indicatorDefinition: string;
  rationale: string;
  dataSource: string;
  method: string;
  standardPopulation: string;
  ciMethodDetails: null;
  countSource: string;
  countDefinition: string;
  denominatorSource: string;
  denominatorDefinition: string;
  disclouseControl: string;
  caveats: string;
  copyright: string;
  reuse: string | null;
  notes: string;
  frequency: string;
  rounding: string;
  polarity: string;
  useProportionsForTrend: boolean;
  benchmarkComparisonMethod: string;
  latestDataPeriod: string;
  earliestDataPeriod: string;
  lastUpdatedDate: Date;
  usedInPoc: boolean;
  indicatorID: string;
  indicatorName: string;
};

type IndicatorProps = {
  indicatorMetadata: IndicatorMetadata;
};

const ZeroMarginParagraph = styled(Paragraph)(
  spacing.withWhiteSpace({ marginBottom: 0 })
);

export function IndicatorDefinition({
  indicatorMetadata,
}: Readonly<IndicatorProps>) {
  return (
    <>
      <Caption>Background information and indicator definitions for</Caption>
      <H1>{indicatorMetadata.indicatorName}</H1>

      <Paragraph>{`Indicator Id ${indicatorMetadata.indicatorID}`}</Paragraph>
      <Paragraph>{`Last updated ${indicatorMetadata.lastUpdatedDate}`}</Paragraph>
      <Paragraph>{`Frequency ${indicatorMetadata.frequency}`}</Paragraph>

      <SectionBreak visible={true} />

      <ZeroMarginParagraph>Contents</ZeroMarginParagraph>
      <UnorderedList listStyleType='"— "'>
        <ListItem>
          <Link href="#definitions">Indicator definitions</Link>
        </ListItem>
        <ListItem>
          <Link href="#sources">Data sources and reuse</Link>
        </ListItem>
        <ListItem>
          <Link href="#benchmarking">
            Benchmarking and confidence information
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#rationale">Indicator rationale</Link>
        </ListItem>
        <ListItem>
          <Link href="#notes">Notes and caveats</Link>
        </ListItem>
        <ListItem>
          <Link href="#links">Profiles and links</Link>
        </ListItem>
      </UnorderedList>

      <H3>Indicator definitions</H3>

      <H4>Definition</H4>
      <Paragraph>{indicatorMetadata.indicatorDefinition}</Paragraph>
      <H4>Methodology</H4>
      <Paragraph>{indicatorMetadata.method}</Paragraph>
      <H4>Definition of numerator</H4>
      <Paragraph>{indicatorMetadata.countDefinition}</Paragraph>
      <H4>Definition of denominator</H4>
      <Paragraph>{indicatorMetadata.denominatorDefinition}</Paragraph>

      <Table>
        <Table.Row>
          <Table.CellHeader>Age</Table.CellHeader>
          <Table.Cell>Age not in metadata?</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Sex</Table.CellHeader>
          <Table.Cell>Sex not in metadata?</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Value Type</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.unitLabel}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Unit</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.unitValue}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Year type</Table.CellHeader>
          <Table.Cell>Year type not in metadata?</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Standard population/values</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.standardPopulation}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Disclosure control</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.disclouseControl}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Rounding</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.rounding}</Table.Cell>
        </Table.Row>
      </Table>

      <H3>Data sources and reuse</H3>
      <Table>
        <Table.Row>
          <Table.CellHeader>Data source</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.dataSource}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Current indicator source</Table.CellHeader>
          <Table.Cell>
            <Link href="#">Current indicator source link?</Link>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Previous indicator source</Table.CellHeader>
          <Table.Cell>
            <Link href="#">Previous indicator source link?</Link>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Source of numerator</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.countSource}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Source of denominator</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.denominatorSource}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Copyright</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.copyright}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader>Date reuse</Table.CellHeader>
          <Table.Cell>{indicatorMetadata.reuse}</Table.Cell>
        </Table.Row>
      </Table>
    </>
  );
}

{
  /* <Table>
<Table.Row>
  <Table.CellHeader>CH</Table.CellHeader>
  <Table.Cell>C</Table.Cell>
</Table.Row>
</Table> */
}
