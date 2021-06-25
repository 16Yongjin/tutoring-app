import React from 'react'
import { Card, Descriptions } from 'antd'
import { Tutor } from '../../api/tutors/entity'
import { YoutubeOutlined } from '@ant-design/icons'

export const TutorProfile = ({
  tutor,
  setVideoVisible,
}: {
  tutor: Tutor
  setVideoVisible: Function
}) => {
  return (
    <Card style={{ position: 'sticky', top: '20px' }}>
      <div
        style={{
          aspectRatio: '1 / 1',
          backgroundImage: `url(${tutor.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          width: '100%',
          height: 'auto',
          boxSizing: 'border-box',
          verticalAlign: 'top',
        }}
        onClick={() => tutor.youtube && setVideoVisible(true)}
      >
        {tutor.youtube && (
          <div className="play center click">
            <YoutubeOutlined size={40} className="play-icon" />
          </div>
        )}
      </div>

      <Descriptions column={1} bordered style={{ marginTop: '1rem' }}>
        <Descriptions.Item label="Name">{tutor.fullname}</Descriptions.Item>
        <Descriptions.Item label="Country">{tutor.country}</Descriptions.Item>
        <Descriptions.Item label="Gender">{tutor.gender}</Descriptions.Item>
        <Descriptions.Item label="Presentation">
          {tutor.presentation}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  )
}
