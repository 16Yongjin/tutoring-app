import React from 'react'
import { Card, Typography } from 'antd'
import { Material } from '../../api/materials/entity'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography

export const MaterialCard = ({
  material: { id, image, levelEnd, levelStart, title, description },
}: {
  material: Partial<Material>
}) => {
  return (
    <Link to={`/materials/${id}`}>
      <Card cover={<img src={image} alt={title} />} hoverable>
        <Title level={3} style={{ marginBottom: 0 }}>
          {title}
        </Title>
        <Text>{description}</Text>
        <div>
          {levelStart} ~ {levelEnd}
        </div>
      </Card>
    </Link>
  )
}
