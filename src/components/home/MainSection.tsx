import React from 'react'
import { Button, Col, Row } from 'antd'
import styled from 'styled-components'

const Section = styled.section`
  background-color: #fdf093; // ffe680
  position: relative;
  padding: 4rem 2rem;

  .description {
    padding: 6rem 0;
  }

  .hero {
    display: flex;
    width: 100%;
  }

  .logo {
    height: 100%;
  }

  .title {
    font-family: 'Godo';
    font-size: 2.5rem;
    font-weight: bold;
  }

  .subtitle {
    font-size: 1.5rem;
    color: #666;
  }

  .cta {
    font-weight: 500;

    &-wrapper {
      margin-top: 2rem;
    }
  }
`

export const MainSection = () => {
  return (
    <Section>
      <Row className="container">
        <Col md={12} xs={24}>
          <div className="description">
            <h1 className="title">
              Hello World
              <br />
              Let's learn about Korea
            </h1>
            <h3 className="subtitle">Study with us</h3>
            <div className="cta-wrapper">
              <Button shape="round" size="large">
                <span className="cta">Let's go</span>
              </Button>
            </div>
          </div>
        </Col>
        <Col className="hero center" md={12} xs={24}>
          <img className="logo" src="/logo.png" alt="logo" />
        </Col>
      </Row>
    </Section>
  )
}
