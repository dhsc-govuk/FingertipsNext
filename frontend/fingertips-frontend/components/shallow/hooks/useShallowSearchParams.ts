import { usePathname, useSearchParams } from 'next/navigation';

export const useShallowSearchParams = () => {
  const search = useSearchParams();
  const pathname = usePathname();

  const shallowUpdate = (newSearchParams: URLSearchParams) => {
    history.pushState({}, '', `${pathname}?${newSearchParams.toString()}`);
  };

  const selectedAreas = search.getAll('as');
  const selectedAreaType = search.get('ats') ?? 'england';
  const selectedGroupType = search.get('gts') ?? undefined;
  const selectedGroup = search.get('gs') ?? undefined;

  return {
    shallowUpdate,
    search,
    selectedAreaType,
    selectedAreas,
    selectedGroupType,
    selectedGroup,
  };
};
