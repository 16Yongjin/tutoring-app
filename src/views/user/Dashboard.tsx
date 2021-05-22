import React from 'react'
import styled from 'styled-components'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { AppointmentsSection } from '../../components/user'
import { Card, Col, Row } from 'antd'
import { AppointmentCard } from '../../components/appointment'

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }

  .sidebar {
    width: 16rem;
    border-radius: 2px;
    border: 1px solid #eee;
    height: max-content;
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
          <Row gutter={[20, 20]}>
            <Col className="sidebar is-hidden-mobile">
              <Link className="link" to="/">
                <Card type="inner">Main Page</Card>
              </Link>
              <Link className="link" to="/my">
                <Card type="inner">My Page</Card>
              </Link>
              <Link className="link" to="/appointments">
                <Card type="inner">My Appointments</Card>
              </Link>
              <Link className="link" to="/ended-appointments">
                <Card type="inner">Closed Appointments</Card>
              </Link>
            </Col>

            <Col flex="auto">
              <Route path="/appointments">
                <AppointmentsSection />
              </Route>

              <Route path="/appointments/:id">
                <header>
                  <h2 className="title">Appointment</h2>
                </header>
              </Route>

              <Route path="/">
                <header>
                  <h2 className="title">Dashboard</h2>
                  <AppointmentCard />
                </header>
              </Route>
            </Col>
          </Row>
        </div>
      </Section>
    </Switch>
  )
}
