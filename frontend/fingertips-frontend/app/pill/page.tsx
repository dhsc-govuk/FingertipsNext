import { Pill } from '@/components/molecules/Pill';

export default async function Page() {
  return (
    <>
      <h1>THIS PAGE WILL BE REMOVED</h1>
      <Pill selectedFilterName="Greater Manchester - 00T" />
      <Pill selectedFilterName="Devon County ICB" />
      <Pill selectedFilterName="West Yorkshire Community Practice" />
      <Pill selectedFilterName="Dementia" />
    </>
  );
}
