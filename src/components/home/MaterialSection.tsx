import React from 'react'
import { Button, Card, Col, Row } from 'antd'
import styled from 'styled-components'
import { MaterialCard } from '../material/MaterialCard'

const Section = styled.section`
  background-color: white; // ffe680
  position: relative;
  padding: 4rem 2rem;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const MaterialSection = () => {
  const materials = [
    {
      id: 1,
      image: 'https://via.placeholder.com/150',
      levelStart: 1,
      levelEnd: 10,
      title: 'hello',
      description: 'world',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/150',
      levelStart: 1,
      levelEnd: 10,
      title: 'hello',
      description: 'world',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/150',
      levelStart: 1,
      levelEnd: 10,
      title: 'hello',
      description: 'world',
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/150',
      levelStart: 1,
      levelEnd: 10,
      title: 'hello',
      description: 'world',
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/150',
      levelStart: 1,
      levelEnd: 10,
      title: 'hello',
      description: 'world',
    },
    {
      id: 6,
      image: 'https://via.placeholder.com/150',
      levelStart: 1,
      levelEnd: 10,
      title: 'hello',
      description: 'world',
    },
  ]

  return (
    <Section>
      <div className="container">
        <Row>
          <Col xs={24}>
            <h1 className="title">Materials</h1>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {materials.map((material) => (
            <Col key={material.id} xs={24} md={12} lg={8}>
              <MaterialCard material={material} />
            </Col>
          ))}
        </Row>
      </div>
    </Section>
  )
}
