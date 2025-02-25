import { Checkbox, Paragraph } from 'govuk-react';
import { spacing, typography } from '@govuk-react/lib';
import { SearchParams, SearchStateManager } from '@/lib/searchStateManager';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';

type ConfidenceIntervalCheckboxProps = {
  chartName: string;
  showConfidenceIntervalsData: boolean;
};

export function ConfidenceIntervalCheckbox({
  chartName,
  showConfidenceIntervalsData,
}: Readonly<ConfidenceIntervalCheckboxProps>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const searchState = SearchStateManager.setStateFromParams(params);

  const handleClick = (chartName: string, checked: boolean) => {
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

  const StyledParagraph = styled(Paragraph)(
    spacing.withWhiteSpace({
      margin: [{ size: 0 }],
    })
  );

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
      <StyledParagraph>Show confidence intervals</StyledParagraph>
    </Checkbox>
  );
}
