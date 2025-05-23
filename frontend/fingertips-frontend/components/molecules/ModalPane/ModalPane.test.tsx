import { ModalPane } from '@/components/molecules/ModalPane/ModalPane';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockModalContext = {
  content: <p>Modal content</p>,
  title: 'Modal title',
  setModal: jest.fn(),
};

jest.mock('@/context/ModalContext', () => {
  return {
    useModal: () => mockModalContext,
  };
});

describe('ModalPane', () => {
  beforeEach(() => {
    mockModalContext.content = <p>Modal content</p>;
    mockModalContext.title = 'Modal title';
    mockModalContext.setModal = jest.fn();
  });

  it('should render an overlay with a close onClick', async () => {
    render(<ModalPane />);

    const container = screen.getByTestId('modalPane');
    const overlay = container.firstChild;
    expect(container).toBeInTheDocument();
    expect(overlay).toBeInTheDocument();
    expect(overlay).toMatchSnapshot();

    await userEvent.click(overlay as Element);
    expect(mockModalContext.setModal).toHaveBeenCalledWith({});
  });

  it('should render a title', () => {
    render(<ModalPane />);

    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Modal title');
  });

  it('should not render a title if not supplied', () => {
    mockModalContext.title = '';
    render(<ModalPane />);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('should render a close button', async () => {
    render(<ModalPane />);
    const btn = screen.queryByLabelText('Close modal');
    expect(btn).toBeInTheDocument();
    expect(btn).toMatchSnapshot();
    await userEvent.click(btn as Element);
    expect(mockModalContext.setModal).toHaveBeenCalledWith({});
  });

  it('should display given child content', () => {
    render(<ModalPane />);
    const container = screen.getByTestId('modalPane');
    const inner = container.children[1] as HTMLElement;
    expect(inner).toBeInTheDocument();
    const content = within(inner).getByRole('paragraph');
    expect(content).toHaveTextContent('Modal content');
  });
});
