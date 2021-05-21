import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Role } from '../../api/auth/entity'
import { store } from '../../store'

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
  if (store.userStore.user?.role !== Role.TUTOR) {
    history.push('/tutors/login?next=/tutor')
  }

  return (
    <Section className="section">
      <div className="container">
        <header>
          <h2 className="title">Dashboard</h2>
        </header>
      </div>
    </Section>
  )
}
