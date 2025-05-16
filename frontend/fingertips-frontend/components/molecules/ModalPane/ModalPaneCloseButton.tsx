import { FC, SyntheticEvent } from 'react';
import { RemoveIcon } from '@/components/atoms/RemoveIcon';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { ModalPaneBlankButton } from '@/components/molecules/ModalPane/ModalPane.styles';

interface ModalPaneCloseButtonProps {
  onClick?: (e: SyntheticEvent) => void;
}

export const ModalPaneCloseButton: FC<ModalPaneCloseButtonProps> = ({
  onClick,
}) => {
  return (
    <ModalPaneBlankButton onClick={onClick} aria-label={'Close modal'}>
      <RemoveIcon width={'16px'} height={'16px'} color={GovukColours.Black} />
    </ModalPaneBlankButton>
  );
};
