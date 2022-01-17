import { Images } from 'assets/images';
import React, { useCallback, useMemo } from 'react';
import { RollStateType } from 'shared/models/roll';
import { StudentHelper, StudentWithRollState } from 'shared/models/student';
import { Colors } from 'shared/styles/colors';
import { BorderRadius, FontWeight, Spacing } from 'shared/styles/styles';
import styled from 'styled-components';
import { RollSwitch } from './roll-switch.component';

interface StudentListTileProps {
  isRollMode: boolean
  studentWithRollState: StudentWithRollState
  isReadonly: boolean
  onRollStateChange?: (studentWithRollState: StudentWithRollState, newRollState: RollStateType) => void
}

export const StudentListTile: React.FC<StudentListTileProps> = React.memo(({ studentWithRollState, onRollStateChange, ...props }: StudentListTileProps) => {
  const fullName = useMemo(() => StudentHelper.getFullName(studentWithRollState), [studentWithRollState])

  const rollStateChanged = useCallback(
    (newRollState: RollStateType) => {
      if (onRollStateChange) {
        onRollStateChange(studentWithRollState, newRollState)
      }
    },
    [onRollStateChange, studentWithRollState]
  )

  return (
    <S.Container>
      <S.Avatar url={Images.avatar}></S.Avatar>
      <S.Content>
        <div>{fullName}</div>
      </S.Content>
      <RollSwitch onRollStateChange={rollStateChanged} isReadonly={props.isReadonly} isRollMode={props.isRollMode} studentWithRollState={studentWithRollState} />
    </S.Container>
  )
})

const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    height: 60px;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  Avatar: styled.div<{ url: string }>`
    width: 60px;
    background-image: url(${({ url }) => url});
    border-top-left-radius: ${BorderRadius.default};
    border-bottom-left-radius: ${BorderRadius.default};
    background-size: cover;
    background-position: 50%;
    align-self: stretch;
  `,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
}
