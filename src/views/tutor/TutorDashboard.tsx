import React from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Role } from '../../api/auth/entity'
import { store } from '../../store'
import * as api from '../../api'
import { Spin } from 'antd'
import { ScheduleManager } from '../../components/tutor'

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const TutorDashboard = () => {
  const history = useHistory()

  if (store.userStore.user!.role !== Role.TUTOR) {
    history.push('/tutors/login?next=/tutor')
  }

  const getTutor = () => api.tutors.getTutor(store.userStore.user!.id)
  const { data: tutor } = useQuery(
    `tutor/${store.userStore.user!.id}`,
    getTutor
  )

  if (!tutor) {
    return <Spin />
  }

  return (
    <Section className="section">
      <div className="container">
        <header>
          <h2 className="title">Tutor Dashboard</h2>
        </header>
        <main>
          <h3 className="title">Schedule</h3>
          <ScheduleManager tutor={tutor} />
        </main>
      </div>
    </Section>
  )
}
