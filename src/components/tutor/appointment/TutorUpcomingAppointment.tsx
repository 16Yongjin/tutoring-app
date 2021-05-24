import { Typography } from 'antd'
import { useQuery } from 'react-query'
import * as api from '../../../api'
import {
  EmptyTutorAppointmentCard,
  TutorAppointmentCard,
} from './TutorAppointmentCard'
const { Title } = Typography

export const TutorUpcomingAppointment = () => {
  const { data: appointment } = useQuery(
    'appointments/upcoming',
    api.appointments.getUpcomingTutorAppointment,
    { retry: 0 }
  )

  return (
    <section>
      <header>
        <Title level={3}>다가오는 약속</Title>
      </header>

      <main>
        {appointment ? (
          <TutorAppointmentCard appointment={appointment} />
        ) : (
          <EmptyTutorAppointmentCard />
        )}
      </main>
    </section>
  )
}
