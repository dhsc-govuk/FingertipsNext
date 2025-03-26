'use client';

import {
  Caption,
  H1,
  H3,
  H4,
  Link,
  ListItem,
  Paragraph,
  SectionBreak,
  Table,
  UnorderedList,
  BackLink,
  LoadingBox,
} from 'govuk-react';
import { useEffect } from 'react';
import styled from 'styled-components';
import { spacing } from '@govuk-react/lib';
import { formatDate } from '@/lib/dateHelpers/dateHelpers';
import {
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { useLoader } from '@/context/LoaderContext';
import { usePathname } from 'next/navigation';
import { ClientStorage, ClientStorageKeys } from '@/storage/clientStorage';

export type IndicatorDefinitionProps = {
  indicatorName: string;
  indicatorID: string;
  lastUpdatedDate: Date;
  frequency: string;

  indicatorDefinition: string;
  method: string;
  countDefinition: string;
  denominatorDefinition: string;
  denominatorType: string;

  age: string;
  sex: string;
  unitLabel: string;
  unitValue: string;
  yearType: string;
  valueType: string;
  standardPopulation: string;
  disclouseControl: string;
  rounding: string;

  dataSource: string;
  countSource: string;
  denominatorSource: string;
  copyright: string;
  reuse: string | null;

  benchmarkMethod: string;
  benchmarkSignificanceLevel: string;
  benchmarkComparisonMethod: string;
  ciMethod: string | null;
  ciMethodDetails: string | null;

  rationale: string;

  notes: string;
  caveats: string;
};

type IndicatorProps = {
  indicatorDefinitionProps: IndicatorDefinitionProps;
  searchState: SearchStateParams;
};

const ZeroMarginParagraph = styled(Paragraph)(
  spacing.withWhiteSpace({ marginBottom: 0 })
);

const TopHeading = styled(H1)(spacing.withWhiteSpace({ marginBottom: 2 }));
const StyledSectionBreak = styled(SectionBreak)(
  spacing.withWhiteSpace({ margin: 4 })
);

export function IndicatorDefinition({
  indicatorDefinitionProps,
  searchState,
}: Readonly<IndicatorProps>) {
  const { getIsLoading, setIsLoading } = useLoader();
  const pathname = usePathname();
  const previousPath = ClientStorage.getState<string>(
    ClientStorageKeys.previousPath
  );

  useEffect(() => {
    if (pathname !== previousPath) {
      window.scrollTo(0, 0);
    }
    ClientStorage.updateState(ClientStorageKeys.previousPath, pathname);
  }, [previousPath, pathname]);

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading, getIsLoading]);

  const stateManager = SearchStateManager.initialise(searchState);

  return (
    <LoadingBox loading={getIsLoading()} timeIn={200} timeOut={200}>
      <>
        <BackLink
          onClick={() => setIsLoading(true)}
          href={stateManager.generatePath('/chart')}
          data-testid="search-results-back-link"
        />

        <Caption>Background information and indicator definitions for</Caption>
        <TopHeading>{indicatorDefinitionProps.indicatorName}</TopHeading>

        <ZeroMarginParagraph
          supportingText={true}
        >{`Indicator ID ${indicatorDefinitionProps.indicatorID}`}</ZeroMarginParagraph>
        <ZeroMarginParagraph
          supportingText={true}
        >{`Last updated ${formatDate(indicatorDefinitionProps.lastUpdatedDate)}`}</ZeroMarginParagraph>
        <ZeroMarginParagraph
          supportingText={true}
        >{`Frequency ${indicatorDefinitionProps.frequency}`}</ZeroMarginParagraph>

        <StyledSectionBreak visible={true} />

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

        <H3 id="definitions">Indicator definitions</H3>

        <H4>Definition</H4>
        <Paragraph>{indicatorDefinitionProps.indicatorDefinition}</Paragraph>
        <H4>Methodology</H4>
        <Paragraph>{indicatorDefinitionProps.method}</Paragraph>
        <H4>Definition of numerator</H4>
        <Paragraph>{indicatorDefinitionProps.countDefinition}</Paragraph>
        <H4>Definition of denominator</H4>
        <Paragraph>{indicatorDefinitionProps.denominatorDefinition}</Paragraph>

        <StyledSectionBreak visible={false} />

        <Table>
          <Table.Row>
            <Table.CellHeader>Age</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.age}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Sex</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.sex}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Value Type</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.valueType}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Unit</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.unitLabel}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Year type</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.yearType}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Standard population/values</Table.CellHeader>
            <Table.Cell>
              {indicatorDefinitionProps.standardPopulation}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Disclosure control</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.disclouseControl}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Rounding</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.rounding}</Table.Cell>
          </Table.Row>
        </Table>

        <H3 id="sources">Data sources and reuse</H3>
        <Table>
          <Table.Row>
            <Table.CellHeader>Data source</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.dataSource}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Current indicator source</Table.CellHeader>
            <Table.Cell>
              <Link href="#">placeholder current indicator source</Link>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Previous indicator source</Table.CellHeader>
            <Table.Cell>
              <Link href="#">placeholder previous indicator source</Link>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Source of numerator</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.countSource}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Source of denominator</Table.CellHeader>
            <Table.Cell>
              {indicatorDefinitionProps.denominatorSource}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Copyright</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.copyright}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Date reuse</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.reuse}</Table.Cell>
          </Table.Row>
        </Table>
        <H3 id="benchmarking">Benchmarking and confidence information</H3>
        <Table>
          <Table.Row>
            <Table.CellHeader>Benchmarking method</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.benchmarkMethod}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Benchmarking significance level</Table.CellHeader>
            <Table.Cell>
              {indicatorDefinitionProps.benchmarkSignificanceLevel}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader>Confidence interval method</Table.CellHeader>
            <Table.Cell>{indicatorDefinitionProps.ciMethod}</Table.Cell>
          </Table.Row>
        </Table>
        {indicatorDefinitionProps.ciMethodDetails ? (
          <>
            <H4>Confidence interval methodology</H4>
            <Paragraph>{indicatorDefinitionProps.ciMethodDetails}</Paragraph>
          </>
        ) : (
          <></>
        )}

        <H3 id="rationale">Indicator rationale</H3>
        <Paragraph>{indicatorDefinitionProps.rationale}</Paragraph>

        <H3 id="notes">Notes and caveats</H3>
        <H4>Notes</H4>
        <Paragraph>{indicatorDefinitionProps.notes}</Paragraph>
        <H4>Caveats</H4>
        <Paragraph>{indicatorDefinitionProps.caveats}</Paragraph>

        <H3 id="links">Public health profile usage and related content</H3>
        <H4>This indicator is used in the following health profiles</H4>
        <UnorderedList listStyleType="none">
          <ListItem>
            <Link href="#">placeholder profile 1</Link>
          </ListItem>
          <ListItem>
            <Link href="#">placeholder profile 2</Link>
          </ListItem>
          <ListItem>
            <Link href="#">placeholder profile 3</Link>
          </ListItem>
        </UnorderedList>

        <H4>Related Content</H4>
        <UnorderedList listStyleType="none">
          <ListItem>
            <Link href="#">placeholder link 1</Link>
          </ListItem>
          <ListItem>
            <Link href="#">placeholder link 2</Link>
          </ListItem>
          <ListItem>
            <Link href="#">placeholder link 3</Link>
          </ListItem>
        </UnorderedList>
      </>
    </LoadingBox>
  );
}
