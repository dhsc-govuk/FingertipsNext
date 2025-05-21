import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { ModalPane } from '@/components/molecules/ModalPane/ModalPane';

export interface Modal {
  content?: ReactNode;
  title?: string;
}

export const ModalContext = createContext<{
  modal: Modal;
  setModal: (newPreview: Modal) => void;
}>({ modal: {}, setModal: () => undefined });

export const useModal = () => {
  const { modal, setModal } = useContext(ModalContext);
  const { content, title } = modal;
  return { modal, setModal, content, title };
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [modal, setModal] = useState<Modal>({});
  const providerValue = useMemo(
    () => ({
      modal,
      setModal,
    }),
    [modal]
  );

  return (
    <ModalContext.Provider value={providerValue}>
      {children}
      <ModalPane />
    </ModalContext.Provider>
  );
};
