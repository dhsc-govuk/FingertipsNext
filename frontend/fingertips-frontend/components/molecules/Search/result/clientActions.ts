const addToIndicatorsSelected = (
  indicatorsSelected: string[],
  indicatorToAdd: string
): string[] => {
  indicatorsSelected?.push(indicatorToAdd);
  return indicatorsSelected;
};

const removeFromIndicatorsSelected = (
  indicatorsSelected: string[],
  indicatorToRemove: string
): string[] => {
  return indicatorsSelected?.filter((ind) => {
    return ind !== indicatorToRemove;
  });
};

export const updateIndicatorsSelectedUrlParam = (
  params: URLSearchParams,
  indicatorId: string,
  checked: boolean
): URLSearchParams => {
  const indicatorsSelected =
    params.get('indicatorsSelected')?.split(encodeURI(',')) ?? [];

  const updatedIndicatorsSelected: string[] = checked
    ? addToIndicatorsSelected(indicatorsSelected, indicatorId)
    : removeFromIndicatorsSelected(indicatorsSelected, indicatorId);

  if (updatedIndicatorsSelected?.length > 0) {
    params.set(
      'indicatorsSelected',
      updatedIndicatorsSelected.join(encodeURI(','))
    );
  } else {
    params.delete('indicatorsSelected');
  }

  return params;
};
