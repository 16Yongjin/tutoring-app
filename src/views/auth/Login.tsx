import React, { useState } from 'react'
import { Alert, Card } from 'antd'
import { Form, Input, InputNumber, Checkbox } from 'formik-antd'
import { Button, Typography } from 'antd'
import { Form as FormikForm, Formik } from 'formik'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import * as api from '../../api'
import { InputField } from '../../components/form/InputField'
import { store } from '../../store'
import * as Yup from 'yup'
import { useIsAuth } from '../../utils/auth/useIsAuth'

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

const ErrorAlert = ({ message }: { message: string }) =>
  message ? (
    <Alert message="Error" description={message} type="error" showIcon />
  ) : null

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
})

export const Login = () => {
  const history = useHistory()
  const { next } = useParams<{ next: string | undefined }>()
  const [errorMsg, setErrorMsg] = useState('')

  return (
    <div className="container">
      <Section>
        <div className="header">
          <Title level={2}>Login</Title>
          <Paragraph>
            or <Link to="/signup">Signup</Link>
          </Paragraph>
        </div>
        <Card>
          <ErrorAlert message={errorMsg} />

          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setErrors }) => {
              setErrorMsg('')

              try {
                await store.userStore.login(values)
                if (typeof next === 'string') {
                  history.push(next)
                } else {
                  history.push('/')
                }
              } catch (e) {
                setErrorMsg(e.response.data.message)
                setErrors(e.response.data.errors)
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
