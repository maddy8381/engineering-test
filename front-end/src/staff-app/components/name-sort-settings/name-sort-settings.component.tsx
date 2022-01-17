import React, { ChangeEvent, useCallback } from "react"
import { SortBasis } from "shared/enums"
import styled from "styled-components"
import FormControl from "@material-ui/core/FormControl"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormLabel from "@material-ui/core/FormLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"

interface NameSortSettingsProps {
  sortBasisChange: (newSortBasis: SortBasis) => void
  sortBasis: SortBasis
}

export const NameSortSettings: React.FC<NameSortSettingsProps> = React.memo(({ sortBasisChange, ...props }: NameSortSettingsProps) => {
  const onSortBasisSelected = useCallback((event: ChangeEvent<HTMLInputElement>) => sortBasisChange(event.target.value as SortBasis), [sortBasisChange])

  return (
    <S.NameSortSettingsContainer>
      <FormControl component="fieldset">
        <FormLabel component="legend">Sort by ?</FormLabel>
        <RadioGroup name="sortBasis" value={props.sortBasis} onChange={onSortBasisSelected}>
          <FormControlLabel value={SortBasis.FIRST_NAME} control={<Radio />} label="First Name" />
          <FormControlLabel value={SortBasis.LAST_NAME} control={<Radio />} label="Last Name" />
        </RadioGroup>
      </FormControl>
    </S.NameSortSettingsContainer>
  )
})

const S = {
  NameSortSettingsContainer: styled.div`
    padding: 1rem;
  `,
}
