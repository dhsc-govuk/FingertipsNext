import { FC } from 'react';

interface ProjectVersionProps {
  tag?: string;
  hash?: string;
}

export const ProjectVersion: FC<ProjectVersionProps> = ({ tag, hash }) => {
  if (!hash) return null;

  const isValidTag =
    tag &&
    tag !== 'undefined' &&
    tag.length &&
    !tag.includes('fatal') &&
    !hash.startsWith(tag);

  const content = isValidTag
    ? `Version: ${tag} (#${hash})`
    : `Version: #${hash}`;

  return <pre data-testid={'project-version'}>{content}</pre>;
};
