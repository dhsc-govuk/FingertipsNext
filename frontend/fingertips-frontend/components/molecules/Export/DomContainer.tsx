import { FC, useEffect, useRef } from 'react';

interface DomContainerProps {
  data?: HTMLElement | HTMLCanvasElement;
}

export const DomContainer: FC<DomContainerProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (data) {
      containerRef.current.replaceChildren(data);
    } else {
      containerRef.current.replaceChildren('');
    }
  }, [data]);

  return <div ref={containerRef}></div>;
};
