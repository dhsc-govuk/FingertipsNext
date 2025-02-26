import { ApiClientFactory } from '@/lib/apiClient/apiClientFactory';
import { SearchStateParams } from '@/lib/searchStateManager';
import { AboutPage } from '../aboutPage';

export const About = async ({
  searchState,
}: {
  searchState: SearchStateParams;
}) => {
  console.log(searchState);

  const areasApi = ApiClientFactory.getAreasApiClient();

  const availableAreaTypes = await areasApi.getAreaTypes();

  return <AboutPage areaTypes={availableAreaTypes} />;
};
