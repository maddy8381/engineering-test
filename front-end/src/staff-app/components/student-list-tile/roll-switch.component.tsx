import React, { useCallback } from 'react';
import { RollStateType } from 'shared/models/roll';
import { StudentWithRollState } from 'shared/models/student';
import { Spacing } from 'shared/styles/styles';
import styled from 'styled-components';
import {
	RollStateSwitcher
} from 'staff-app/components/roll-state/roll-state-switcher.component';

interface RollSwitchProps {
  isRollMode: boolean
  isReadonly: boolean
  studentWithRollState: StudentWithRollState
  onRollStateChange: (newRollState: RollStateType) => void
}

const shouldShowRollSwitch = (isRollMode: boolean, isReadonly: boolean) => !(isRollMode || isReadonly)

export const RollSwitch: React.FC<RollSwitchProps> = React.memo(({ isRollMode, isReadonly, onRollStateChange, ...props }: RollSwitchProps) => {
  if (shouldShowRollSwitch(isRollMode, isReadonly)) {
    return null
  }

  const stateChanged = useCallback(
    (newRollState: RollStateType) => {
      if (isReadonly) {
        return
      }
      onRollStateChange(newRollState)
    },
    [isReadonly, onRollStateChange]
  )

  return (
    <S.Roll>
      <RollStateSwitcher isReadonly={isReadonly} state={props.studentWithRollState.rollState} onStateChange={stateChanged} />
    </S.Roll>
  )
})

const S = {
  Roll: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u4};
  `,
}
