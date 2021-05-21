import React from 'react'
import { Col, Row, Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Gender, Role } from '../../api/auth/entity'
import { Tutor } from '../../api/tutors/entity'
import { TutorPreviewCard } from '../../components/tutor'
import { store } from '../../store'
import { AdminTutors } from '../admin'
import { useQuery } from 'react-query'
import * as api from '../../api'

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const UserTutors = () => {
  const { data: tutors, isLoading } = useQuery('tutors', api.tutors.getTutors)

  return (
    <Section className="section">
      <div className="container">
        <header>
          <h2 className="title">Tutors</h2>
        </header>
        <main>
          {isLoading ? (
            <div className="center">
              <Spin />
            </div>
          ) : null}

          <Row gutter={[16, 16]}>
            {tutors?.map((tutor) => (
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
