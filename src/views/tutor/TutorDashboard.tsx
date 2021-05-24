import React from 'react'
import { useQuery } from 'react-query'
import { Route, Switch } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Card, Col, Row } from 'antd'
import { store } from '../../store'
import * as api from '../../api'
import {
  ScheduleManager,
  TutorAppointmentsSection,
  TutorMyPage,
  TutorUpcomingAppointment,
} from '../../components/tutor'
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

  .sidebar {
    border-radius: 2px;
    border: 1px solid #eee;
    position: sticky;
    top: 20px;
    width: 12rem;
  }

  .link {
    display: block;
    & > .ant-card {
      border-radius: 0;
      border: unset;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #eee;
    }
  }
`

export const TutorDashboard = () => {
  const getTutor = () => api.tutors.getTutor(store.userStore.user!.id)
  const { data: tutor } = useQuery(
    `tutor/${store.userStore.user!.id}`,
    getTutor
  )

  if (!tutor) {
    return <Loading />
  }

  return (
    <Switch>
      <Section className="section">
        <div className="container">
          <Row wrap={false} gutter={[20, 20]}>
            <Col flex="none" className="is-hidden-tablet">
              <div className="sidebar">
                <Link className="link" to="/">
                  <Card type="inner">메인 페이지</Card>
                </Link>
                <Link className="link" to="/my">
                  <Card type="inner">마이 페이지</Card>
                </Link>
                <Link className="link" to="/appointments">
                  <Card type="inner">약속 목록</Card>
                </Link>
              </div>
            </Col>

            <Col flex="auto">
              <Route exact path="/">
                <TutorUpcomingAppointment />

                <ScheduleManager tutor={tutor} />
              </Route>

              <Route exact path="/my">
                <TutorMyPage />
              </Route>

              <Route exact path="/schedules"></Route>

              <Route exact path="/appointments">
                <TutorAppointmentsSection />
              </Route>
            </Col>
          </Row>
        </div>
      </Section>
    </Switch>
  )
}
