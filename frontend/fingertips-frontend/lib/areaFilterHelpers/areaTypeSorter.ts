import { AreaType } from '@/generated-sources/ft-api-client';

export const areaTypeSorter = (availableAreaTypes: AreaType[]): AreaType[] => {
  const areaTypesGroupedByHierarchy = availableAreaTypes.reduce(
    (result: Record<string, AreaType[]>, areaType: AreaType) => {
      const hierarchyArrary = result[areaType.hierarchyName] || [];
      result[areaType.hierarchyName] = hierarchyArrary;
      hierarchyArrary.push(areaType);

      return result;
    },
    {}
  );

  const sortAreaTypesByLevel = (areaTypes: AreaType[] = []) =>
    areaTypes.toSorted((a, b) => a.level - b.level);

  const sortHierarchy = (name: string) => {
    const areaTypes = areaTypesGroupedByHierarchy[name];

    return sortAreaTypesByLevel(areaTypes);
  };

  return [
    ...sortHierarchy('Both'),
    ...sortHierarchy('Administrative'),
    ...sortHierarchy('NHS'),
  ];
};
