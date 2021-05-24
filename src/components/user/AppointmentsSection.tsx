import { Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { Loading } from '../common/Loading'
import { AppointmentCard } from '../appointment'
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
              <AppointmentCard appointment={appointment} />
            </Col>
          ))}
        </Row>
      </main>
    </Section>
  )
}
