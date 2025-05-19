import { render, screen } from '@testing-library/react';
import { ProjectVersion } from '@/components/atoms/ProjectVersion/index';
import { expect } from '@jest/globals';

describe('ProjectVersion', () => {
  it('should render versions', () => {
    render(<ProjectVersion tag={'vX.Y.Z'} hash={'ABCD1234'} />);

    const version = screen.getByTestId('project-version');
    expect(version).toBeInTheDocument();

    const versionText = screen.getByText(/^Version: vX\.Y\.Z \(#ABCD1234\)$/);
    expect(versionText).toBeInTheDocument();
  });

  it.each([
    undefined,
    '',
    'ABCD1234',
    'fatal: No names found, cannot describe anything.',
  ])('should render only the hash if tag is invalid: %s', (tag?: string) => {
    render(<ProjectVersion tag={tag} hash={'ABCD1234'} />);

    const version = screen.getByTestId('project-version');
    expect(version).toBeInTheDocument();

    const versionText = screen.getByText(/^Version: #ABCD1234$/);
    expect(versionText).toBeInTheDocument();
  });
});
