import React, { useRef } from 'react'
import { Button } from 'antd'
import { Formik } from 'formik'
import { Form, Slider } from 'formik-antd'
import { InputField } from '../../form/InputField'
import Modal from 'antd/lib/modal/Modal'
import * as api from '../../../api'
import { Course, Topic } from '../../../api/materials/entity'

export const NewCourseModal = ({
  topic,
  course,
  show,
  onCancel,
}: {
  topic: Topic | null
  course: Course | null
  show: boolean
  onCancel: Function
}) => {
  const submitButton = useRef<HTMLButtonElement>(null)
  const submit = () => submitButton.current?.click()

  return (
    <Modal
      centered
      title={course ? `강의 ${course.id} 수정` : '새 강의 추가'}
      visible={show}
      onOk={submit}
      onCancel={() => onCancel()}
    >
      <Formik
        enableReinitialize
        initialValues={
          course ?? {
            title: 'new course',
            description: 'hi',
            image: '',
            level: 1,
          }
        }
        onSubmit={async (values, { setErrors }) => {
          console.log(values)
          try {
            if (course)
              await api.materials.updateCourse({
                ...values,
                id: course.id,
              })
            else if (topic)
              await api.materials.createCourse({
                ...values,
                topicId: topic.id,
              })

            onCancel(true)
          } catch (e) {
            setErrors(e.response.data?.errors)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form layout="vertical">
            <InputField
              name="title"
              placeholder="title"
              label="title"
              type="title"
              required
            />
            <InputField
              name="description"
              placeholder="description"
              label="description"
              type="description"
              required
            />

            <Form.Item name="level" label="level">
              <Slider name="level" min={1} max={10} />
            </Form.Item>

            <Button
              style={{ display: 'none' }}
              ref={submitButton}
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
            >
              Submit
            </Button>

            {course ? (
              <Button
                onClick={async () => {
                  try {
                    // eslint-disable-next-line no-restricted-globals
                    if (confirm('삭제하시겠습니까?'))
                      await api.materials.deleteCourse(course.id)
                    onCancel(true)
                  } catch (e) {
                    console.log(e)
                  }
                }}
                type="primary"
                danger
              >
                삭제
              </Button>
            ) : null}
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
