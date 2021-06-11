import React from 'react'
import { Col, Row } from 'antd'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { FeaturedReviewCard } from '../review'
import * as api from '../../api'

const Section = styled.section`
  position: relative;

  .title {
    font-family: 'Godo';
    font-size: 2rem;
    font-weight: bold;
  }
`

export const FeaturedReviewSection = () => {
  const { data: reviews, isLoading } = useQuery(
    'featuredReviews',
    api.reviews.getFeaturedReviews
  )

  if (!isLoading && !reviews?.length) return null

  return (
    <Section className="section">
      <div className="container">
        <Row>
          <Col xs={24}>
            <h1 className="title">Featured Reviews</h1>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {reviews?.map((review) => (
            <Col key={review.id} xs={24} md={8} lg={6}>
              <FeaturedReviewCard review={review} />
            </Col>
          ))}
        </Row>
      </div>
    </Section>
  )
}
