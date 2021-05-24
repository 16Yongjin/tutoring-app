import { Typography } from 'antd'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { AppointmentCard, EmptyAppointmentCard } from './AppointmentCard'
const { Title } = Typography

export const UpcomingAppointment = () => {
  const { data: appointment } = useQuery(
    'appointments/upcoming',
    api.appointments.getUpcomingUserAppointment,
    { retry: 0 }
  )

  return (
    <section>
      <header>
        <Title level={3}>Appointment</Title>
      </header>

      <main>
        {appointment ? (
          <AppointmentCard appointment={appointment} />
        ) : (
          <EmptyAppointmentCard />
        )}
      </main>
    </section>
  )
}
