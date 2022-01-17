import React, { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useApi } from "shared/hooks/use-api"
import styled from "styled-components"
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar"
import { StudentsContext, StudentsContextType } from "shared/context/students-context"
import { SortBasis, SortStatus } from "shared/enums"
import { StudentList } from "shared/components/student-list/student-list.component"
import { ActiveRollOverlay } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { Toolbar } from "../components/toolbar/toolbar.component"
import { isEmpty } from "shared/helpers/general-utils"
import { RollInput, RollStateType } from "shared/models/roll"
import { Student, StudentWithRollState } from "shared/models/student"
import { Spacing } from "shared/styles/styles"

const snackbarOrigin = { vertical: "bottom", horizontal: "right" } as SnackbarOrigin

const getFilteredStudentsBySearchedText = (studentsWithRollState: StudentWithRollState[], searchedText: string) =>
  studentsWithRollState.filter((studentWithRollState: StudentWithRollState) => {
    if (isMatch(studentWithRollState.first_name, searchedText)) {
      return true
    }
    if (isMatch(studentWithRollState.last_name, searchedText)) {
      return true
    }
    return false
  })

const isMatch = (name: string, searchedText: string) => {
  const lowercasedAndTrimmedName = name.toLowerCase().trim()
  const lowercasedAndTrimmedSearchedText = searchedText.toLowerCase().trim()
  return lowercasedAndTrimmedName.indexOf(lowercasedAndTrimmedSearchedText) !== -1
}

const getSortedStudentsBySortBasisAndSortStatus = (studentsWithRollState: StudentWithRollState[], sortBasis: SortBasis, sortStatus: SortStatus) => {
  const comparator = buildComparatorBy(sortBasis, sortStatus)
  return studentsWithRollState.sort(comparator)
}

const buildComparatorBy = (sortBasis: SortBasis, sortStatus: SortStatus) => {
  const fieldForSortComparison = getFieldFor(sortBasis)
  return (studentWithRollStateOne: StudentWithRollState, studentWithRollStateTwo: StudentWithRollState) => {
    if (sortStatus === SortStatus.ASCENDING) {
      if (studentWithRollStateOne[fieldForSortComparison].localeCompare(studentWithRollStateTwo[fieldForSortComparison]) === 1) {
        return 1
      }
      if (studentWithRollStateOne[fieldForSortComparison].localeCompare(studentWithRollStateTwo[fieldForSortComparison]) === -1) {
        return -1
      }
    }
    if (sortStatus === SortStatus.DESCENDING) {
      if (studentWithRollStateOne[fieldForSortComparison].localeCompare(studentWithRollStateTwo[fieldForSortComparison]) === 1) {
        return -1
      }
      if (studentWithRollStateOne[fieldForSortComparison].localeCompare(studentWithRollStateTwo[fieldForSortComparison]) === -1) {
        return 1
      }
    }
    return 0
  }
}

const getFieldFor = (sortBasis: SortBasis) => {
  if (sortBasis === SortBasis.FIRST_NAME) {
    return "first_name"
  } else {
    return "last_name"
  }
}

const getFilteredStudentsByRollStateFilter = (students: StudentWithRollState[], rollStateFilter: RollStateFilter) => {
  if (rollStateFilter === "all") {
    return [...students]
  }
  return students.filter((student: StudentWithRollState) => student.rollState === rollStateFilter)
}

const buildStudentsRollInputFrom = (students: StudentWithRollState[]): RollInput => {
  const student_roll_states = students.map((student: StudentWithRollState) => ({
    student_id: student.id,
    roll_state: (student.rollState || "unmarked") as RollStateType,
  }))
  return { student_roll_states } as RollInput
}

