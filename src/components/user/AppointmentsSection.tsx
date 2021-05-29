import { Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import * as api from '../../api'
import { Loading } from '../common/Loading'
import { AppointmentCard } from '../appointment'
import { Tutor } from '../../api/tutors/entity'
import { ReviewTutorModal } from './ReviewTutorModal'
import { useState } from 'react'
import { Appointment } from '../../api/appointments/entity'
const { Title } = Typography

const Section = styled.section`
  .title {
    font-family: 'Godo';
    font-size: 1.5rem;
    font-weight: bold;
  }
`

export const AppointmentsSection = () => {
  const { data: appointments, isLoading } = useQuery(
    'appointments/me',
    api.appointments.getUserAppointments
  )
  const queryClient = useQueryClient()

  const [appointmentToReivew, setAppointmentToReview] =
    useState<Appointment | null>(null)

  const onReviewCancel = (updated?: boolean) => {
    setAppointmentToReview(null)
    if (updated) queryClient.invalidateQueries('appointments/me')
  }

  const onReviewTutor = (appointment: Appointment) => {
    setAppointmentToReview(appointment)
  }

  return (
    <Section>
      <header>
        <Title level={3}>Appointments</Title>
      </header>
      <main>
        {isLoading ? <Loading /> : null}

        <Row gutter={[16, 16]}>
          {appointments?.map((appointment) => (
            <Col key={appointment.id} xs={24}>
              <AppointmentCard
                appointment={appointment}
                onReviewTutor={onReviewTutor}
              />
            </Col>
          ))}
        </Row>
      </main>
      {appointmentToReivew && (
        <ReviewTutorModal
          appointment={appointmentToReivew}
          onCancel={onReviewCancel}
        />
      )}
    </Section>
  )
}
