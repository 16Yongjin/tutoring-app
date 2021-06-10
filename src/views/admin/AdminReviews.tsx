import { Typography, Table, Button, Rate } from 'antd'
import styled from 'styled-components'
import { useQuery, useQueryClient } from 'react-query'
import * as api from '../../api'
import { Loading } from '../../components/common'
import { Review } from '../../api/reviews/entity'
const { Title } = Typography

const { Column } = Table

const Section = styled.section`
  .title {
    font-family: 'Godo';
    font-size: 1.5rem;
    font-weight: bold;
  }
`

export const AdminReviews = () => {
  const queryClient = useQueryClient()
  const { data: reviews, isLoading } = useQuery(
    'reviews/all',
    api.reviews.getReviews
  )

  if (isLoading) return <Loading />

  const toggleFeatured = async (review: Review) => {
    console.log('review', review)
    await api.reviews.setReviewFeatured({
      id: review.id,
      featured: !review.featured,
    })
    queryClient.invalidateQueries('reviews/all')
  }

  return (
    <Section>
      <header>
        <Title level={3}>리뷰 관리</Title>
      </header>
      <main>
        <Table dataSource={reviews}>
          <Column
            title="유저 이름"
            dataIndex={['user', 'fullname']}
            key="address"
          />
          <Column title="리뷰" dataIndex="text" key="text" />
          <Column
            title="점수"
            dataIndex="rating"
            key="rating"
            render={(rating) => {
              return <Rate disabled defaultValue={rating} />
            }}
          />
          <Column
            title="추천"
            key="action"
            render={(review) => {
              return (
                <Button
                  onClick={() => toggleFeatured(review as Review)}
                  type={review.featured ? 'primary' : 'default'}
                >
                  {review.featured ? '해제' : '추천'}
                </Button>
              )
            }}
          />
        </Table>
      </main>
    </Section>
  )
}
