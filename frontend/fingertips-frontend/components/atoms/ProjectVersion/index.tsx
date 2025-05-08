import { FC } from 'react';
import { tryReadEnvVar } from '@/lib/envUtils';

export const ProjectVersion: FC = () => {
  const tag = tryReadEnvVar('FINGERTIPS_GIT_TAG');
  const hash = tryReadEnvVar('FINGERTIPS_GIT_HASH');

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
