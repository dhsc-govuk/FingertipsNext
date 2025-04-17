import React, { FC } from 'react';

interface InViewTriggerProps {
  triggerRef: React.RefObject<HTMLDivElement | null>;
  more?: boolean;
}

export const InViewTrigger: FC<InViewTriggerProps> = ({
  triggerRef,
  more = false,
}) => {
  return <div ref={triggerRef}>{more ? 'More...' : null}</div>;
};
