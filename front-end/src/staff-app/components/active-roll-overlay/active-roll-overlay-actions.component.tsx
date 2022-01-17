import React from 'react';
import { Spacing } from 'shared/styles/styles';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

interface ActiveRollOverlayActionsProps {
  onExitRollActionClick: () => void
  onCompleteRollActionClick: () => void
  isRollStateSavingInProgress: boolean
}

export const ActiveRollOverlayActions: React.FC<ActiveRollOverlayActionsProps> = React.memo((props: ActiveRollOverlayActionsProps) => {
  return (
    <S.ButtonBlock>
      <Button disabled={props.isRollStateSavingInProgress} color="inherit" onClick={props.onExitRollActionClick}>
        Exit
      </Button>
      <S.CompleteButton disabled={props.isRollStateSavingInProgress} color="inherit" onClick={props.onCompleteRollActionClick}>
        Complete
      </S.CompleteButton>
    </S.ButtonBlock>
  )
})

const S = {
  ButtonBlock: styled.div`
    margin-top: ${Spacing.u6};
  `,
  CompleteButton: styled(Button)`
    margin-left: ${Spacing.u2};
  `,
}
