import { useState } from 'react'
import { Alert, Card } from 'antd'
import { Form } from 'formik-antd'
import { Button, Typography } from 'antd'
import { Formik } from 'formik'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { InputField } from '../../components/form/InputField'
import { store } from '../../store'
import { useQueryParam } from '../../utils/router/useQueryParams'

const { Title, Paragraph } = Typography

const Section = styled.section`
  max-width: 400px;
  margin: 2rem auto;

  .header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
`
const SignupSuccessAlert = ({ show }: { show: boolean }) =>
  show ? (
    <Alert
      style={{ margin: '1rem 0' }}
      message="Singup Success"
      description="We sent you a verification email. Please check your email and login"
      type="success"
    />
  ) : null

const ErrorAlert = ({ message }: { message: string }) =>
  message ? (
    <Alert message="Error" description={message} type="error" showIcon />
  ) : null

export const Login = () => {
  const history = useHistory()
  const queryParam = useQueryParam()
  const [errorMsg, setErrorMsg] = useState('')

  const next = queryParam.get('next')
  const afterSignup = !!queryParam.get('afterSignup')

  return (
    <div className="container">
      <Section>
        <div className="header">
          <Title level={2}>Login</Title>
          <Paragraph>
            or <Link to="/signup">Signup</Link>
          </Paragraph>
        </div>
        <SignupSuccessAlert show={afterSignup} />

        <Card>
          <ErrorAlert message={errorMsg} />

          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setErrors }) => {
              setErrorMsg('')

              try {
                await store.userStore.login(values)
                if (next) {
                  history.push(next)
                } else {
                  history.push('/')
                }
              } catch (e) {
                setErrorMsg(e.message)
                setErrors(e.errors)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form layout="vertical">
                <InputField
                  name="username"
                  placeholder="username"
                  label="Username"
                  type="text"
                  required
                />
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                  required
                />

                <Button htmlType="submit" type="primary" loading={isSubmitting}>
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </Section>
    </div>
  )
}
