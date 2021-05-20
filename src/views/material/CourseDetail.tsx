import React from 'react'
import { Breadcrumb, Card, Col, Row, Typography } from 'antd'
import { HashLink as Link } from 'react-router-hash-link'
import styled from 'styled-components'
import { Course, Exercise } from '../../api/materials/entity'
import { LevelBadge } from '../../components/material/LevelBadge'
import { store } from '../../store'
import { observer } from 'mobx-react-lite'
import { Role } from '../../api/auth/entity'
import { AdminCourseDetail } from '../admin'
import { useParams } from 'react-router'
import { useQuery } from 'react-query'
import { APIError } from '../../api/interfaces/apiError'
import * as api from '../../api'

const { Title, Text } = Typography

const Section = styled.section`
  background-color: #f2f2f2; // ffe680
  position: relative;
  min-height: 100vh;

  @media screen and (max-width: 1024px) {
    padding: 4rem 0;
  }

  @media screen and (max-width: 1024px) {
    padding: 4rem 0;
  }
`

const CourseInfo = ({ course }: { course: Course }) => {
  const topic = course.topic
  const material = topic.material
  return (
    <Card>
      <Row gutter={[20, 0]} wrap={false}>
        {course.image ? (
          <Col flex="none">
            <img src={course.image} alt={course.title} />
          </Col>
        ) : null}
        <Col flex="auto">
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to={`/materials/${material.id}`}>
                <Text>{material.title}</Text>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {' '}
              <Link to={`/materials/${material.id}#topic-${topic.id}`}>
                <Text>{topic.title}</Text>
              </Link>
            </Breadcrumb.Item>
          </Breadcrumb>

          <Title level={2} style={{ marginBottom: '0.5rem' }}>
            {course.title}
          </Title>
          <LevelBadge level={course.level} />

          {course.description ? (
            <div style={{ marginTop: '0.5rem' }}>
              <Text>{course.description}</Text>
            </div>
          ) : null}
        </Col>
      </Row>
    </Card>
  )
}

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  return (
    <Card id={`exercise-${exercise.id}`} style={{ marginTop: '0.5rem' }}>
      <Row>
        <Col span={24}>
          <Link to={`#exercise-${exercise.id}`}>
            <Title type="secondary" level={4}>
              {exercise.title}
            </Title>
          </Link>
          <div dangerouslySetInnerHTML={{ __html: exercise.text }}></div>
        </Col>
      </Row>
    </Card>
  )
}

export const UserCourseDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { data: course, error } = useQuery(
    `course/${id}`,
    () => api.materials.getCourse(Number(id)),
    {
      retry: false,
    }
  )

  if (error) {
    return <div>{(error as APIError).message}</div>
  }

  if (!course) {
    return <div>loading...</div>
  }

  return (
    <Section className="section">
      <div className="container">
        <CourseInfo course={course} />
        {course.exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </Section>
  )
}

export const CourseDetail = observer(() => {
  const role = store.userStore.user?.role
  if (role === Role.ADMIN) return <AdminCourseDetail />

  return <UserCourseDetail />
})
