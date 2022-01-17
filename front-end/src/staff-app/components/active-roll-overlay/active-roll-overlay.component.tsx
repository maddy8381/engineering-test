import React, { useEffect, useState } from 'react';
import { StudentWithRollState } from 'shared/models/student';
import { BorderRadius, Spacing } from 'shared/styles/styles';
import {
	RollStateFilter, RollStateItemType, StateListItem
} from 'shared/types';
import styled from 'styled-components';
import {
	RollStateList
} from 'staff-app/components/roll-state/roll-state-list.component';
import {
	ActiveRollOverlayActions
} from './active-roll-overlay-actions.component';

interface ActiveRollOverlayProps {
  isActive: boolean
  onRollStateClick: (value: RollStateItemType) => void
  onExitRollActionClick: () => void
  onCompleteRollActionClick: () => void
  rollStateFilter: RollStateFilter
  isRollStateSavingInProgress: boolean
  studentsWithRollState: StudentWithRollState[]
}

const getPopulateRollStateList = (students: StudentWithRollState[]): StateListItem[] => {
  const newRollStateList: StateListItem[] = []
  newRollStateList.push({ type: "all", count: students.length })
  const presentStudents = students.filter((student: StudentWithRollState) => student.rollState === "present")
  newRollStateList.push({ type: "present", count: presentStudents.length })
  const lateStudents = students.filter((student: StudentWithRollState) => student.rollState === "late")
  newRollStateList.push({ type: "late", count: lateStudents.length })
  const absentStudents = students.filter((student: StudentWithRollState) => student.rollState === "absent")
  newRollStateList.push({ type: "absent", count: absentStudents.length })
  return newRollStateList
}

const initialRollStateList: StateListItem[] = [
  { type: "all", count: 0 },
  { type: "present", count: 0 },
  { type: "late", count: 0 },
  { type: "absent", count: 0 },
]

export const ActiveRollOverlay: React.FC<ActiveRollOverlayProps> = React.memo(({ studentsWithRollState, ...props }: ActiveRollOverlayProps) => {
  const [rollStateList, setRollStateList] = useState(initialRollStateList)

  useEffect(() => {
    const newRollStateList = getPopulateRollStateList(studentsWithRollState)
    setRollStateList(newRollStateList)
  }, [studentsWithRollState, setRollStateList])

  return (
    <S.Overlay isActive={props.isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList rollStateFilter={props.rollStateFilter} onRollStateClick={props.onRollStateClick} stateList={rollStateList} />
          <ActiveRollOverlayActions
            isRollStateSavingInProgress={props.isRollStateSavingInProgress}
            onExitRollActionClick={props.onExitRollActionClick}
            onCompleteRollActionClick={props.onCompleteRollActionClick}
          />
        </div>
      </S.Content>
    </S.Overlay>
  )
})

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
