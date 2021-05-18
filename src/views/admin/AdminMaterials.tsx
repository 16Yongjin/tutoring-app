import { Button, Col, Row } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import React, { useState } from 'react'
import styled from 'styled-components'
import { AdminMaterialCard } from '../../components/admin/materials/AdminMaterialCard'
import { NewMaterialCard } from '../../components/admin/materials/NewMaterialCard'
import Modal from 'antd/lib/modal/Modal'
import { useQuery, useQueryClient } from 'react-query'
import * as api from '../../api'
import { Material } from '../../api/materials/entity'

const Section = styled.section`
  background-color: white; // ffe680
  position: relative;
  padding: 4rem 2rem;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0;
  }
`

export const AdminMaterials = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null)
  const queryClient = useQueryClient()
  const { data } = useQuery('materials', api.materials.getMaterials)

  const showModal = () => {
    setMaterialToEdit(null)
    setModalVisible(true)
  }
  const onEditRequest = (material: Material) => {
    setMaterialToEdit(material)
    setModalVisible(true)
  }
  const closeModal = (updated: boolean) => {
    setModalVisible(false)
    if (updated) queryClient.invalidateQueries('materials')
  }

  return (
    <Section>
      <div className="container">
        <Row justify="space-between" style={{ marginBottom: '1rem' }}>
          <Col>
            <h1 className="title">Materials</h1>
          </Col>
          <Col className="center-y">
            <Button onClick={showModal} icon={<PlusOutlined />} />
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {(data as Material[])?.map((material) => (
            <Col key={material.id} xs={24} md={12} lg={8}>
              <AdminMaterialCard onEdit={onEditRequest} material={material} />
            </Col>
          ))}
        </Row>

        <NewMaterialCard
          material={materialToEdit}
          show={modalVisible}
          onCancel={closeModal}
        />
      </div>
    </Section>
  )
}
