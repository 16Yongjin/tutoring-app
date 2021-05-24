import React, { useState } from 'react'
import { Breadcrumb, Button, Card, Col, Row, Typography } from 'antd'
import { HashLink as Link } from 'react-router-hash-link'
import styled from 'styled-components'
import { Course, Exercise } from '../../api/materials/entity'
import * as api from '../../api'
import { LevelBadge } from '../../components/material/LevelBadge'
import { useParams } from 'react-router'
import { useQuery, useQueryClient } from 'react-query'
import { APIError } from '../../api/interfaces/apiError'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { NewExerciseModal } from '../../components/admin/materials/NewExerciseModal'
import { NewCourseModal } from '../../components/admin/materials/NewCourseModal'
import { useScrollTop } from '../../utils/dom/scrollTop'

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

const CourseInfo = ({
  course,
  onEdit,
}: {
  course: Course
  onEdit: Function
}) => {
  const topic = course.topic
  const material = topic.material
  return (
    <Card>
      <Row gutter={[20, 0]} wrap={false}>
        {course.image && (
          <Col flex="none">
            <img src={course.image} alt={course.title} />
          </Col>
        )}
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

          {course.description && (
            <div style={{ marginTop: '0.5rem' }}>
              <Text>{course.description}</Text>w
            </div>
          )}
        </Col>
        <Col>
          <Button onClick={() => onEdit()} icon={<EditOutlined />} />
        </Col>
      </Row>
    </Card>
  )
}

const ExerciseCard = ({
  exercise,
  onEdit,
}: {
  exercise: Exercise
  onEdit: Function
}) => {
  return (
    <Card id={`exercise-${exercise.id}`} style={{ marginTop: '0.5rem' }}>
      <Row justify="space-between">
        <Col>
          <Link to={`#exercise-${exercise.id}`}>
            <Title type="secondary" level={4}>
              {exercise.title}
            </Title>
          </Link>
        </Col>
        <Col className="center-y">
          <Button onClick={() => onEdit(exercise)} icon={<EditOutlined />} />
        </Col>
      </Row>
      <div dangerouslySetInnerHTML={{ __html: exercise.text }}></div>
    </Card>
  )
}

const AddExerciseCard = ({ onClick }: { onClick: Function }) => {
  return (
    <Card
      type="inner"
      onClick={() => onClick()}
      className="center click"
      style={{ marginTop: '1rem' }}
    >
      <PlusOutlined /> Exercise 추가하기
    </Card>
  )
}

export const AdminCourseDetail = () => {
  useScrollTop()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { data: course, error } = useQuery(
    `course/${id}`,
    () => api.materials.getCourse(Number(id)),
    {
      retry: false,
    }
  )

  /**
   *  Course 추가/수정 로직
   */
  const [courseModalVisible, setCourseModalVisible] = useState(false)

  const onCourseEditRequest = () => {
    setCourseModalVisible(true)
  }
  const closeCourseModal = (updated: boolean) => {
    setCourseModalVisible(false)
    if (updated) queryClient.invalidateQueries(`course/${id}`)
  }

  /**
   *  Exercise 추가/수정 로직
   */
  const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null)
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false)

  const showExerciseModal = () => {
    setExerciseToEdit(null)
    setExerciseModalVisible(true)
  }
  const onExerciseEditRequest = (exercise: Exercise) => {
    setExerciseToEdit(exercise)
    setExerciseModalVisible(true)
  }
  const closeExerciseModal = (updated: boolean) => {
    setExerciseToEdit(null)
    setExerciseModalVisible(false)
    if (updated) queryClient.invalidateQueries(`course/${id}`)
  }

  if (error) {
    return <div>{(error as APIError).message}</div>
  }

  if (!course) {
    return <div>loading...</div>
  }

  return (
    <Section className="section">
      <div className="container">
        <CourseInfo course={course} onEdit={onCourseEditRequest} />
        {course.exercises.map((exercise) => (
          <ExerciseCard
            onEdit={onExerciseEditRequest}
            key={exercise.id}
            exercise={exercise}
          />
        ))}
        <AddExerciseCard onClick={showExerciseModal} />

        <NewCourseModal
          topic={null}
          show={courseModalVisible}
          course={course}
          onCancel={closeCourseModal}
        />

        <NewExerciseModal
          show={exerciseModalVisible}
          exercise={exerciseToEdit}
          course={course}
          onCancel={closeExerciseModal}
        />
      </div>
    </Section>
  )
}
