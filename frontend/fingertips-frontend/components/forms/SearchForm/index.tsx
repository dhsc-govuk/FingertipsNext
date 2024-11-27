'use client'

import { Button, InputField } from "govuk-react"

export const SearchForm = () => {
  return (
    <form>
      <InputField
        hint={<>Type in here the IndicatorId.</>}
        data-testid='input-indicator-search'
      >
        Indicator id or keyword
      </InputField>
      <Button type="submit">
        Search
      </Button>
    </form>
  )
}
