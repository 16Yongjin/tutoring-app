import { EditOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Typography } from 'antd'
import React, { useCallback, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import * as api from '../../api'
import { Course, Material, Topic } from '../../api/materials/entity'
import { NewCourseModal } from '../../components/admin/materials/NewCourseModal'
import { NewMaterialModal } from '../../components/admin/materials/NewMaterialModal'
import { NewTopicModal } from '../../components/admin/materials/NewTopicModal'
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

const MaterialInfo = ({
  material,
  onEdit,
}: {
  material: Partial<Material>
  onEdit: Function
}) => {
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
        <Col>
          <Button onClick={() => onEdit()} icon={<EditOutlined />} />
        </Col>
      </Row>
    </Card>
  )
}

const TopicCard = ({
  topic,
  onEdit,
}: {
  topic: Partial<Topic>
  onEdit: Function
}) => {
  return (
    <Card id={`topic-${topic.id}`} style={{ marginTop: '1.5rem' }}>
      <Row justify="space-between">
        <Col>
          <Title level={4}>{topic.title}</Title>
          <Text>{topic.description}</Text>
        </Col>
        <Col className="center-y">
          <Button onClick={() => onEdit(topic)} icon={<EditOutlined />} />
        </Col>
      </Row>
    </Card>
  )
}

/**
 * Course 정보를 담은 타일
 *
 * 수정 버튼과 해당 강의 보기 버튼 포함
 */
const CourseTile = ({
  course,
  index,
  onEdit,
}: {
  course: Course
  index: number
  onEdit: Function
}) => {
  return (
    <Card className="card-hover" type="inner">
      <Row justify="space-between">
        <Col>
          <Row className="change-dir-y" gutter={[20, 0]}>
            <Col className="center-y">
              <Text type="secondary">Lesson {index + 1}</Text>
            </Col>
            <Col className="center-y">
              <Title level={5} style={{ marginBottom: '1px' }}>
                {course.title}
              </Title>
            </Col>
            <Col className="center-y">
              <Title
                type="secondary"
                level={5}
                style={{ marginBottom: '1px', fontWeight: 500 }}
              >
                {course.description}
              </Title>
            </Col>
          </Row>
        </Col>
        <Col className="center-y">
          <div style={{ display: 'flex', gap: '1rem' }}>
            <LevelBadge level={course.level} />
            <Button onClick={() => onEdit(course)} icon={<EditOutlined />} />
            <Link to={`/materials/courses/${course.id}`}>
              <Button icon={<EllipsisOutlined />} />
            </Link>
          </div>
        </Col>
      </Row>
    </Card>
  )
}

/**
 * 클릭 시 Course 추가 모달 띄움
 */
const AddCourseCard = ({
  onClick,
  topic,
}: {
  topic: Topic
  onClick: Function
}) => (
  <Card type="inner" onClick={() => onClick(topic)} className="center click">
    <PlusOutlined /> 강의 추가하기
  </Card>
)

/**
 * 클릭 시 토픽 추가 모달 띄움
 */
const AddTopicCard = ({ onClick }: { onClick: Function }) => (
  <Card
    onClick={() => onClick()}
    className="center click"
    style={{ marginTop: '1rem' }}
  >
    <PlusOutlined /> 토픽 추가하기
  </Card>
)

export const AdminMaterialDetail = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const getMaterial = useCallback(
    () => api.materials.getMaterial(Number(id)),
    [id]
  )
  const { data: material, isLoading } = useQuery(`material/${id}`, getMaterial)

  /**
   * 교재 수정 로직
   */
  const [materialModalVisible, setMaterialModalVisible] = useState(false)
  const onMaterialEditRequest = () => {
    setMaterialModalVisible(true)
  }
  const closeMaterialModal = (updated: boolean) => {
    setMaterialModalVisible(false)
    if (updated) queryClient.invalidateQueries(`material/${id}`)
  }

  /**
   *  토픽 추가/수정 로직
   */
  const [topicToEdit, setTopicToEdit] = useState<Topic | null>(null)
  const [topicModalVisible, setTopicModalVisible] = useState(false)

  const showTopicModal = () => {
    setTopicToEdit(null)
    setTopicModalVisible(true)
  }
  const onTopicEditRequest = (topic: Topic) => {
    setTopicToEdit(topic)
    setTopicModalVisible(true)
  }
  const closeTopicModal = (updated: boolean) => {
    setTopicToEdit(null)
    setTopicModalVisible(false)
    if (updated) queryClient.invalidateQueries(`material/${id}`)
  }

  /**
   * 강의(Course) 추가/수정 로직
   */
  const [courseToAddTopic, setCourseToAddTopic] = useState<Topic | null>(null)
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null)
  const [courseModalVisible, setCourseModalVisible] = useState(false)

  const showCourseModal = (topic: Topic) => {
    setCourseToAddTopic(topic)
    setCourseToEdit(null)
    setCourseModalVisible(true)
  }
  const onCourseEditRequest = (course: Course) => {
    setCourseToAddTopic(null)
    setCourseToEdit(course)
    setCourseModalVisible(true)
  }
  const closeCourseModal = (updated: boolean) => {
    setCourseToEdit(null)
    setCourseToAddTopic(null)
    setCourseModalVisible(false)
    if (updated) queryClient.invalidateQueries(`material/${id}`)
  }

  if (isLoading) {
    return <div>Loading</div>
  }

  if (!material) {
    return <div>Topic not found</div>
  }

  return (
    <Section className="section">
      <div className="container">
        <MaterialInfo material={material} onEdit={onMaterialEditRequest} />
        {material.topics.map((topic) => (
          <div key={topic.id}>
            <TopicCard topic={topic} onEdit={onTopicEditRequest} />
            {topic.courses.map((course, index) => (
              <CourseTile
                onEdit={onCourseEditRequest}
                key={course.id}
                index={index}
                course={course}
              />
            ))}
            <AddCourseCard topic={topic} onClick={showCourseModal} />
          </div>
        ))}

        <AddTopicCard onClick={showTopicModal} />

        <NewTopicModal
          show={topicModalVisible}
          onCancel={closeTopicModal}
          topic={topicToEdit}
          material={material}
        />

        <NewCourseModal
          show={courseModalVisible}
          onCancel={closeCourseModal}
          course={courseToEdit}
          topic={courseToAddTopic}
        />

        <NewMaterialModal
          show={materialModalVisible}
          onCancel={closeMaterialModal}
          material={material}
        />
      </div>
    </Section>
  )
}
