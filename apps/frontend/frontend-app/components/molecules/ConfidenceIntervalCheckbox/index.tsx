import { Checkbox, Paragraph } from 'govuk-react';
import { spacing } from '@govuk-react/lib';
import styled from 'styled-components';

const StyledParagraph = styled(Paragraph)(
  spacing.withWhiteSpace({
    margin: [{ size: 0 }],
  })
);

type ConfidenceIntervalCheckboxProps = {
  chartName: string;
  showConfidenceIntervalsData: boolean;
  setShowConfidenceIntervalsData: (checked: boolean) => void;
};

export function ConfidenceIntervalCheckbox({
  chartName,
  showConfidenceIntervalsData,
  setShowConfidenceIntervalsData,
}: Readonly<ConfidenceIntervalCheckboxProps>) {
  return (
    <Checkbox
      id={`confidence-interval-checkbox-${chartName}`}
      data-testid={`confidence-interval-checkbox-${chartName}`}
      name="confidence-interval-checkbox"
      onChange={(e) => {
        setShowConfidenceIntervalsData(e.target.checked);
      }}
      defaultChecked={showConfidenceIntervalsData}
      sizeVariant="SMALL"
    >
      <StyledParagraph>Show confidence intervals</StyledParagraph>
    </Checkbox>
  );
}
