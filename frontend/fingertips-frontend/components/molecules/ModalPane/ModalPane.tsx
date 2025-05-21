import { useModal } from '@/context/ModalContext';

import { SyntheticEvent } from 'react';
import { H2 } from 'govuk-react';
import {
  ModalPaneContainer,
  ModalPaneInner,
  ModalPaneOverlay,
} from '@/components/molecules/ModalPane/ModalPane.styles';
import { ModalPaneCloseButton } from '@/components/molecules/ModalPane/ModalPaneCloseButton';

export const ModalPane = () => {
  const { content, setModal, title } = useModal();

  if (!content) return null;

  const onClose = (e: SyntheticEvent) => {
    e.preventDefault();
    setModal({});
  };

  return (
    <ModalPaneContainer data-testid={'modalPane'}>
      <ModalPaneOverlay onClick={onClose} />
      <ModalPaneInner>
        {title ? <H2>{title}</H2> : null}
        <ModalPaneCloseButton onClick={onClose} />
        {content}
      </ModalPaneInner>
    </ModalPaneContainer>
  );
};
