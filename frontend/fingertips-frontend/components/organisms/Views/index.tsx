import OneIndicatorOneAreaView from './OneIndicatorOneAreaView';
import { SearchStateParams } from '@/lib/searchStateManager';

type ViewsContextProps = {
  searchState: SearchStateParams;
};

export function ViewsContext({ searchState }: ViewsContextProps) {
  // determine which view is needed
  return <OneIndicatorOneAreaView searchState={searchState} />;
}
