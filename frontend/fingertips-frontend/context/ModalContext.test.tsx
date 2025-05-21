import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ModalProvider, useModal } from '@/context/ModalContext';

const TestComponent = () => {
  const { setModal } = useModal();
  return (
    <button
      onClick={() =>
        setModal({ title: 'Modal title', content: <p>Modal content</p> })
      }
    >
      Open Modal
    </button>
  );
};

describe('ModalProvider', () => {
  it('renders modal content when modal is set', async () => {
    render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    );

    await userEvent.click(screen.getByText(/open modal/i));

    expect(await screen.findByText(/modal content/i)).toBeInTheDocument();
    expect(screen.getByText(/modal title/i)).toBeInTheDocument();
  });
});
