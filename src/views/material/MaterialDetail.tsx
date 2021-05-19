import { Card, Col, Row, Typography } from 'antd'
import { observer } from 'mobx-react-lite'
import React from 'react'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Role } from '../../api/auth/entity'
import { Course, Material, Topic } from '../../api/materials/entity'
import { LevelBadge } from '../../components/material/LevelBadge'
import { store } from '../../store'
import { AdminMaterialDetail } from '../admin'
import * as api from '../../api'
import { APIError } from '../../api/interfaces/apiError'

const { Title, Text } = Typography

const Section = styled.section`
  background-color: #f2f2f2; // ffe680
  position: relative;
  padding: 4rem 2rem;
  min-height: 100vh;

  @media screen and (max-width: 1024px) {
    padding: 4rem 0;
  }

  .change-dir-y {
    flex-direction: row;
  }

  @media screen and (max-width: 576px) {
    .change-dir-y {
      flex-direction: column !important;
    }
  }

  .card-hover:hover {
    background-color: rgb(249, 249, 249);
  }
`

const MaterialInfo = ({ material }: { material: Partial<Material> }) => {
  return (
    <Card>
      <Row gutter={[20, 0]} wrap={false}>
        <Col flex="none">
          <img width="150px" src={material.image} alt={material.title} />
        </Col>
        <Col flex="auto">
          <Title level={3}>{material.title}</Title>
          <div style={{ display: 'flex' }}>
            <LevelBadge level={material.levelStart!} />
            <Text style={{ margin: '0 0.75rem' }}>-</Text>
            <LevelBadge level={material.levelEnd!} />
          </div>
          <br />
          <Text>{material.description}</Text>
        </Col>
      </Row>
    </Card>
  )
}

const TopicCard = ({ topic }: { topic: Partial<Topic> }) => {
  return (
    <Card id={`topic-${topic.id}`} style={{ marginTop: '1.5rem' }}>
      <Row>
        <Col span={24}>
          <Title level={4}>{topic.title}</Title>
          <Text>{topic.description}</Text>
        </Col>
      </Row>
    </Card>
  )
}

const CourseTile = ({ course, index }: { course: Course; index: number }) => {
  return (
    <Link to={`/materials/courses/${course.id}`}>
      <Card className="card-hover" type="inner">
        <Row justify="space-between">
          <Col>
            <Row className="change-dir-y" gutter={[20, 0]}>
              <Col className="center-y">
                <Text type="secondary">Lesson {index + 1}</Text>
              </Col>
              <Col span="aito" className="center-y">
                <Title level={5} style={{ marginBottom: '1px' }}>
                  {course.title}
                </Title>
              </Col>
            </Row>
          </Col>
          <Col>
            <Text
              className="center-y"
              style={{ marginTop: '1px', height: '100%' }}
            >
              <LevelBadge level={course.level} />
              <span style={{ marginLeft: '0.75rem' }}>▶</span>
            </Text>
          </Col>
        </Row>
      </Card>
    </Link>
  )
}

export const UserMaterialDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { data: material, error } = useQuery(
    `material/${id}`,
    () => api.materials.getMaterial(Number(id)),
    {
      retry: false,
    }
  )

  if (error) {
    return <div>{(error as APIError).message}</div>
  }

  if (!material) {
    return <div>loading...</div>
  }

  return (
    <Section className="section">
      <div className="container">
        <MaterialInfo material={material} />
        {material.topics.map((topic) => (
          <div key={topic.id}>
            <TopicCard topic={topic} />
            {topic.courses.map((course, index) => (
              <CourseTile key={course.id} index={index} course={course} />
            ))}
          </div>
        ))}
      </div>
    </Section>
  )
}

export const MaterialDetail = observer(() => {
  const role = store.userStore.user?.role
  if (role === Role.ADMIN) return <AdminMaterialDetail />

  return <UserMaterialDetail />
})
