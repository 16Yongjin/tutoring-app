import React from 'react'
import styled from 'styled-components'
import { Switch, Route, Link } from 'react-router-dom'
import { AppointmentsSection } from '../../components/user'
import { Card, Col, Row } from 'antd'
import { TutorSearch } from '../tutor'
const AdminReviews = React.lazy(() => import('./AdminReviews'))

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

export const AdminDashboard = () => {
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
                <Link className="link" to="/reviews">
                  <Card type="inner">리뷰 관리</Card>
                </Link>
                <Link className="link" to="/users">
                  <Card type="inner">유저 관리</Card>
                </Link>
                <Link className="link" to="/appointments">
                  <Card type="inner">약속 관리</Card>
                </Link>
              </div>
            </Col>

            <Col flex="auto">
              <Route exact path="/"></Route>

              <Route exact path="/reviews" render={() => <AdminReviews />} />

              <Route exact path="/tutors">
                <TutorSearch />
              </Route>

              <Route exact path="/appointments">
                <AppointmentsSection />
              </Route>
            </Col>
          </Row>
        </div>
      </Section>
    </Switch>
  )
}

export default AdminDashboard
