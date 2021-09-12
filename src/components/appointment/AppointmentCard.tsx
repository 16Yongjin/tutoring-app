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
import {
  formatDateWithSlash,
  formatTimeRange,
} from '../../utils/date/formatSchedule'
import { CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useInterval } from 'react-use'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Appointment } from '../../api/appointments/entity'
import { APIError } from '../../api/interfaces/apiError'

const { Title, Text } = Typography

const Container = styled.div`
  .card {
    border-radius: 5px;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.05), 0 1px 20px rgba(0, 0, 0, 0.05);
    padding: 1rem;
    position: relative;
  }

  .info-row {
    margin: 0.25rem 0.75rem;
  }

  .divider {
    &-y {
      border-right: 1px dashed #888;
    }

    &-x {
      border-bottom: 1px dashed #888;
    }
  }

  .heading {
    font-weight: 600;
    color: #555;
  }

  .text {
    font-weight: 700;
    font-size: 1rem;

    &.lg {
      font-size: 1.2rem;
    }

    &.primary {
      color: #feae3b;
    }
  }

  @media screen and (max-width: 768px) {
    .pa-0-tablet {
      padding: 0 !important;
    }
  }

  .barcode {
    max-height: 1.5rem;
  }

  .tip-left {
    position: absolute;
    height: 100%;
    width: 1.5rem;
    font-size: 1.2rem;
    top: 0;
    left: 0.75rem;
    writing-mode: vertical-lr;
    text-orientation: mixed;
    text-align: center;
    transform: rotate(180deg);
    color: #b1b1b1;
  }

  .tip-right {
    position: absolute;
    background-color: #feae3b;
    height: 100%;
    width: 1rem;
    top: 0;
    right: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .flight {
    position: absolute;
    top: 0.5rem;
    right: 5.5rem;
    height: 3rem;
    width: 6rem;
  }

  .korea {
    position: absolute;
    top: 0.5rem;
    right: 2rem;
    font-style: italic;
    font-weight: 600;
    font-stretch: condensed;
    color: #474d50;
  }

  .stamp {
    position: absolute;
    top: 1.5rem;
    right: 0;
    width: 6rem;
  }
`

export const EmptyAppointmentCard = () => {
  return (
    <Card>
      <Row className="center">
        <Text>No Appointment..</Text>
      </Row>
      <Row className="center mt-4">
        <Link to="/tutors">
          <Button type="primary" shape="round">
            Make Appointment
          </Button>
        </Link>
      </Row>
    </Card>
  )
}

export const AppointmentCard = ({
  appointment,
  onReviewTutor,
}: {
  appointment: Appointment
  onReviewTutor?: Function
}) => {
  const queryClient = useQueryClient()

  const cancelAppointment = async () => {
    if (!appointment) return

    try {
      await api.appointments.removeAppointment({
        appointmentId: appointment.id,
      })
    } catch (e) {
      notification.error({
        message: (e as APIError).message,
        duration: 5,
      })
    }

    queryClient.invalidateQueries('appointments/upcoming')
    queryClient.invalidateQueries('appointments/me')
    queryClient.invalidateQueries(`tutor/${appointment.tutor.id}/schedules`)
  }

  /** 타이머 로직, 수업 시작 시 멈춤 */
  const [timeLeft, setTimeLeft] = useState('')
  const [stopTimer, setStopTimer] = useState(false)
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

  return (
    <Container>
      <Card className="card" bodyStyle={{ padding: '0' }}>
        <Row>
          <Col
            xs={24}
            md={8}
            className="divider-y flex-col pr-4 pl-6 pa-0-tablet"
          >
            <div className="">
              <div className="center">
                <div
                  className="cover-image"
                  style={{ backgroundImage: `url(${appointment.tutor.image})` }}
                ></div>
              </div>
              <Title
                className="center"
                level={4}
                style={{ marginBottom: 0, marginTop: '0.5rem' }}
              >
                {appointment.tutor.fullname}
              </Title>
            </div>

            <div className="spacer" />
            <div className="is-hidden-tablet">
              <img className="barcode" src="barcode.svg" alt="barcode"></img>
            </div>
          </Col>

          <Col xs={23} md={15}>
            <div className="info-row">
              <div className="heading">TIME</div>
              <div className="text lg">{formatTimeRange(appointment)}</div>
            </div>
            <div className="divider-x" />
            <div className="info-row">
              <div className="heading">DATE</div>
              <div className="text lg primary">
                {formatDateWithSlash(appointment.startTime)}
              </div>
            </div>
            <div className="divider-x" />
            <div className="info-row">
              <div className="heading">MATERIAL</div>
              <div className="text">{appointment.material}</div>
            </div>
            <div className="divider-x" />
            <div className="info-row">
              <div className="heading">REQUESET</div>
              <div className="text">{appointment.request || '-'}</div>
            </div>
            <div className="divider-x" />

            {timeLeft && (
              <Row className="mt-4 ml-2">
                <Col xs={24} className="center">
                  Starts in
                </Col>
                <Col xs={24} className="center">
                  <Title level={2}>{timeLeft}</Title>
                </Col>
              </Row>
            )}

            <div className="actions">
              {!appointment.finished && (
                <Row className="mt-3 ml-4" justify="space-between">
                  <Col>
                    {appointment.cancelable && (
                      <Popconfirm
                        title="Are you sure to cancel this appointment?"
                        onConfirm={cancelAppointment}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button shape="round">
                          <CloseOutlined /> Cancel
                        </Button>
                      </Popconfirm>
                    )}
                  </Col>
                  <Col>
                    <Link to={`/appointments/${appointment.id}`}>
                      <Button type="primary" shape="round">
                        Enter
                      </Button>
                    </Link>
                  </Col>
                </Row>
              )}

              {appointment.feedback && (
                <>
                  <Row className="mt-1 ml-1 mb-1" gutter={[24, 24]}>
                    <Col>
                      <div className="heading">Feedback</div>
                      <div className="text">{appointment.feedback.text}</div>
                    </Col>
                  </Row>
                  <div className="divider-x" />
                  <img className="stamp" src="stamp.png" alt="stamp" />
                </>
              )}

              {appointment.finished && !appointment.tutor?.reviews?.length && (
                <Row className="mt-3 ml-2" justify="end">
                  <Col>
                    <Button
                      onClick={() => onReviewTutor?.(appointment)}
                      shape="round"
                    >
                      Review Tutor
                    </Button>
                  </Col>
                </Row>
              )}
            </div>
          </Col>
        </Row>

        <div className="tip-left is-hidden-tablet">BOARDING PASS</div>
        <div className="tip-right"></div>
        <div className="flight is-hidden-tablet">
          <img className="flight-img" src="flight.svg" alt="flight" />
        </div>
        <div className="korea is-hidden-tablet">KOREA</div>
      </Card>
    </Container>
  )
}
