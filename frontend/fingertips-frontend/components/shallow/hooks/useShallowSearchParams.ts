import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchParams } from '@/lib/searchStateManager';

export const useShallowSearchParams = () => {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const shallowUpdate = (newSearchParams: URLSearchParams) => {
    // history.pushState({}, '', `${pathname}?${newSearchParams.toString()}`);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const areasSelected = search.getAll(SearchParams.AreasSelected);
  if (!areasSelected.length) areasSelected.push('E92000001');

  const queryValues = {
    searchedIndicator: search.get(SearchParams.SearchedIndicator),
    indicatorsSelected:
      search.getAll(SearchParams.IndicatorsSelected) ?? undefined,
    areasSelected,
    areaTypeSelected: search.get(SearchParams.AreaTypeSelected) ?? 'england',
    groupTypeSelected: search.get(SearchParams.GroupTypeSelected) ?? undefined,
    groupSelected: search.get(SearchParams.GroupSelected) ?? undefined,
    groupAreaSelected: search.get(SearchParams.GroupAreaSelected) ?? undefined,
    inequalityYearSelected:
      search.get(SearchParams.InequalityYearSelected) ?? undefined,
    inequalityBarChartAreaSelected:
      search.get(SearchParams.InequalityBarChartAreaSelected) ?? undefined,
    inequalityLineChartAreaSelected:
      search.get(SearchParams.InequalityLineChartAreaSelected) ?? undefined,
    inequalityLineChartTypeSelected:
      search.get(SearchParams.InequalityLineChartTypeSelected) ?? undefined,
    inequalityBarChartTypeSelected:
      search.get(SearchParams.InequalityBarChartTypeSelected) ?? undefined,
    populationAreaSelected:
      search.get(SearchParams.PopulationAreaSelected) ?? undefined,
    searchedOrder: search.get(SearchParams.SearchedOrder) ?? undefined,
    pageNumber: search.get(SearchParams.PageNumber) ?? undefined,
    benchmarkAreaSelected:
      search.get(SearchParams.BenchmarkAreaSelected) ?? undefined,
  };

  return {
    shallowUpdate,
    search,
    ...queryValues,
  };
};
