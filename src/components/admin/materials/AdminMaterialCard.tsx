import React from 'react'
import { Card, Typography } from 'antd'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { Material } from '../../../api/materials/entity'
import { Link } from 'react-router-dom'
import { LevelBadge } from '../../material/LevelBadge'

const { Title, Text } = Typography

export const AdminMaterialCard = ({
  material,
  onEdit,
}: {
  material: Material
  onEdit: Function
}) => {
  const { id, image, levelEnd, levelStart, title, description } = material

  return (
    <Card
      cover={<img src={image} alt={title} />}
      actions={[
        <EditOutlined key="edit" onClick={() => onEdit(material)} />,
        <Link to={`/materials/${id}`}>
          <EllipsisOutlined key="ellipsis" />
        </Link>,
      ]}
      hoverable
    >
      <Title level={3} style={{ marginBottom: 0 }}>
        {title}
      </Title>
      <Text>{description}</Text>
      <div style={{ display: 'flex' }}>
        <LevelBadge level={levelStart} />
        <span style={{ margin: '0 0.5rem' }}> ~ </span>
        <LevelBadge level={levelEnd} />
      </div>
    </Card>
  )
}
