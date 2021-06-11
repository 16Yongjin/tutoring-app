import { Card, Col, Row, Typography } from 'antd'
import { Review } from '../../api/reviews/entity'

const { Title, Text } = Typography

export const FeaturedReviewCard = ({ review }: { review: Review }) => {
  console.log(review)
  return (
    <Card>
      <Row>
        <div
          style={{
            width: '4rem',
            height: '4rem',
            aspectRatio: '1 / 1',
            backgroundImage: `url(${review?.tutor?.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '50%',
          }}
        ></div>
        <div className="pl-4 center-y">
          <Title level={4}>{review.tutor?.fullname}</Title>
        </div>
      </Row>
      <div className="mt-4">
        <Text>{review.text}</Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Text>- {review.user.fullname}</Text>
      </div>
    </Card>
  )
}
