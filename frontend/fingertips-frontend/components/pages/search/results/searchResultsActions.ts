'use server';

import { redirect, RedirectType } from 'next/navigation';

export type SearchResultState = {
  indicator?: string;
  indicators?: string[];
};

export async function viewCharts(
  prevState: SearchResultState,
  formData: FormData
): Promise<SearchResultState> {
  const indicator = prevState.indicator ?? formData.get('searchedIndicator');
  const indicatorsSelected = formData.getAll('indicator')?.toString();

  redirect(
    `/chart?indicator=${indicator}&indicatorsSelected=${encodeURIComponent(indicatorsSelected)}`,
    RedirectType.push
  );
}
