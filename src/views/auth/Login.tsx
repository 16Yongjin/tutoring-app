import React from 'react'
import { Card } from 'antd'
import { Form, Input, InputNumber, Checkbox } from 'formik-antd'
import { Button, Typography } from 'antd'
import { Form as FormikForm, Formik } from 'formik'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import * as api from '../../api'
import { InputField } from '../../components/form/InputField'
import { store } from '../../store'

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

export const Login = () => {
  const history = useHistory()
  const { next } = useParams<{ next: string | undefined }>()

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
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={async (values, { setErrors }) => {
              const response = await api.auth.login(values)
              if (response.errors) {
                setErrors(response.errors)
              } else if (response.token) {
                return console.log('token', response.token)

                // if (typeof next === 'string') {
                //   history.push(next)
                // } else {
                //   history.push('/')
                // }
              }
            }}
          >
            {({ isSubmitting, errors }) => (
              <Form layout="vertical">
                <Form.Item
                  name="username"
                  label="Username"
                  validateStatus={errors.username ? 'error' : ''}
                  help={errors.username}
                >
                  <Input name="username" />
                </Form.Item>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
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
