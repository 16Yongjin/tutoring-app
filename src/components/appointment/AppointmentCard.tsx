import { Button, Card, Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import * as api from '../../api'
import { formatSchedule } from '../../utils/date/formatSchedule'
import { CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useInterval } from 'react-use'
import { useState } from 'react'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const Container = styled.div`
  .row {
    margin-top: 1rem;
  }
`

export const AppointmentCard = () => {
  const queryClient = useQueryClient()
  const { data: appointment } = useQuery(
    'appointments/upcoming',
    api.appointments.getUpcomingUserAppointment,
    { retry: 0 }
  )
  const cancelAppointment = async () => {
    if (!appointment) return

    await api.appointments.removeAppointment({
      appointmentId: appointment.id,
    })

    queryClient.invalidateQueries('appointments/upcoming')
    queryClient.invalidateQueries('appointments/me')
    queryClient.invalidateQueries(`tutor/${appointment.tutor.id}/schedules`)
  }
  const [timeLeft, setTimeLeft] = useState('')
  const updateTimeLeft = () =>
    setTimeLeft(appointment ? dayjs(appointment.startTime).fromNow(true) : ' ')

  useInterval(updateTimeLeft, appointment ? 1000 : null)

  if (!appointment) return <Card>No Appointment..</Card>

  if (!timeLeft) updateTimeLeft()

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
        <Row className="row">
          <Col xs={24} className="center">
            Starts in
          </Col>
          <Col xs={24} className="center">
            <Title>{timeLeft}</Title>
          </Col>
        </Row>
        <Row className="row" justify="space-between">
          <Col>
            <Button onClick={cancelAppointment} shape="round">
              <CloseOutlined /> Cancel
            </Button>
          </Col>
          <Col>
            <Link to={`/appointments/${appointment.id}`}>
              <Button type="primary" shape="round">
                Enter
              </Button>
            </Link>
          </Col>
        </Row>
      </Card>
    </Container>
  )
}
