import React from 'react'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import { Link } from 'react-router-dom'

const Section = styled.section`
  background-color: #ebebeb;
  position: relative;

  .link {
    color: black;
  }
`

export const Footer = () => {
  return (
    <Section className="section">
      <Row className="container" gutter={[0, 20]}>
        <Col xs={24} md={12}>
          <Row gutter={[40, 20]}>
            <Col xs={24} md={8}>
              <div>
                <h4>About us</h4>
                <div>
                  <Link className="link" to="/materials">
                    Materials
                  </Link>
                </div>
                <div>
                  <Link className="link" to="/tutors">
                    Tutors
                  </Link>
                </div>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div>
                <h4>Tutor</h4>
                <Link className="link" to="/tutors/login">
                  Tutor Login
                </Link>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={12}>
          <div className="center" style={{ height: '100%' }}>
            <Link to="/">
              <img width="56px" className="icon" src="/icon.png" alt="icon" />
            </Link>
          </div>
        </Col>
      </Row>
    </Section>
  )
}
