import React, { useState } from 'react'
import { Button, Col, Row } from 'antd'
import styled from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import * as api from '../../api'
import { Gender } from '../../api/auth/entity'
import { Tutor } from '../../api/tutors/entity'
import { AdminTutorCard, EditTutorModal } from '../../components/admin/tutors'
import { PlusOutlined } from '@ant-design/icons'

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const AdminTutors = () => {
  const { data: tutors } = useQuery(
    'tutorsByAdmin',
    api.tutors.getTutorsByAdmin
  )

  const [modalVisible, setModalVisible] = useState(false)
  const [tutorToEdit, setTutorToEdit] = useState<Tutor | null>(null)
  const queryClient = useQueryClient()
  // const { data } = useQuery('tutors', api.tutors.getTutors)

  const showModal = () => {
    setTutorToEdit(null)
    setModalVisible(true)
  }
  const onEditRequest = (tutor: Tutor) => {
    setTutorToEdit(tutor)
    console.log(tutor)
    setModalVisible(true)
  }
  const closeModal = (updated: boolean) => {
    setModalVisible(false)
    if (updated) queryClient.invalidateQueries('tutorsByAdmin')
  }

  return (
    <Section className="section">
      <div className="container">
        <header>
          <Row justify="space-between" style={{ marginBottom: '1rem' }}>
            <Col>
              <h1 className="title">Tutors</h1>
            </Col>
            <Col className="center-y">
              <Button onClick={showModal} icon={<PlusOutlined />} />
            </Col>
          </Row>
        </header>

        <main>
          <Row gutter={[16, 16]}>
            {tutors?.map((tutor) => (
              <Col key={tutor.id} xs={12} md={8} lg={6}>
                <AdminTutorCard onEdit={onEditRequest} tutor={tutor} />
              </Col>
            ))}
          </Row>
        </main>

        <EditTutorModal
          show={modalVisible}
          tutor={tutorToEdit}
          onCancel={closeModal}
        />
      </div>
    </Section>
  )
}
