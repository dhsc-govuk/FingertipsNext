import {
  IndicatorDefinition,
  IndicatorMetadata,
} from '@/components/pages/indicator';
import { SearchServiceFactory } from '@/lib/search/searchServiceFactory';
import placeholderIndicatorMetadata from '../../../assets/placeholderIndicatorMetadata.json';

export default async function IndicatorPage({
  params,
}: {
  params: Promise<{ indicatorId: string }>;
}) {
  const { indicatorId } = await params;

  const indicatorMetadata =
    await SearchServiceFactory.getIndicatorSearchService().getIndicator(
      indicatorId
    );

  if (indicatorMetadata === undefined) {
    // TODO JH - scrap this & replace with basic 404 redirect
    const src =
      Math.random() < 0.5
        ? 'https://http.cat/404.jpg'
        : 'https://http.dog/404.jpg';
    return <img src={src} style={{ width: '100%' }} />;
  }

  const placeholderMetadata: IndicatorMetadata = {
    ...placeholderIndicatorMetadata,
    indicatorID: String(placeholderIndicatorMetadata.indicatorID),
    earliestDataPeriod: String(placeholderIndicatorMetadata.earliestDataPeriod),
    latestDataPeriod: String(placeholderIndicatorMetadata.latestDataPeriod),
    lastUpdatedDate: new Date(placeholderIndicatorMetadata.lastUpdatedDate),
  };

  // TODO JH - look at the AI search mock returning the whole mockIndicatorData and not just the fields on IndicatorDocument
  const fullMetadata = {
    ...placeholderMetadata,
    ...indicatorMetadata,
  };

  return <IndicatorDefinition indicatorMetadata={fullMetadata} />;
}
