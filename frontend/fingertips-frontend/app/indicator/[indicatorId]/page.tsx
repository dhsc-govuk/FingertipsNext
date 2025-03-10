import {
  IndicatorDefinition,
  IndicatorDefinitionProps,
} from '@/components/pages/indicator';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import placeholderIndicatorMetadata from '../../../assets/placeholderIndicatorMetadata.json';
import { redirect } from 'next/navigation';

export default async function IndicatorPage(
  props: Readonly<{
    params: Promise<{ indicatorId: string }>;
  }>
) {
  const { indicatorId } = await props.params;

  const indicatorMetadata =
    await SearchServiceFactory.getIndicatorSearchService().getIndicator(
      indicatorId
    );

  if (indicatorMetadata === undefined) {
    redirect('/');
  }

  const placeholderMetadata: IndicatorDefinitionProps = {
    ...placeholderIndicatorMetadata,
    indicatorID: String(placeholderIndicatorMetadata.indicatorID),
    lastUpdatedDate: new Date(placeholderIndicatorMetadata.lastUpdatedDate),
  };

  const fullMetadata = {
    ...placeholderMetadata,
    ...indicatorMetadata,
  };

  return <IndicatorDefinition indicatorDefinitionProps={fullMetadata} />;
}
