import React, { useCallback, useMemo, useState } from "react"
import { SortBasis, SortStatus } from "shared/enums"
import styled from "styled-components"
import { faCog, faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Popover, PopoverOrigin, Tooltip, Button } from "@material-ui/core"
import { NameSortSettings } from "../name-sort-settings/name-sort-settings.component"

interface NameHeaderProps {
  sortBasis: SortBasis
  onSortBasisChanged: (newSortBasis: SortBasis) => void
  sortStatus: SortStatus
  onSortStatusChanged: (newSortStatus: SortStatus) => void
}

const nameColumnSettingsAnchorOrigin = {
  vertical: "bottom",
  horizontal: "center",
} as PopoverOrigin

const nameColumnSettingsTransformOrigin = {
  vertical: "top",
  horizontal: "center",
} as PopoverOrigin

export const NameHeader: React.FC<NameHeaderProps> = React.memo(({ sortStatus, onSortStatusChanged, ...props }: NameHeaderProps) => {
  const [sortSettingsPopoverAnchorElement, setSortSettingsPopoverAnchorElement] = useState<HTMLDivElement | null>(null)

  const onNameColumnSettingClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => setSortSettingsPopoverAnchorElement(event.currentTarget),
    [setSortSettingsPopoverAnchorElement]
  )

  const closeSortSettingsPopover = useCallback(() => setSortSettingsPopoverAnchorElement(null), [setSortSettingsPopoverAnchorElement])

  const toggleSort = useCallback(() => {
    if (sortStatus === SortStatus.ASCENDING) {
      onSortStatusChanged(SortStatus.DESCENDING)
      return
    }
    onSortStatusChanged(SortStatus.ASCENDING)
  }, [sortStatus, onSortStatusChanged])

  const sortStatusIcon = useMemo(() => {
    if (sortStatus === SortStatus.ASCENDING) {
      return faSortUp
    }
    if (sortStatus === SortStatus.DESCENDING) {
      return faSortDown
    }
    return faSort
  }, [sortStatus])

  return (
    <>
      <S.NameBlock>
        <S.NameLabelBlock onClick={toggleSort}>
          <Button variant="contained" size="small">
            Name
            <S.IconBlock>
              <FontAwesomeIcon icon={sortStatusIcon} />
            </S.IconBlock>
          </Button>
        </S.NameLabelBlock>
        <S.SettingIconBlock>
          <Tooltip title="Update sort settings" placement="top">
            <span onClick={onNameColumnSettingClick}>
              <FontAwesomeIcon icon={faCog} color="white" />
            </span>
          </Tooltip>
        </S.SettingIconBlock>
      </S.NameBlock>
      <Popover
        open={!!sortSettingsPopoverAnchorElement}
        anchorEl={sortSettingsPopoverAnchorElement}
        onClose={closeSortSettingsPopover}
        anchorOrigin={nameColumnSettingsAnchorOrigin}
        transformOrigin={nameColumnSettingsTransformOrigin}
      >
        <NameSortSettings sortBasis={props.sortBasis} sortBasisChange={props.onSortBasisChanged} />
      </Popover>
    </>
  )
})

const S = {
  NameBlock: styled.div`
    display: flex;
    gap: 0.5rem;
    cursor: pointer;
  `,
  NameLabelBlock: styled.span`
    display: flex;
    gap: 0.5rem;
    cursor: pointer;
  `,
  IconBlock: styled.span`
    display: flex;
    margin-left: 5px;
    cursor: pointer;
  `,
  SettingIconBlock: styled.span`
    display: flex;
    margin-top: 5px;
    cursor: pointer;
  `,
}
