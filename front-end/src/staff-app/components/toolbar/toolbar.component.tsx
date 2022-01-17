import React from 'react';
import { SortBasis, SortStatus } from 'shared/enums';
import { Colors } from 'shared/styles/colors';
import { BorderRadius, FontWeight, Spacing } from 'shared/styles/styles';
import styled from 'styled-components';
import Button from '@material-ui/core/ButtonBase';
import { NameHeader } from '../name-header/name-header.component';
import { SearchHeader } from '../search-header/search-header.component';

interface ToolbarProps {
  searchTextEntered: (enteredSearchText: string) => void
  sortBasis: SortBasis
  sortBasisChanged: (newSortBasis: SortBasis) => void
  sortStatus: SortStatus
  sortStatusChanged: (newSortStatus: SortStatus) => void
  shouldShowSearchTextInfoPopper: boolean
  onStartRoll: () => void
}

export const Toolbar: React.FC<ToolbarProps> = React.memo((props: ToolbarProps) => {
  return (
    <S.ToolbarContainer>
      <NameHeader sortBasis={props.sortBasis} onSortBasisChanged={props.sortBasisChanged} sortStatus={props.sortStatus} onSortStatusChanged={props.sortStatusChanged} />
      <SearchHeader onSearchTextEntered={props.searchTextEntered} shouldShowSearchTextInfoPopper={props.shouldShowSearchTextInfoPopper} />
      <S.Button onClick={props.onStartRoll}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
})

const S = {
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
