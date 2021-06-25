import React from 'react'
import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { Tutor } from '../../api/tutors/entity'
import { StarFilled } from '@ant-design/icons'

const { Title, Text } = Typography

export const TutorPreviewCard = ({ tutor }: { tutor: Tutor }) => {
  return (
    <Link to={`/tutors/${tutor.id}`}>
      <Card
        cover={
          <div
            className="cover-image"
            style={{ backgroundImage: `url(${tutor.image})` }}
          ></div>
        }
        hoverable
      >
        <Title level={3} style={{ marginBottom: 0 }}>
          {tutor.fullname}
        </Title>
        <Text>
          <span style={{ marginRight: '0.25rem', color: 'orange' }}>
            <StarFilled /> {tutor.rating}
          </span>
          <span>({tutor.reviewCount})</span>
        </Text>
      </Card>
    </Link>
  )
}
