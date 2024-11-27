'use client';

import { Main } from "govuk-react";
import React from "react";

export function FTContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Main>
      {children}
    </Main>
  );
}