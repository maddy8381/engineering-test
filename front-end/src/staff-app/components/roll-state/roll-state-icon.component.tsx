import React, { useMemo } from 'react';
import { RollStateType } from 'shared/models/roll';
import { Colors } from 'shared/styles/colors';
import { BorderRadius } from 'shared/styles/styles';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface RollStateIconProps {
  type: RollStateType
  size?: number
  onClick?: () => void
}

const getBgColor = (type: RollStateType) => {
  switch (type) {
    case "unmark":
      return "#fff"
    case "present":
      return "#13943b"
    case "absent":
      return "#9b9b9b"
    case "late":
      return "#f5a623"
    default:
      return "#13943b"
  }
}

export const RollStateIcon: React.FC<RollStateIconProps> = React.memo(({ type, size = 20, onClick, ...props }: RollStateIconProps) => {
  const border = useMemo(() => type === "unmark", [type])
  const iconSize = useMemo(() => (size > 14 ? "lg" : "sm"), [size])
  const iconBgColor = useMemo(() => getBgColor(type), [type])
  const isClickable = useMemo(() => !!onClick, [onClick])

  return (
    <S.Icon size={size} border={border} bgColor={iconBgColor} clickable={isClickable} onClick={onClick}>
      <FontAwesomeIcon icon="check" size={iconSize} />
    </S.Icon>
  )
})

const S = {
  Icon: styled.div<{ size: number; border: boolean; bgColor: string; clickable: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: ${({ bgColor }) => bgColor};
    border: 2px solid ${({ border }) => (border ? Colors.dark.lighter : "transparent")};
    border-radius: ${BorderRadius.rounded};
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    cursor: ${({ clickable }) => (clickable ? "pointer" : undefined)};
  `,
}
