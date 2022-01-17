import React, { ChangeEvent, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fade, Popper } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

interface SearchHeaderProps {
  onSearchTextEntered: (enteredSearchText: string) => void
  shouldShowSearchTextInfoPopper: boolean
}

const debounce = (func: any, delay: number) => {
  let debounceTimer: NodeJS.Timeout
  return function () {
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(null, args), delay)
  }
}

const popperTransitionChildren = ({ TransitionProps }: any) => (
  <Fade {...TransitionProps} timeout={350}>
    <S.PopperContainer>Search is applied. Clear this to get all students</S.PopperContainer>
  </Fade>
)

export const SearchHeader: React.FC<SearchHeaderProps> = React.memo(({ onSearchTextEntered, ...props }: SearchHeaderProps) => {
  const searchBlockRef = useRef<any>(null)

  const searchTextEntered = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const enteredSearchText = event.target.value
      debounce(() => onSearchTextEntered(enteredSearchText), 500)()
    },
    [onSearchTextEntered]
  )

  return (
    <>
      <S.SearchTextField inputRef={searchBlockRef} onChange={searchTextEntered} InputProps={inputProps} placeholder="Search" variant="standard" />
      <Popper placement="top" open={props.shouldShowSearchTextInfoPopper} anchorEl={searchBlockRef.current} transition>
        {popperTransitionChildren}
      </Popper>
    </>
  )
})

const S = {
  PopperContainer: styled.div`
    padding: 0.5em;
    background-color: #383838ed;
    color: white;
    border-radius: 5px;
    margin-left: 15%;
    &::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 17%;
      width: 0;
      height: 0;
      border-top: solid 6px #383838ed;
      border-left: solid 6px transparent;
      border-right: solid 6px transparent;
    }
  `,
  SearchTextField: styled(TextField)`
    padding-bottom: 0.25rem !important;
    padding-top: 0.25rem !important;

    && div {
      &::after {
        border-bottom-color: white;
      }

      &:hover::before {
        border-bottom-color: #cececede !important;
      }

      &::before {
        border-bottom-color: #ffffff6b;
      }
    }

    && input {
      color: white;
      margin-left: 0.5rem;

      &::-webkit-input-placeholder {
        color: #dfdfdfcb;
        opacity: 1;
        font-size: 14px;
      }
    }
  `,
  SearchIcon: styled(FontAwesomeIcon)`
    cursor: pointer;
    margin-bottom: 4px;
  `,
}

const inputProps = {
  startAdornment: <S.SearchIcon icon={faSearch} color="white" />,
}
