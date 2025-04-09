export enum SortOrderKeys {
  relevance = 'relevance',
  updated = 'updated',
  alphabetical = 'alphabetical',
}

export const sortOrderLabels: Record<SortOrderKeys, string> = {
  [SortOrderKeys.relevance]: 'Most relevant',
  [SortOrderKeys.updated]: 'Last updated',
  [SortOrderKeys.alphabetical]: 'Alphabetical',
};
