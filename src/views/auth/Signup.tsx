import { useState } from 'react'
import { Alert, Card } from 'antd'
import { Form } from 'formik-antd'
import { Button, Typography } from 'antd'
import { Formik } from 'formik'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import * as api from '../../api'
import { InputField } from '../../components/form/InputField'
import * as Yup from 'yup'

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

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(5, 'Too Short')
    .max(50, 'Too Long')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short')
    .max(100, 'Too Long')
    .required('Required'),
  fullname: Yup.string()
    .min(2, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Enter valid email').required('Required'),
})

export const Signup = () => {
  const history = useHistory()
  const [errorMsg, setErrorMsg] = useState('')

  return (
    <div className="container">
      <Section>
        <div className="header">
          <Title level={2}>Signup</Title>
          <Paragraph>
            or <Link to="/login">Login</Link>
          </Paragraph>
        </div>
        <Card>
          <ErrorAlert message={errorMsg} />

          <Formik
            validationSchema={SignupSchema}
            initialValues={{
              username: '',
              email: '',
              fullname: '',
              password: '',
              language: '',
            }}
            onSubmit={async (values, { setErrors }) => {
              setErrorMsg('')

              try {
                await api.auth.signup(values)
                history.push('/login?afterSignup=1')
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
                  name="fullname"
                  placeholder="fullname"
                  label="Fullname"
                  type="text"
                  required
                />
                <InputField
                  name="email"
                  placeholder="email"
                  label="Email"
                  type="email"
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
                  Signup
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </Section>
    </div>
  )
}
