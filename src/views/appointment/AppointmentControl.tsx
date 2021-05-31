import { Button, Card, Col, Row } from 'antd'
import styled from 'styled-components'
import { formatDate } from '../../utils/date/formatSchedule'
import { Link } from 'react-router-dom'
import { useInterval } from 'react-use'
import { CSSProperties, useContext, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Appointment } from '../../api/appointments/entity'
import { SocketContext } from '../../socket/SocketContext'

const Container = styled.div`
  height: 100%;
  .card {
    height: 100%;
    padding: 0.5rem;
  }

  .info {
    font-size: 0.75rem;
  }
`

enum AppointmentState {
  NotStarted,
  StartInOneHour,
  Started,
  InProgress,
  Overrun,
  Ended,
}

const ControlContainer: React.FC<{
  name: string
  time: string
  timeStyle?: CSSProperties
}> = ({ name, time, timeStyle, children }) => {
  return (
    <Row className="center-y" justify="space-between">
      <Col>{name}</Col>
      <Col>
        <Row className="center-y">
          <Col className="mr-2" style={timeStyle}>
            {time}
          </Col>
          <Col>{children}</Col>
        </Row>
      </Col>
    </Row>
  )
}

const ReadyButton = ({
  stream,
  opponentEntered,
  isTutor,
  isLoading,
  getReady,
  startMedia,
  roomId,
}: {
  stream?: MediaStream
  opponentEntered: boolean
  isTutor: boolean
  isLoading: boolean
  getReady: Function
  startMedia: Function
  roomId: string
}) =>
  !stream ? (
    <Button type="primary" shape="round" onClick={() => startMedia()}>
      Allow Media
    </Button>
  ) : !opponentEntered ? (
    <Button disabled shape="round">
      Waiting {isTutor ? 'User' : 'Tutor'}
    </Button>
  ) : (
    <Button
      type="primary"
      shape="round"
      loading={isLoading}
      onClick={() => getReady({ roomId, isTutor })}
    >
      Ready
    </Button>
  )

export const AppointmentControl = ({
  appointment,
  isTutor,
}: {
  appointment: Appointment
  isTutor: boolean
}) => {
  const {
    callInProgress,
    user,
    tutor,
    waitingUser,
    getReady,
    userReady,
    leaveCall,
    stream,
    startMedia,
  } = useContext(SocketContext)
  /** 타이머 로직, 수업 시작 시 멈춤 */
  const [timeLeft, setTimeLeft] = useState('')
  const [stopTimer, setStopTimer] = useState(false)
  const [state, setState] = useState(AppointmentState.NotStarted)
  const [progressTime, setProgressTime] = useState('')
  const opponentName = useMemo(
    () => (isTutor ? appointment.user.fullname : appointment.tutor.fullname),
    [isTutor, appointment]
  )
  const opponentEntered = useMemo(
    () => !!((isTutor && user) || (!isTutor && tutor)),
    [isTutor, user, tutor]
  )

  const updateProgressTime = () => {
    const secondSinceStarted = dayjs().diff(dayjs(appointment.startTime))
    if (secondSinceStarted < 0) return

    setProgressTime(new Date(secondSinceStarted).toISOString().substr(14, 5))
  }

  const updateState = () => {
    const ended = dayjs(appointment.endTime).isBefore(dayjs())
    const secondLeftToStart = dayjs(appointment.startTime).diff(dayjs())
    const isStarted = secondLeftToStart <= 0
    const startInAnHour = secondLeftToStart <= 60 * 60 * 1000

    if (ended)
      return setState(
        callInProgress ? AppointmentState.Overrun : AppointmentState.Ended
      )
    if (callInProgress) return setState(AppointmentState.InProgress)
    if (isStarted) return setState(AppointmentState.Started)
    if (startInAnHour) return setState(AppointmentState.StartInOneHour)
    if (!startInAnHour) return setState(AppointmentState.NotStarted)
  }

  const updateTimeLeft = () => {
    const seconds = dayjs(appointment.startTime).diff(dayjs())
    const isStarted = seconds <= 0
    const startInAnHour = seconds <= 60 * 60 * 1000
    const timeLeft =
      !isStarted && startInAnHour
        ? new Date(seconds).toISOString().substr(14, 5)
        : ''
    setStopTimer(isStarted)
    setTimeLeft(timeLeft)
  }

  useInterval(updateTimeLeft, !stopTimer ? 1000 : null)
  useEffect(() => updateTimeLeft(), [])
  useInterval(updateState, 1000)
  useEffect(() => updateState(), [])
  useInterval(updateProgressTime, 1000)
  useEffect(() => updateProgressTime(), [])

  return (
    <Container>
      <Card className="card" bodyStyle={{ padding: 0 }}>
        {state === AppointmentState.NotStarted && (
          <ControlContainer
            name={opponentName}
            time={`Starts at ${formatDate(appointment.startTime)}`}
          >
            <Link to="/">
              <Button type="primary" danger shape="round">
                Exit
              </Button>
            </Link>
          </ControlContainer>
        )}

        {state === AppointmentState.StartInOneHour && (
          <ControlContainer name={opponentName} time={`Starts in ${timeLeft}`}>
            <ReadyButton
              stream={stream}
              getReady={getReady}
              startMedia={startMedia}
              isLoading={waitingUser || userReady}
              isTutor={isTutor}
              opponentEntered={opponentEntered}
              roomId={appointment.id.toString()}
            />
          </ControlContainer>
        )}

        {state === AppointmentState.Started && (
          <ControlContainer name={opponentName} time={progressTime}>
            <ReadyButton
              stream={stream}
              getReady={getReady}
              startMedia={startMedia}
              isLoading={waitingUser || userReady}
              isTutor={isTutor}
              opponentEntered={opponentEntered}
              roomId={appointment.id.toString()}
            />
          </ControlContainer>
        )}

        {state === AppointmentState.InProgress && (
          <ControlContainer
            name={opponentName}
            time={timeLeft ? `Starts in ${timeLeft}` : progressTime}
          >
            <Button danger shape="round" onClick={leaveCall}>
              End
            </Button>
          </ControlContainer>
        )}

        {state === AppointmentState.Overrun && (
          <ControlContainer
            name={opponentName}
            time={progressTime}
            timeStyle={{ color: 'red' }}
          >
            <Button type="primary" danger shape="round" onClick={leaveCall}>
              End
            </Button>
          </ControlContainer>
        )}

        {state === AppointmentState.Ended && (
          <ControlContainer name="Ended Appointment" time={progressTime}>
            <Link to="/">
              <Button type="primary" danger shape="round">
                Exit
              </Button>
            </Link>
          </ControlContainer>
        )}

        <Row>
          <Col></Col>
        </Row>
      </Card>
    </Container>
  )
}
