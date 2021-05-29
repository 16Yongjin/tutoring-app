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
import { formatSchedule } from '../../utils/date/formatSchedule'
import { CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useInterval } from 'react-use'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Appointment } from '../../api/appointments/entity'

const { Title, Text } = Typography

const Container = styled.div`
  .row {
    margin-top: 1rem;
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
        message: e.message,
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
      <Card>
        <Row justify="space-between">
          <Col>
            <Title level={5}>{appointment.tutor.fullname}</Title>
          </Col>
          <Col>
            <Title level={5}>{formatSchedule(appointment)}</Title>
          </Col>
        </Row>
        <Row className="row" gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <div>
              <div className="center">
                <img
                  style={{ width: '100%', maxWidth: '200px' }}
                  src={appointment.tutor.image}
                  alt={appointment.tutor.fullname}
                />
              </div>
              <Title
                className="center"
                level={4}
                style={{ marginBottom: 0, marginTop: '0.5rem' }}
              >
                {appointment.tutor.fullname}
              </Title>
            </div>
          </Col>
          <Col xs={24} md={18}>
            <Title level={5}>Material</Title>
            <Text>{appointment.material}</Text>
            <Title level={5}>Request</Title>
            <Text>{appointment.request || '-'}</Text>
          </Col>
        </Row>

        {timeLeft && (
          <Row className="row">
            <Col xs={24} className="center">
              Starts in
            </Col>
            <Col xs={24} className="center">
              <Title level={2}>{timeLeft}</Title>
            </Col>
          </Row>
        )}

        {!appointment.finished && (
          <Row className="row" justify="space-between">
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
          <Row className="row" gutter={[24, 24]}>
            <Col>
              <Title level={5}>Feedback</Title>
              <Text>{appointment.feedback.text}</Text>
            </Col>
          </Row>
        )}

        {appointment.finished && !appointment.tutor?.reviews?.length && (
          <Row className="row" justify="end">
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
      </Card>
    </Container>
  )
}
