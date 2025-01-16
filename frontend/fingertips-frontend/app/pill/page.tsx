import React from 'react';
import { Pill } from '@/components/molecules/Pill';

/**
 * This is a dummy page that is being used to test the component
 * Should be removed once the component is needed elsewhere
 */

export default function Page() {
  return (
    <div>
      <Pill selectedFilterName="Greater Manchester ICB - OOT sub-location" />
      <Pill selectedFilterName="Dementia" />
    </div>
  );
}
