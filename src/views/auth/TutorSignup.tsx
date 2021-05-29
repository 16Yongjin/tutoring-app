import { useState } from 'react'
import { Button, Typography, Card } from 'antd'
import { Form, Select } from 'formik-antd'
import { Formik } from 'formik'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import * as api from '../../api'
import { InputField } from '../../components/form/InputField'
import * as Yup from 'yup'
import { Gender } from '../../api/auth/entity'
import { ErrorAlert } from '../../components/common'

const { Title, Paragraph } = Typography

const Section = styled.section`
  max-width: 400px;
  margin: 0 auto;

  .header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
`

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
  image: Yup.string().max(1000, 'Too Long!'),
  gender: Yup.mixed<Gender>().oneOf(Object.values(Gender)),
})

export const TutorSignup = () => {
  const history = useHistory()
  const [errorMsg, setErrorMsg] = useState('')

  return (
    <Section className="section">
      <div className="container">
        <div className="header">
          <Title level={2}>Tutor Signup</Title>
          <Paragraph>
            or <Link to="/tutors/login">Login</Link>
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
              image: '',
              gender: Gender.MALE,
            }}
            onSubmit={async (values, { setErrors }) => {
              setErrorMsg('')

              try {
                await api.auth.tutorSignup(values)
                history.push('/tutors/login?afterSignup=1')
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
                <InputField
                  name="image"
                  placeholder="image"
                  label="image Url"
                />

                <Form.Item name="gender" label="Gender">
                  <Select name="gender">
                    {Object.values(Gender).map((gender) => (
                      <Select.Option value={gender}>{gender}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Button htmlType="submit" type="primary" loading={isSubmitting}>
                  Signup
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </Section>
  )
}
