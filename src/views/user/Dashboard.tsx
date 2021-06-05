import styled from 'styled-components'
import { Switch, Route, Link } from 'react-router-dom'
import { AppointmentsSection } from '../../components/user'
import { Button, Card, Col, Row } from 'antd'
import { UpcomingAppointment } from '../../components/appointment'
import { MyPage } from './MyPage'
import { Tutors, TutorSearch } from '../tutor'

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

export const Dashboard = () => {
  return (
    <Switch>
      <Section className="section">
        <div className="container">
          <Row wrap={false} gutter={[20, 20]}>
            <Col flex="none" className="is-hidden-tablet">
              <div className="sidebar">
                <Link className="link" to="/tutors">
                  <Card type="inner" className="center">
                    <Button type="primary" shape="round">
                      Make Appointment
                    </Button>
                  </Card>
                </Link>
                <Link className="link" to="/">
                  <Card type="inner">Main Page</Card>
                </Link>
                <Link className="link" to="/my">
                  <Card type="inner">My Page</Card>
                </Link>
                <Link className="link" to="/appointments">
                  <Card type="inner">My Appointments</Card>
                </Link>
              </div>
            </Col>

            <Col flex="auto">
              <Route exact path="/">
                <UpcomingAppointment />
              </Route>

              <Route exact path="/tutors">
                <TutorSearch />
              </Route>

              <Route exact path="/my">
                <MyPage />
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
