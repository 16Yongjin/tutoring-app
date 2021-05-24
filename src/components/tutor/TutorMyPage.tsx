import { useState } from 'react'
import { store } from '../../store'
import { useIsAuth } from '../../utils/auth/useIsAuth'
import * as api from '../../api'
import { useQuery } from 'react-query'
import { Loading } from '../../components/common'
import { Button, Card, Col, Row, Typography } from 'antd'
import styled from 'styled-components'
import { ChangePasswordModal } from '../../components/auth'

const { Title } = Typography

const Section = styled.section`
  .detail {
    margin-bottom: 0.25rem;
  }

  .label {
    text-align: right;
    font-weight: 600;
  }

  .text {
    color: #787878;
  }

  @media screen and (max-width: 576px) {
    .detail {
      flex-direction: column;
      margin-bottom: 0.75rem;
    }

    .label {
      text-align: left;
    }
  }
`

const DetailTile = ({ label, text }: { label: string; text: string }) => (
  <Row className="detail" gutter={[20, 0]}>
    <Col className="label" md={12}>
      {label}
    </Col>
    <Col className="text" md={12}>
      {text}
    </Col>
  </Row>
)

export const TutorMyPage = () => {
  useIsAuth()
  const userId = store.userStore.user!.id
  const getTutor = () => api.tutors.getTutor(userId)
  const { data: tutor } = useQuery('tutor', getTutor)
  const [modalVisible, setModalVisible] = useState(false)

  if (!tutor) return <Loading />

  return (
    <Section>
      <header>
        <Title level={3}>마이 페이지</Title>
      </header>

      <main>
        <Card>
          <DetailTile label="아이디" text={tutor.username} />
          <DetailTile label="이름" text={tutor.fullname} />
          <DetailTile label="이메일" text={tutor.email} />
          <DetailTile
            label="성별"
            text={tutor.gender === 'other' ? '' : tutor.gender}
          />
          <DetailTile label="언어" text={tutor.language} />

          <Row className="mt-4" justify="center">
            <Col>
              <Button
                onClick={() => setModalVisible(true)}
                type="primary"
                shape="round"
              >
                비밀번호 변경
              </Button>
            </Col>
          </Row>
        </Card>
      </main>

      <ChangePasswordModal
        changePassword={api.auth.changePassword}
        username={tutor.username}
        show={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </Section>
  )
}
