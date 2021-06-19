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
    font-weight: 500;
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

export const MyPage = () => {
  useIsAuth()
  const userId = store.userStore.user!.id
  const getUser = () => api.users.getUser(userId)
  const { data: user } = useQuery('user', getUser)
  const [modalVisible, setModalVisible] = useState(false)

  if (!user) return <Loading />

  return (
    <Section>
      <header>
        <Title level={3}>My Page</Title>
      </header>

      <main>
        <Card>
          <DetailTile label="Username" text={user.username} />
          <DetailTile label="Name" text={user.fullname} />
          <DetailTile label="Email" text={user.email} />
          {/* <DetailTile
            label="Gender"
            text={user.gender === 'other' ? '' : user.gender}
          />
          <DetailTile label="Language" text={user.language} /> */}

          <Row className="mt-4" justify="center">
            <Col>
              <Button
                onClick={() => setModalVisible(true)}
                type="primary"
                shape="round"
              >
                Change Password
              </Button>
            </Col>
          </Row>
        </Card>
      </main>

      <ChangePasswordModal
        changePassword={api.auth.changePassword}
        username={user.username}
        show={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </Section>
  )
}
