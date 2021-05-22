import React from 'react'
import { Card, Col, Row, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Role } from '../../api/auth/entity'
import { TutorPreviewCard } from '../tutor'
import { store } from '../../store'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { Loading } from '../common/Loading'
import dayjs from 'dayjs'
const { Title } = Typography

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const AppointmentsSection = () => {
  const { data: appointments, isLoading } = useQuery(
    'appointments/me',
    api.appointments.getUserAppointments
  )

  return (
    <Section className="section">
      <div className="container">
        <header>
          <h2 className="title">Appointments</h2>
        </header>
        <main>
          {isLoading ? <Loading /> : null}

          <Row gutter={[16, 16]}>
            {appointments?.map((appointment) => (
              <Col key={appointment.id} xs={12} md={8} lg={6}>
                <Card>
                  <Title level={3}>
                    {`${dayjs(appointment.startTime).format(
                      'MM. DD. hh:mm'
                    )} ~ ${dayjs(appointment.endTime).format('hh:mm')}`}
                  </Title>
                </Card>
              </Col>
            ))}
          </Row>
        </main>
      </div>
    </Section>
  )
}
