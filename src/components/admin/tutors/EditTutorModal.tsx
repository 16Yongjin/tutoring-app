import React, { useRef } from 'react'
import { Button } from 'antd'
import { Tutor } from '../../../api/tutors/entity'
import { Formik } from 'formik'
import { Form, Select } from 'formik-antd'
import { InputField } from '../../form/InputField'
import Modal from 'antd/lib/modal/Modal'
import * as api from '../../../api'
import { Gender } from '../../../api/auth/entity'

export const EditTutorModal = ({
  tutor,
  show,
  onCancel,
}: {
  tutor: Tutor | null
  show: boolean
  onCancel: Function
}) => {
  const submitButton = useRef<HTMLButtonElement>(null)
  const submit = () => submitButton.current?.click()
  const acceptTutor = (tutorId: number) => {
    api.auth.acceptTutor({ tutorId })
    onCancel(true)
  }

  return (
    <Modal
      centered
      title={tutor ? `튜터 ${tutor.id} 수정` : '새 튜터 추가'}
      visible={show}
      onOk={submit}
      onCancel={() => onCancel()}
    >
      {tutor ? (
        <Formik
          enableReinitialize
          initialValues={{ ...tutor }}
          onSubmit={async (values, { setErrors }) => {
            const { email, role, ...body } = values
            try {
              await api.tutors.updateTutor(body)
              onCancel(true)
            } catch (e) {
              console.dir(e)
              setErrors(e.errors)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form layout="vertical">
              <InputField
                name="username"
                placeholder="username"
                label="username"
                type="username"
                disabled
                required
              />
              <InputField
                name="email"
                placeholder="email"
                label="email"
                type="email"
                disabled
                required
              />
              <InputField
                name="fullname"
                placeholder="fullname"
                label="fullname"
                type="fullname"
                required
              />
              <InputField
                name="image"
                placeholder="image url"
                label="image"
                type="text"
                required
              />

              <InputField
                name="presentation"
                placeholder="presentation"
                label="presentation"
                type="presentation"
              />

              <Form.Item name="gender" label="Gender">
                <Select name="gender">
                  {Object.values(Gender).map((gender) => (
                    <Select.Option key={gender} value={gender}>
                      {gender}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <div>이메일 인증: {tutor.verified ? 'O' : 'X'}</div>
              <div>관리자 승인: {tutor.accepted ? 'O' : 'X'}</div>

              {!tutor.accepted ? (
                <Button onClick={() => acceptTutor(tutor.id)}>승인하기</Button>
              ) : null}

              <Button
                style={{ display: 'none' }}
                ref={submitButton}
                htmlType="submit"
                loading={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      ) : null}
    </Modal>
  )
}
