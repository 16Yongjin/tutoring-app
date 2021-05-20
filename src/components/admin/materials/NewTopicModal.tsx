import React, { useRef } from 'react'
import { Button } from 'antd'
import { Formik } from 'formik'
import { Form } from 'formik-antd'
import { InputField } from '../../form/InputField'
import Modal from 'antd/lib/modal/Modal'
import * as api from '../../../api'
import { Material, Topic } from '../../../api/materials/entity'

export const NewTopicModal = ({
  material,
  topic,
  show,
  onCancel,
}: {
  material: Material | null
  topic: Topic | null
  show: boolean
  onCancel: Function
}) => {
  const submitButton = useRef<HTMLButtonElement>(null)
  const submit = () => submitButton.current?.click()

  return (
    <Modal
      centered
      title={topic ? `토픽 ${topic.id} 수정` : '새 토픽 추가'}
      visible={show}
      onOk={submit}
      onCancel={() => onCancel()}
    >
      <Formik
        enableReinitialize
        initialValues={
          topic ?? {
            title: 'new topic',
            description: 'hi',
          }
        }
        onSubmit={async (values, { setErrors }) => {
          console.log(values)
          try {
            if (topic)
              await api.materials.updateTopic({
                ...values,
                id: topic.id,
              })
            else if (material)
              await api.materials.createTopic({
                ...values,
                materialId: material.id,
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

            <Button
              style={{ display: 'none' }}
              ref={submitButton}
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
            >
              Submit
            </Button>

            {topic ? (
              <Button
                onClick={async () => {
                  try {
                    // eslint-disable-next-line no-restricted-globals
                    if (confirm('삭제하시겠습니까?'))
                      await api.materials.deleteTopic(topic.id)
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
