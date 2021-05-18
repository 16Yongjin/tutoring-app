import React from 'react'
import { Breadcrumb, Card, Col, Row, Typography } from 'antd'
import { HashLink as Link } from 'react-router-hash-link'
import styled from 'styled-components'
import { Course, Exercise } from '../../api/materials/entity'
import { LevelBadge } from '../../components/material/LevelBadge'

const { Title, Text } = Typography

const Section = styled.section`
  background-color: #f2f2f2; // ffe680
  position: relative;
  padding: 4rem 2rem;
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

export const CourseDetail = () => {
  const course = {
    id: 1,
    title: 'course 1',
    description: 'course desc',
    level: 1,
    // image: 'https://via.placeholder.com/200',
    exercises: [
      {
        id: 0,
        index: 0,
        title: 'Exercise 1',
        description: 'hello',
        text: `<h1>안녕</h1><h2>하세요</h2>`,
      },
      {
        id: 1,
        index: 1,
        title: 'Exercise 2',
        description: 'hello',
        text: `<h1>안녕</h1><h2>하세요</h2>`,
      },
      {
        id: 2,
        index: 2,
        title: 'Exercise 3',
        description: 'hello',
        text: `<h1>안녕</h1><h3>하세요</h3>`,
      },
    ],
    topic: {
      id: 1,
      title: 'topic1',
      material: { id: 0, title: 'conversation' },
    },
  } as Course

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
