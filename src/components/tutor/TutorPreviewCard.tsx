import React from 'react'
import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { Tutor } from '../../api/tutors/entity'

const { Title } = Typography

export const TutorPreviewCard = ({
  tutor: { id, image, fullname },
}: {
  tutor: Partial<Tutor>
}) => {
  return (
    <Link to={`/tutors/${id}`}>
      <Card cover={<img src={image} alt={fullname} />} hoverable>
        <Title level={3} style={{ marginBottom: 0 }}>
          {fullname}
        </Title>
      </Card>
    </Link>
  )
}
