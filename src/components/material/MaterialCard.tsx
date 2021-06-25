import React from 'react'
import { Card, Typography } from 'antd'
import { Material } from '../../api/materials/entity'
import { Link } from 'react-router-dom'
import { LevelBadge } from './LevelBadge'

const { Title, Text } = Typography

export const MaterialCard = ({
  material: { id, image, levelEnd, levelStart, title, description },
  urlPrefix,
}: {
  material: Partial<Material>
  urlPrefix?: string
}) => {
  return (
    <Link to={`${urlPrefix || ''}/materials/${id}`}>
      <Card
        cover={
          <div
            className="cover-image"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        }
        hoverable
      >
        <Title level={3} style={{ marginBottom: 0 }}>
          {title}
        </Title>
        <Text>{description}</Text>
        <div className="mt-4" style={{ display: 'flex', flexWrap: 'wrap' }}>
          <LevelBadge level={levelStart!} />
          <Text style={{ margin: '0 0.75rem' }}>-</Text>
          <LevelBadge level={levelEnd!} />
        </div>
      </Card>
    </Link>
  )
}
