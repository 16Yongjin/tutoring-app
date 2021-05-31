import {
  Button,
  Card,
  Col,
  notification,
  Popconfirm,
  Row,
  Typography,
} from 'antd'
import styled from 'styled-components'
import { useQueryClient } from 'react-query'
import * as api from '../../api'
import { formatSchedule, formatDate } from '../../utils/date/formatSchedule'
import { CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useInterval } from 'react-use'
import { useContext, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Appointment } from '../../api/appointments/entity'
import { SocketContext } from '../../socket/SocketContext'

const { Title, Text } = Typography

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
  const opponentEntered = useMemo(
    () => !!((isTutor && user) || (!isTutor && tutor)),
    [isTutor, user, tutor]
  )

  const updateProgressTime = () => {
    const secondSinceStarted = dayjs().diff(dayjs(appointment.startTime))
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
          <Row className="center-y" justify="space-between">
            <Col>{appointment.tutor.fullname}</Col>
            <Col>
              <Row className="center-y">
                <Col>Starts at {formatDate(appointment.startTime)}</Col>
                <Col>
                  <Link to="/">
                    <Button type="primary" danger shape="round">
                      Exit
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {state === AppointmentState.StartInOneHour && (
          <Row className="center-y" justify="space-between">
            <Col>{appointment.tutor.fullname}</Col>
            <Col>
              <Row className="center-y">
                <Col className="mr-2">Starts in {timeLeft}</Col>
                <Col>
                  {!stream ? (
                    <Button type="primary" shape="round">
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
                      loading={waitingUser || userReady}
                      onClick={() => {
                        getReady({
                          roomId: appointment.id.toString(),
                          isTutor,
                        })
                      }}
                    >
                      Ready
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {state === AppointmentState.Started && (
          <Row className="center-y" justify="space-between">
            <Col>
              {isTutor ? appointment.user.fullname : appointment.tutor.fullname}
            </Col>
            <Col>
              <Row className="center-y">
                <Col className="mr-4">{progressTime}</Col>
                <Col>
                  {!stream ? (
                    <Button
                      type="primary"
                      shape="round"
                      onClick={() => startMedia()}
                    >
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
                      loading={waitingUser || userReady}
                      onClick={() => {
                        getReady({
                          roomId: appointment.id.toString(),
                          isTutor,
                        })
                      }}
                    >
                      Ready
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {state === AppointmentState.InProgress && (
          <Row className="center-y" justify="space-between">
            <Col>{appointment.tutor.fullname}</Col>
            <Col>
              <Row className="center-y">
                <Col className="mr-4">{progressTime}</Col>
                <Col>
                  <Button danger shape="round" onClick={leaveCall}>
                    End
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {state === AppointmentState.Overrun && (
          <Row className="center-y" justify="space-between">
            <Col>{appointment.tutor.fullname}</Col>
            <Col>
              <Row className="center-y">
                <Col className="mr-4">{progressTime}</Col>
                <Col>
                  <Button
                    type="primary"
                    danger
                    shape="round"
                    onClick={leaveCall}
                  >
                    End
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )}

        {state === AppointmentState.Ended && (
          <Row className="center-y" justify="space-between">
            <Col>Ended Appointment</Col>
            <Col>
              <Link to="/">
                <Button type="primary" danger shape="round">
                  Exit
                </Button>
              </Link>
            </Col>
          </Row>
        )}

        <Row>
          <Col></Col>
        </Row>
      </Card>
    </Container>
  )
}
