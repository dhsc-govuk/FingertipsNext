export enum SortOrderKeys {
  relevance = 'relevance',
  updated = 'updated',
  alphabetical = 'alphabetical',
}

export const sortOrderLabels: Record<SortOrderKeys, string> = {
  relevance: 'Most relevant',
  updated: 'Last updated',
  alphabetical: 'Alphabetical',
};
