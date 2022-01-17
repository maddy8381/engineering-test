import React, { useCallback, useState } from 'react';
import { RollStateType } from 'shared/models/roll';
import {
	RollStateIcon
} from 'staff-app/components/roll-state/roll-state-icon.component';

interface RollStateSwitcherProps {
  state: RollStateType | undefined
  size?: number
  onStateChange?: (newState: RollStateType) => void
  isReadonly: boolean
}

const nextStateFor = (rollState: RollStateType) => {
  const states: RollStateType[] = ["present", "late", "absent"]
  if (rollState === "unmark" || rollState === "absent") return states[0]
  const matchingIndex = states.findIndex((s) => s === rollState)
  return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
}

export const RollStateSwitcher: React.FC<RollStateSwitcherProps> = React.memo(({ state = "unmark", size = 40, onStateChange, isReadonly }: RollStateSwitcherProps) => {
  const [rollState, setRollState] = useState<RollStateType>(state)

  if (isReadonly) {
    return <RollStateIcon type={rollState} size={20} />
  }

  const onClick = useCallback(() => {
    const next = nextStateFor(rollState)
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }, [setRollState, onStateChange, rollState])

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
})
