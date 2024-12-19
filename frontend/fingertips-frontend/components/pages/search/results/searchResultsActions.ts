'use server';

import { redirect, RedirectType } from 'next/navigation';

export type SomeState = {
  indicators: string[];
};

export async function viewCharts(
  prevState: SomeState,
  formData: FormData
): Promise<SomeState> {
  const indicatorsSelected = formData.getAll('indicators')?.toString();

  redirect(`/chart?indicators=${indicatorsSelected}`, RedirectType.push);
}
