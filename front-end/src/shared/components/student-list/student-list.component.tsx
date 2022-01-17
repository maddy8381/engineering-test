import React, { useMemo } from "react"
import { isEmpty } from "shared/helpers/general-utils"
import { RollStateType } from "shared/models/roll"
import { StudentWithRollState } from "shared/models/student"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { LoadFailed } from "../load-failed/load-failed.component"
import { LoadingSpinner } from "../loading-spinner/loading-spinner.component"
import styled from "styled-components"

interface StudentListProps {
  studentsWithRollState: StudentWithRollState[]
  isReadonly: boolean
  isRollMode: boolean
  studentsLoadState: string
  onRollStateChange?: (studentWithRollState: StudentWithRollState, newRollState: RollStateType) => void
}

const areStudentsLoading = (studentsLoadState: string): boolean => studentsLoadState === "loading"

const spinnerContent = <LoadingSpinner />

const hasStudentsLoadFailed = (studentsLoadState: string): boolean => studentsLoadState === "error"

const loadFailureContent = <LoadFailed />

const areStudentsLoaded = (studentsLoadState: string): boolean => studentsLoadState === "loaded"

export const StudentList: React.FC<StudentListProps> = React.memo(({ studentsWithRollState, studentsLoadState, onRollStateChange, isReadonly, isRollMode }: StudentListProps) => {
  const studentListContentFrom = useMemo(() => {
    if (studentsWithRollState.length === 0) {
      return <S.EmptyDiv>No Result Found</S.EmptyDiv>
    } else
      return studentsWithRollState.map((studentWithRollState: StudentWithRollState, index: number) => (
        <StudentListTile
          onRollStateChange={onRollStateChange}
          isReadonly={isReadonly}
          key={"" + studentWithRollState.id + index}
          isRollMode={isRollMode}
          studentWithRollState={studentWithRollState}
        />
      ))
  }, [studentsWithRollState, onRollStateChange, isReadonly, isRollMode])

  const studentsContent = useMemo(() => {
    if (areStudentsLoading(studentsLoadState)) {
      return spinnerContent
    }
    if (hasStudentsLoadFailed(studentsLoadState)) {
      return loadFailureContent
    }
    if (areStudentsLoaded(studentsLoadState)) {
      return studentListContentFrom
    }
    return null
  }, [studentsLoadState, studentListContentFrom])

  if (isEmpty(studentsWithRollState)) {
    return null
  }
  return <>{studentsContent}</>
})

const S = {
  EmptyDiv: styled.div`
    margin: auto;
    margin-top: 10px;
  `,
}
