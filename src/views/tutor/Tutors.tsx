import React from 'react'
import { Col, Row } from 'antd'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Gender, Role } from '../../api/auth/entity'
import { TutorInfo } from '../../api/tutors/entity'
import { TutorPreviewCard } from '../../components/tutor'
import { store } from '../../store'
import { AdminTutors } from '../admin'

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const UserTutors = () => {
  const tutors: TutorInfo[] = [
    {
      id: 1,
      fullname: 'Hello',
      country: 'Korea',
      username: 'hi',
      email: 'hello@world.com',
      gender: Gender.MALE,
      image: 'https://via.placeholder.com/150',
      language: 'en',
      presentation: 'Hello',
      schedules: [],
    },
    {
      id: 2,
      fullname: 'Hello',
      country: 'Korea',
      username: 'hi',
      email: 'hello@world.com',
      gender: Gender.MALE,
      image: 'https://via.placeholder.com/150',
      language: 'en',
      presentation: 'Hello',
      schedules: [],
    },
    {
      id: 3,
      fullname: 'Hello',
      country: 'Korea',
      username: 'hi',
      email: 'hello@world.com',
      gender: Gender.MALE,
      image: 'https://via.placeholder.com/150',
      language: 'en',
      presentation: 'Hello',
      schedules: [],
    },
  ]

  return (
    <Section className="section">
      <div className="container">
        <header>
          <h2 className="title">Tutors</h2>
        </header>
        <main>
          <Row gutter={[16, 16]}>
            {tutors.map((tutor) => (
              <Col key={tutor.id} xs={12} md={8} lg={6}>
                <TutorPreviewCard tutor={tutor} />
              </Col>
            ))}
          </Row>
        </main>
      </div>
    </Section>
  )
}

export const Tutors = observer(() => {
  const role = store.userStore.user?.role
  if (role === Role.ADMIN) return <AdminTutors />

  return <UserTutors />
})
