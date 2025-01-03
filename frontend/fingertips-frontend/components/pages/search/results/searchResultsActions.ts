'use server';

import { SearchStateManager } from '@/lib/searchStateManager';
import { redirect, RedirectType } from 'next/navigation';

export type SearchResultState = {
  indicator?: string;
  indicators?: string[];
};

export async function viewCharts(
  prevState: SearchResultState,
  formData: FormData
): Promise<SearchResultState> {
  const indicator =
    prevState.indicator ?? formData.get('searchedIndicator')?.toString();
  const indicatorsSelected = formData
    .getAll('indicator')
    ?.toString()
    .split(',');

  const searchState = new SearchStateManager(indicator, indicatorsSelected);
  redirect(searchState.generatePath('/chart'), RedirectType.push);
}
