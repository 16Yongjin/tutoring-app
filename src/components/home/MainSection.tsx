import React from 'react'
import { Button, Col, Row } from 'antd'
import styled from 'styled-components'

const Section = styled.section`
  background-color: #fdf093; // ffe680
  position: relative;

  .description {
    padding: 6rem 0;
  }

  .hero {
    display: flex;
    width: 100%;
  }

  .logo {
    height: 100%;
    max-width: 100%;

    &:hover {
      animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
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

  @keyframes shake {
    10%,
    90% {
      transform: translate3d(-1px, 0, 0);
    }

    20%,
    80% {
      transform: translate3d(2px, 0, 0);
    }

    30%,
    50%,
    70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%,
    60% {
      transform: translate3d(4px, 0, 0);
    }
  }
`

export const MainSection = () => {
  return (
    <Section className="section">
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
