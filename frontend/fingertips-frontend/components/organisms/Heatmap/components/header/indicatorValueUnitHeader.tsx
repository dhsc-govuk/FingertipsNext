import {
  StyledCellHeaderIndicatorInformationValueUnit,
  StyledH4Header,
} from './indicatorHeader.styles';

interface IndicatorValueUnitHeaderProps {
  content: string;
}

export const IndicatorValueUnitHeader: React.FC<
  IndicatorValueUnitHeaderProps
> = ({ content }: IndicatorValueUnitHeaderProps) => {
  return (
    <StyledCellHeaderIndicatorInformationValueUnit>
      <StyledH4Header>{content}</StyledH4Header>
    </StyledCellHeaderIndicatorInformationValueUnit>
  );
};
