import { Checkbox, Paragraph } from 'govuk-react';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ConfidenceIntervalCheckboxProps = {
  chartName: string;
};

export function ConfidenceIntervalCheckbox({
  chartName,
}: Readonly<ConfidenceIntervalCheckboxProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const handleClick = (chartName: string, checked: boolean) => {
    const searchState = SearchStateManager.setStateFromParams(params);

    if (checked) {
      searchState.addParamValueToState(
        SearchParams.ConfidenceIntervalSelected,
        chartName
      );
    } else {
      searchState.removeParamValueFromState(
        SearchParams.ConfidenceIntervalSelected,
        chartName
      );
    }
    replace(searchState.generatePath(pathname), { scroll: false });
  };

  return (
    <Checkbox
      id={`confidence-interval-checkbox-${chartName}`}
      data-testid={`confidence-interval-checkbox`}
      name="confidence-interval-checkbox"
      onChange={(e) => {
        handleClick(chartName, e.target.checked);
      }}
    >
      <Paragraph>Show confidence intervals</Paragraph>
    </Checkbox>
  );
}
