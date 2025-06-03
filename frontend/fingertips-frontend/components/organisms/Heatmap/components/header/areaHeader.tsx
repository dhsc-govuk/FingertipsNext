import {
  StyledCellHeaderArea,
  StyledDiv,
  StyledH4AreaScaled,
} from './areaHeader.styles';

interface AreaHeaderProps {
  content: string;
}

export const AreaHeader: React.FC<AreaHeaderProps> = ({
  content,
}: AreaHeaderProps) => {
  return (
    <StyledCellHeaderArea>
      <StyledDiv>
        <StyledH4AreaScaled>{content}</StyledH4AreaScaled>
      </StyledDiv>
    </StyledCellHeaderArea>
  );
};
