import React from 'react'
import { Col, Row } from 'antd'
import styled from 'styled-components'
import { MaterialCard } from '../material/MaterialCard'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { Link } from 'react-router-dom'

const Section = styled.section`
  position: relative;
  padding: 4rem 2rem;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const MaterialSection = () => {
  const { data: materials } = useQuery('materials', api.materials.getMaterials)

  return (
    <Section>
      <div className="container">
        <Row>
          <Col xs={24}>
            <Link to="/materials">
              <h1 className="title">Materials</h1>
            </Link>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {materials?.map((material) => (
            <Col key={material.id} xs={24} md={12} lg={8}>
              <MaterialCard material={material} />
            </Col>
          ))}
        </Row>
      </div>
    </Section>
  )
}
