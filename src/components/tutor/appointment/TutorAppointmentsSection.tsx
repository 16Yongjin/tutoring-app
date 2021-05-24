import { Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import * as api from '../../../api'
import { Loading } from '../../common/Loading'
import { TutorAppointmentCard } from './TutorAppointmentCard'
import { Appointment } from '../../../api/appointments/entity'
import { useState } from 'react'
import { FeedbackModal } from './FeedbackModal'
const { Title } = Typography

const Section = styled.section`
  .title {
    font-family: 'Godo';
    font-size: 1.5rem;
    font-weight: bold;
  }
`

export const TutorAppointmentsSection = () => {
  const queryClient = useQueryClient()
  const { data: appointments, isLoading } = useQuery(
    'appointments/tutor',
    api.appointments.getTutorAppointments
  )

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
