import React from 'react'
import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { Tutor } from '../../../api/tutors/entity'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const Container = styled.div`
  .not-accepted {
    border-color: red;
  }
`

const { Title } = Typography

export const AdminTutorCard = ({
  tutor,
  onEdit,
}: {
  tutor: Tutor
  onEdit: Function
}) => {
  const { id, image, fullname, accepted } = tutor

  return (
    <Container>
      <Card
        className={!accepted ? 'not-accepted' : ''}
        cover={
          <div
            className="cover-image"
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        }
        actions={[
          <EditOutlined key="edit" onClick={() => onEdit(tutor)} />,
          <Link key="ellipsis" to={`/tutors/${id}`}>
            <EllipsisOutlined />
          </Link>,
        ]}
      >
        <Title level={3} style={{ marginBottom: 0 }}>
          {fullname}
        </Title>
      </Card>
    </Container>
  )
}
