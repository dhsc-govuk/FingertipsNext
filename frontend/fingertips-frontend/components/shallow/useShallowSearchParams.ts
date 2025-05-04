import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useShallowSearchParams = () => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<URLSearchParams>(searchParams);
  const pathname = usePathname();

  useEffect(() => {
    setSearch(searchParams);
  }, [searchParams]);

  const shallowUpdate = (newSearchParams: URLSearchParams) => {
    history.pushState({}, '', `${pathname}?${newSearchParams.toString()}`);
    setSearch(newSearchParams);
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
