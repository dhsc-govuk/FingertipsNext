"use client"

import { Table } from "govuk-react";

interface PyramidTableProps {
  headers: string[];
  renderHeader?: (header: string) => React.ReactNode | string
}



export const PyramidTable = ({ headers, renderHeader }: PyramidTableProps) => {
  return (
    <Table head={
      <Table.Row>
        {headers.map((header) => {
          return (
            <Table.CellHeader key={header}>
              {
                renderHeader ? renderHeader(header) : header
              }
            </Table.CellHeader>
          )
        })
        }
      </Table.Row>
    }>

    </Table>
  )

};
