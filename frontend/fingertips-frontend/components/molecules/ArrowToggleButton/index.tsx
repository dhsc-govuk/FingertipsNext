import { useCallback, useState } from 'react';

interface ToggleButtonProps {
  width?: number;
  height?: number;
  fill?: string;
  onToggle?: (isClosed: boolean) => boolean;
}

export const ArrowToggleButton = ({
  width,
  height,
  fill,
  onToggle,
}: ToggleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleArrow = useCallback(() => {
    let status = !isOpen;
    if (onToggle) {
      status = onToggle(status);
    }
    setIsOpen(status);
  }, [onToggle, isOpen]);

  width = width ?? 20;
  height = height ?? 20;
  fill = fill ?? '#EEEEEE';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      data-testid="arrow-toggle-button"
      width={width}
      height={height}
      fill="currentColor"
      style={{ cursor: 'pointer', padding: '0px' }}
      onClick={toggleArrow}
      className="w-6 h-6 transition-transform duration-300"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={fill}
        strokeWidth="0.5"
        fill="none"
      />
      <path
        d={isOpen ? 'M8 10l4 4 4-4' : 'M8 14l4-4 4 4'}
        stroke={fill}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
