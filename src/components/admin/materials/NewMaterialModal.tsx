import React, { useRef } from 'react'
import { Button } from 'antd'
import { Material } from '../../../api/materials/entity'
import { Formik } from 'formik'
import { Form, Slider } from 'formik-antd'
import { InputField } from '../../form/InputField'
import Modal from 'antd/lib/modal/Modal'
import * as api from '../../../api'

export const NewMaterialModal = ({
  material,
  show,
  onCancel,
}: {
  material: Material | null
  show: boolean
  onCancel: Function
}) => {
  const submitButton = useRef<HTMLButtonElement>(null)
  const submit = () => submitButton.current?.click()

  return (
    <Modal
      centered
      title={material ? `교재 ${material.id} 수정` : '새 교재 추가'}
      visible={show}
      onOk={submit}
      onCancel={() => onCancel()}
    >
      <Formik
        enableReinitialize
        initialValues={
          material
            ? {
                ...material,
                levels: [material.levelStart, material.levelEnd],
              }
            : {
                image: 'https://via.placeholder.com/150',
                levels: [1, 10],
                levelStart: 1,
                levelEnd: 10,
                title: 'new material',
                description: 'hi',
              }
        }
        onSubmit={async (values, { setErrors }) => {
          values.levelStart = values.levels[0]
          values.levelEnd = values.levels[1]
          console.log(values)
          try {
            if (material)
              await api.materials.updateMaterial({
                ...values,
                id: material.id,
              })
            else await api.materials.createMaterial(values)
            onCancel(true)
          } catch (e) {
            setErrors(e.response.data?.errors)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form layout="vertical">
            <InputField
              name="image"
              placeholder="image url"
              label="image"
              type="text"
              required
            />
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

            <Form.Item name="levels" label="levels">
              <Slider
                name="levels"
                range
                min={1}
                max={10}
                defaultValue={[1, 10]}
              />
            </Form.Item>

            <Button
              style={{ display: 'none' }}
              ref={submitButton}
              htmlType="submit"
              type="primary"
              loading={isSubmitting}
            >
              Login
            </Button>

            {material && (
              <Button
                onClick={async () => {
                  try {
                    // eslint-disable-next-line no-restricted-globals
                    if (confirm('삭제하시겠습니까?'))
                      await api.materials.deleteMaterial(material.id)
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
            )}
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
