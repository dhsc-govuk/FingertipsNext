import { Checkbox, Paragraph } from 'govuk-react';
import {
  SearchParams,
  SearchStateManager,
  SearchStateParams,
} from '@/lib/searchStateManager';
import { usePathname, useRouter } from 'next/navigation';

type ConfidenceIntervalCheckboxProps = {
  chartName: string;
  showConfidenceIntervalsData: boolean;
  searchState: SearchStateParams;
};

export function ConfidenceIntervalCheckbox({
  chartName,
  showConfidenceIntervalsData,
  searchState,
}: Readonly<ConfidenceIntervalCheckboxProps>) {
  const stateManager = SearchStateManager.initialise(searchState);
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (chartName: string, checked: boolean) => {
    if (checked) {
      stateManager.addParamValueToState(
        SearchParams.ConfidenceIntervalSelected,
        chartName
      );
    } else {
      stateManager.removeParamValueFromState(
        SearchParams.ConfidenceIntervalSelected,
        chartName
      );
    }
    replace(stateManager.generatePath(pathname), { scroll: false });
  };

  return (
    <Checkbox
      id={`confidence-interval-checkbox-${chartName}`}
      data-testid={`confidence-interval-checkbox-${chartName}`}
      name="confidence-interval-checkbox"
      onChange={(e) => {
        handleClick(chartName, e.target.checked);
      }}
      defaultChecked={showConfidenceIntervalsData}
      sizeVariant="SMALL"
    >
      <Paragraph>Show confidence intervals</Paragraph>
    </Checkbox>
  );
}
