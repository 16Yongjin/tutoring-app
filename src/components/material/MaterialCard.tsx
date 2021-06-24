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
            style={{
              width: '100%',
              height: '100%',
              maxWidth: '200px',
              maxHeight: '200px',
              aspectRatio: '1 / 1',
              backgroundImage: `url(${image})`,
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              margin: '0 auto',
            }}
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
