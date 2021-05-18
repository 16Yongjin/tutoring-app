import React from 'react'
import { Button, Card, Typography } from 'antd'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Material } from '../../../api/materials/entity'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography

export const AdminMaterialCard = ({
  material,
  onEdit,
}: {
  material: Partial<Material>
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
      <div>
        {levelStart} ~ {levelEnd}
      </div>
    </Card>
  )
}
