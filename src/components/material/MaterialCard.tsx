import React from 'react'
import { Card } from 'antd'
import { Material } from '../../api/materials/entity'
import { Link } from 'react-router-dom'

export const MaterialCard = ({
  id,
  image,
  levelEnd,
  levelStart,
  title,
  description,
}: Material) => {
  return (
    <Link to={`/materials/${id}`}>
      <Card cover={<img src={image} alt={title} />}>
        <Card.Meta title={title} description={description} />
        {levelStart} ~ {levelEnd}
      </Card>
    </Link>
  )
}
