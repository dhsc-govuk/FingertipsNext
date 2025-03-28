import styled from 'styled-components';

const StyleSVGElement = styled('svg')({
  'display': 'flex',
  'flexDirection': 'row',
  'justifyContent': 'left',
  'alignItems': 'center',
  'cursor': 'pointer',
  '& circle': {
    outline: 'none',
    fill: 'none',
  },
});

interface ToggleButtonProps {
  width?: number;
  height?: number;
  fill?: string;
  isOpen?: boolean;
}

export const ArrowToggleButton = ({
  width,
  height,
  fill,
  isOpen,
}: ToggleButtonProps) => {
  width = width ?? 30;
  height = height ?? 30;
  fill = fill ?? '#EEEEEE';
  return (
    <StyleSVGElement
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      data-testid="arrow-toggle-button"
      width={width}
      height={height}
    >
      <circle cx="12" cy="12" r="10" stroke={fill} strokeWidth="0.5" />
      <path
        d={isOpen ? 'M8 14l4-4 4 4' : 'M8 10l4 4 4-4'}
        stroke={fill}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyleSVGElement>
  );
};
