import { FC, SyntheticEvent } from 'react';
import { Button } from 'govuk-react';
import { useModal } from '@/context/ModalContext';
import { ExportPreview } from '@/components/molecules/Export/ExportPreview';

interface ExportOptionsButtonProps {
  targetId?: string;
}

export const ExportOptionsButton: FC<ExportOptionsButtonProps> = ({
  targetId,
}) => {
  const { setModal } = useModal();
  const onClick = (e: SyntheticEvent) => {
    e.preventDefault();

    setModal({
      content: <ExportPreview targetId={targetId} />,
    });
  };
  return <Button onClick={onClick}>Export options</Button>;
};
