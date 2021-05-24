import { Button, Card, Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { formatSchedule } from '../../../utils/date/formatSchedule'
import { Link } from 'react-router-dom'
import { useInterval } from 'react-use'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Appointment } from '../../../api/appointments/entity'

const { Title, Text } = Typography

const Container = styled.div`
  .row {
    margin-top: 1rem;
  }
`

export const EmptyTutorAppointmentCard = () => {
  return (
    <Card>
      <Row className="center">
        <Text>약속이 없습니다.</Text>
      </Row>
    </Card>
  )
}

export const TutorAppointmentCard = ({
  appointment,
  onFeedback,
}: {
  appointment: Appointment
  onFeedback?: Function
}) => {
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
            <Title level={5}>
              {appointment.user.fullname} ({appointment.user.username})
            </Title>
          </Col>
          <Col>
            <Title level={5}>{formatSchedule(appointment)}</Title>
          </Col>
        </Row>

        <Row className="row" gutter={[24, 24]}>
          <Col xs={24} md={18}>
            <Title level={5}>교재</Title>
            <Text>{appointment.material}</Text>
            <Title level={5}>요청사항</Title>
            <Text>{appointment.request || '-'}</Text>
          </Col>
        </Row>

        {timeLeft ? (
          <Row className="row">
            <Col xs={24} className="center">
              수업 시작까지 남은시간
            </Col>
            <Col xs={24} className="center">
              <Title level={2}>{timeLeft}</Title>
            </Col>
          </Row>
        ) : null}

        {appointment.feedback ? (
          <Row className="row" gutter={[24, 24]}>
            <Col>
              <Title level={5}>피드백</Title>
              <Text>{appointment.feedback.text}</Text>
            </Col>
          </Row>
        ) : null}

        {!appointment.finished ? (
          <Row className="row" justify="end">
            <Col>
              <Link to={`/appointments/${appointment.id}`}>
                <Button type="primary" shape="round">
                  입장하기
                </Button>
              </Link>
            </Col>
          </Row>
        ) : null}

        {appointment.finished && !appointment.feedback ? (
          <Row className="row" justify="end">
            <Col>
              <Button onClick={() => onFeedback?.(appointment)} shape="round">
                피드백 남기기
              </Button>
            </Col>
          </Row>
        ) : null}
      </Card>
    </Container>
  )
}
