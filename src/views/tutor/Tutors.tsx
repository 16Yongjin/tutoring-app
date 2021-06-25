import React from 'react'
import { Col, Row } from 'antd'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { Role } from '../../api/auth/entity'
import { TutorPreviewCard } from '../../components/tutor'
import { store } from '../../store'
import { AdminTutors } from '../admin'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { Loading } from '../../components/common/Loading'

const Section = styled.section`
  position: relative;

  background-color: #f2f2f2;
  min-height: calc(100vh - 64px);

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
          {isLoading ? <Loading /> : null}

          <Row gutter={[16, 16]}>
            {tutors?.map((tutor) => (
              <Col key={tutor.id} xs={24} sm={12} md={8} lg={6}>
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