export const HomeBoardPage: React.FC = React.memo(() => {
  const [isRollMode, setIsRollMode] = useState<boolean>(false)
  const [displayedStudents, setDisplayedStudents] = useState<StudentWithRollState[]>([])
  const { students, studentsLoadState } = useContext<StudentsContextType>(StudentsContext)
  const [searchedText, setSearchedText] = useState<string>("")
  const [studentsWithRollState, setStudentsWithRollState] = useState<StudentWithRollState[]>([])
  const [sortBasis, setSortBasis] = useState<SortBasis>(SortBasis.FIRST_NAME)
  const [sortStatus, setSortStatus] = useState<SortStatus>(SortStatus.NONE)
  const [rollStateFilter, setRollStateFilter] = useState<RollStateFilter>(null)
  const [shouldShowSearchTextInfoPopper, setShouldShowSearchTextInfoPopper] = useState<boolean>(false)
  const navigate = useNavigate()
  const saveRollApi = useApi({ url: "save-roll" })

  useEffect(() => {
    if (saveRollApi[2] === "loaded") {
      setIsRollMode(false)
      navigate("/staff/activity")
    }
  }, [saveRollApi, setIsRollMode, navigate])

  const isRollStateSavingInProgress = saveRollApi[2] === "loading"

  useEffect(() => {
    let updatedDisplayedStudents = getFilteredStudentsBySearchedText(studentsWithRollState, searchedText)
    if (sortStatus !== SortStatus.NONE) {
      updatedDisplayedStudents = getSortedStudentsBySortBasisAndSortStatus(updatedDisplayedStudents, sortBasis, sortStatus)
    }
    if (!isEmpty(rollStateFilter)) {
      updatedDisplayedStudents = getFilteredStudentsByRollStateFilter(updatedDisplayedStudents, rollStateFilter!)
    }
    setDisplayedStudents(updatedDisplayedStudents)
  }, [studentsWithRollState, searchedText, sortBasis, sortStatus, rollStateFilter])

  useEffect(() => {
    const studentsWithRollState = students.map(
      (student: Student) =>
        ({
          ...student,
          rollState: "unmark",
        } as StudentWithRollState)
    )
    setStudentsWithRollState(studentsWithRollState)
  }, [students])

  const startRoll = useCallback(() => {
    setIsRollMode(true)
  }, [setIsRollMode])

  const exitRollActionClicked = useCallback(() => {
    setIsRollMode(false)
  }, [setIsRollMode])

  const completeRollActionClicked = useCallback(() => {
    const studentsRollInput = buildStudentsRollInputFrom(studentsWithRollState)
    saveRollApi[0](studentsRollInput)
  }, [saveRollApi, studentsWithRollState])

  const rollStateChanged = useCallback(
    (studentWithRollState: StudentWithRollState, newRollState: RollStateType) => {
      const updatedStudents = studentsWithRollState.map((currentStudent: StudentWithRollState) => {
        if (currentStudent.id === studentWithRollState.id) {
          return { ...currentStudent, rollState: newRollState }
        }
        return { ...currentStudent }
      })
      setStudentsWithRollState(updatedStudents)
    },
    [setStudentsWithRollState, studentsWithRollState]
  )

  const searchTextEntered = useCallback(
    (searchedText: string) => {
      setSearchedText(searchedText)
    },
    [setSearchedText]
  )

  const sortBasisChanged = useCallback(
    (newSortBasis: SortBasis) => {
      setSortBasis(newSortBasis)
    },
    [setSortBasis]
  )

  const sortStatusChanged = useCallback(
    (newSortStatus: SortStatus) => {
      setSortStatus(newSortStatus)
    },
    [setSortStatus]
  )

  const showSearchTextInfoPopper = useCallback(() => {
    setShouldShowSearchTextInfoPopper(true)
    const timeoutRef = setTimeout(() => {
      setShouldShowSearchTextInfoPopper(false)
      clearTimeout(timeoutRef)
    }, 2000)
  }, [setShouldShowSearchTextInfoPopper])

  const rollStateClicked = useCallback(
    (value: RollStateItemType) => {
      if (rollStateFilter === value) {
        setRollStateFilter(null)
        return
      }
      setRollStateFilter(value)
      if (!searchedText) {
        return
      }
      showSearchTextInfoPopper()
    },
    [setRollStateFilter, rollStateFilter, searchedText, showSearchTextInfoPopper]
  )

  return (
    <>
      <S.PageContainer>
        <Toolbar
          shouldShowSearchTextInfoPopper={shouldShowSearchTextInfoPopper}
          sortStatus={sortStatus}
          sortStatusChanged={sortStatusChanged}
          sortBasis={sortBasis}
          sortBasisChanged={sortBasisChanged}
          onStartRoll={startRoll}
          searchTextEntered={searchTextEntered}
        />
        <StudentList
          studentsLoadState={studentsLoadState}
          studentsWithRollState={displayedStudents}
          isReadonly={false}
          isRollMode={isRollMode}
          onRollStateChange={rollStateChanged}
        />
      </S.PageContainer>
      <ActiveRollOverlay
        studentsWithRollState={studentsWithRollState}
        rollStateFilter={rollStateFilter}
        onRollStateClick={rollStateClicked}
        isActive={isRollMode}
        onExitRollActionClick={exitRollActionClicked}
        onCompleteRollActionClick={completeRollActionClicked}
        isRollStateSavingInProgress={isRollStateSavingInProgress}
      />
      <Snackbar anchorOrigin={snackbarOrigin} open={isRollStateSavingInProgress} message="Saving..." />
    </>
  )
})

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
}
