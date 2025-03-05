'use client';

import React from 'react';
import { Table } from 'govuk-react';
import styled from "styled-components"
import { typography } from '@govuk-react/lib';



export const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 14 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

export const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
    textAlign: 'left',
    verticalAlign: 'top',
  });


export const StyledAlignRightHeader = styled(StyledTableCellHeader)({
    textAlign: 'right',
    paddingRight: '10px',
    verticalAlign: 'top',
  });