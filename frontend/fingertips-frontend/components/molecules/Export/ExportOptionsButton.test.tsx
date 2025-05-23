import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExportOptionsButton } from './ExportOptionsButton';
import { useModal } from '@/context/ModalContext';
import userEvent from '@testing-library/user-event';

jest.mock('@/context/ModalContext', () => ({
  useModal: jest.fn(),
}));

jest.mock('@/components/molecules/Export/ExportPreviewOptions', () => ({
  ExportPreviewOptions: () => <div>Mock Export Preview</div>,
}));

const mockUseModal = useModal as jest.Mock;

describe('ExportOptionsButton', () => {
  const setModalMock = jest.fn();

  beforeEach(() => {
    mockUseModal.mockReturnValue({ setModal: setModalMock });
    setModalMock.mockClear();
  });

  it('renders the button with correct text', () => {
    render(<ExportOptionsButton targetId="test-id" />);
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('Export options');
  });

  it('calls setModal with correct content on click', async () => {
    render(<ExportOptionsButton targetId="test-id" />);
    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(setModalMock).toHaveBeenCalledTimes(1);
    expect(setModalMock.mock.calls[0][0].content).toBeTruthy(); // JSX component
  });
});
