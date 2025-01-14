'use server';

import { SearchState, SearchStateManager } from '@/lib/searchStateManager';
import { redirect, RedirectType } from 'next/navigation';

export async function updateAreasSelected(
  areaId: string,
  operation: 'ADD' | 'REMOVE',
  searchState: SearchState
) {
  const searchStateManager = new SearchStateManager(searchState);
  console.log(`searchState ${JSON.stringify(searchState)}`);

  if (operation === 'ADD') {
    searchStateManager.addAreaSelected(areaId);
  } else {
    searchStateManager.removeAreaSelected(areaId);
  }

  redirect(
    searchStateManager.generatePath('/search/results'),
    RedirectType.push
  );
}
