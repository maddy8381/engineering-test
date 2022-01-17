import React, { useCallback, useMemo } from 'react';
import { RollStateType } from 'shared/models/roll';
import { FontWeight, Spacing } from 'shared/styles/styles';
import {
	RollStateFilter, RollStateItemType, StateListItem
} from 'shared/types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	RollStateIcon
} from 'staff-app/components/roll-state/roll-state-icon.component';

interface RollStateListProps {
  stateList: StateListItem[]
  onRollStateClick?: (rollStateItemType: RollStateItemType) => void
  size?: number
  rollStateFilter: RollStateFilter
}

type IconClickCallback = (rollStateItemType: RollStateItemType) => void

const getListItems = (stateList: StateListItem[], size: number, onClick: IconClickCallback, rollStateFilter: RollStateFilter) =>
  stateList.map((stateListItem: StateListItem, index: number) => {
    if (stateListItem.type === "all") {
      return getListItemWithFAIcon(stateListItem, index, onClick, rollStateFilter)
    }
    return getListItemWithRollStateIcon(stateListItem, index, size, onClick, rollStateFilter)
  })

const getListItemWithFAIcon = (stateListItem: StateListItem, index: number, onClick: IconClickCallback, rollStateFilter: RollStateFilter) => {
  const isActive = rollStateFilter === "all"
  return (
    <S.ListItem key={index}>
      <S.RollStateIconContainer isActive={isActive}>
        <S.AllUsersIcon icon="users" size="sm" onClick={() => onClick(stateListItem.type)} />
      </S.RollStateIconContainer>
      <span>{stateListItem.count}</span>
    </S.ListItem>
  )
}

const getListItemWithRollStateIcon = (stateListItem: StateListItem, index: number, size: number, onClick: IconClickCallback, rollStateFilter: RollStateFilter) => {
  const isActive = rollStateFilter === stateListItem.type
  return (
    <S.ListItem key={index}>
      <S.RollStateIconContainer isActive={isActive}>
        <RollStateIcon type={stateListItem.type as RollStateType} size={size} onClick={() => onClick(stateListItem.type)} />
      </S.RollStateIconContainer>
      <span>{stateListItem.count}</span>
    </S.ListItem>
  )
}

export const RollStateList: React.FC<RollStateListProps> = React.memo(({ stateList, size = 14, onRollStateClick, rollStateFilter }: RollStateListProps) => {
  const onClick = useCallback(
    (type: RollStateItemType) => {
      if (onRollStateClick) {
        onRollStateClick(type)
      }
    },
    [onRollStateClick]
  )

  const listItemsContent = useMemo(() => getListItems(stateList, size, onClick, rollStateFilter), [stateList, size, onClick, rollStateFilter])

  return <S.ListContainer>{listItemsContent}</S.ListContainer>
})

const S = {
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
  RollStateIconContainer: styled.span<{ isActive: boolean }>`
    border: ${({ isActive }) => (isActive ? "2px solid #e7e7e7" : "0")};
    border-radius: 50%;
  `,
  AllUsersIcon: styled(FontAwesomeIcon)`
    cursor: "pointer";
  `,
}
