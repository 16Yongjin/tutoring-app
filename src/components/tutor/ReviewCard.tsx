import { Card, Col, Row, Typography } from 'antd'
import { StarFilled } from '@ant-design/icons'
import { useQuery } from 'react-query'
import * as api from '../../api'
import { Tutor } from '../../api/tutors/entity'

const { Title, Text } = Typography

export const ReviewCard = ({ tutor }: { tutor: Tutor }) => {
  const getReviews = () => api.reviews.getTutorReviews(tutor.id)
  const { data: reviews } = useQuery(`reviews/${tutor.id}`, getReviews)

  return (
    <Card bodyStyle={{ padding: '0' }} className="scrollbar">
      <Row
        className="center-y"
        justify="space-between"
        style={{ padding: '1rem 1.5rem' }}
      >
        <Col>
          <Title level={3} style={{ marginBottom: 0 }}>
            Reviews
          </Title>
        </Col>
        <Col>
          <div style={{ fontSize: '1rem' }}>
            <span
              style={{
                marginRight: '0.5rem',
                color: 'orange',
              }}
            >
              <StarFilled /> {tutor.rating}
            </span>
            <span>({tutor.reviewCount})</span>
          </div>
        </Col>
      </Row>
      <Row
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
          borderTop: '1px solid #eee',
        }}
      >
        {reviews?.length ? (
          reviews.map((review) => (
            <Col xs={24} key={review.id}>
              <Card
                bordered={false}
                style={{ borderBottom: '1px solid #eee' }}
                type="inner"
              >
                <div style={{ marginBottom: '1rem' }}>
                  <Text style={{ fontSize: '1rem' }} strong>
                    {review.user.fullname}
                  </Text>
                  <span style={{ marginLeft: '0.5rem', color: 'orange' }}>
                    <StarFilled /> {review.rating}
                  </span>
                </div>
                <div>
                  <Text>{review.text}</Text>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={24}>
            <Card type="inner">No Review</Card>
          </Col>
        )}
      </Row>
    </Card>
  )
}
