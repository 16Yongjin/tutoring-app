import { Col, Row, Typography, Button } from 'antd'
import styled from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import * as api from '../../../api'
import { Loading } from '../../common/Loading'
import { TutorAppointmentCard } from './TutorAppointmentCard'
import { Appointment } from '../../../api/appointments/entity'
import { useEffect, useState } from 'react'
import { FeedbackModal } from './FeedbackModal'
import { useHistory } from 'react-router-dom'
import { useQueryParam } from '../../../utils/router/useQueryParams'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
const { Title } = Typography

const Section = styled.section`
  .title {
    font-family: 'Godo';
    font-size: 1.5rem;
    font-weight: bold;
  }

  .page-number {
    margin: 0 1rem;
  }
`

export const TutorAppointmentsSection = () => {
  const history = useHistory()
  const queryParam = useQueryParam()
  const [page, setPage] = useState(+(queryParam.get('page') || 1))
  const { data: appointments, isLoading } = useQuery(
    ['appointments/me', page],
    () => api.appointments.getTutorAppointments({ page }),
    { keepPreviousData: true }
  )
  const queryClient = useQueryClient()

  const [appointmentToFeedback, setAppointmentToFeedback] =
    useState<Appointment | null>(null)
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false)
  const feedbackAppointment = (appointment: Appointment) => {
    setFeedbackModalVisible(true)
    setAppointmentToFeedback(appointment)
  }
  const onFeedbackCancel = (updated?: boolean) => {
    setFeedbackModalVisible(false)
    setAppointmentToFeedback(null)
    if (updated) queryClient.invalidateQueries('appointments/tutor')
  }

  // page 변경 시 쿼리 파라미터 업데이트 & 스크롤 업
  useEffect(() => {
    history.replace(`${window.location.pathname}?page=${page}`)
    window.scrollTo(0, 0)
  }, [page, history])

  return (
    <Section>
      <header>
        <Title level={3}>약속 목록</Title>
      </header>
      <main>
        {isLoading ? <Loading /> : null}

        <Row gutter={[16, 16]}>
          {appointments?.map((appointment) => (
            <Col key={appointment.id} xs={24}>
              <TutorAppointmentCard
                appointment={appointment}
                onFeedback={feedbackAppointment}
              />
            </Col>
          ))}
        </Row>

        {appointments && (
          <Row justify="end" className="mt-4">
            <Button
              icon={<LeftOutlined />}
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
            />
            <span className="page-number center-y">{page}</span>
            <Button
              icon={<RightOutlined />}
              onClick={() => setPage(page + 1)}
              disabled={appointments.length < 10}
            />
          </Row>
        )}

        {appointmentToFeedback ? (
          <FeedbackModal
            appointment={appointmentToFeedback}
            show={feedbackModalVisible}
            onCancel={onFeedbackCancel}
          />
        ) : null}
      </main>
    </Section>
  )
}
