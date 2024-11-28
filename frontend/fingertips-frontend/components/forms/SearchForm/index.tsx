'use client'

import { searchIndicator, State } from "@/lib/actions/searchActions";
import { Button, InputField } from "govuk-react"
import { useActionState } from "react";

export const SearchForm = () => {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(searchIndicator, initialState);
  
  return (
    <form action={formAction}>
      <InputField
        id='indicator1'
        input={{
          id: 'indicator',
          name: 'indicator'
        }}
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
