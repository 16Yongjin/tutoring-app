import React from 'react'
import { Card, Typography } from 'antd'
import { Tutor } from '../../../api/tutors/entity'

const { Title } = Typography

export const TutorProfile = ({
  tutor: { id, image, fullname },
}: {
  tutor: Tutor
}) => {
  return (
    <Card hoverable>
      <Title level={3} style={{ marginBottom: 0 }}>
        {fullname}
      </Title>
    </Card>
  )
}
