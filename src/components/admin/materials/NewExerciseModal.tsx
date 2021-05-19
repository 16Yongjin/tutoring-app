import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'antd'
import { Formik } from 'formik'
import { Form, InputNumber } from 'formik-antd'
import { InputField } from '../../form/InputField'
import Modal from 'antd/lib/modal/Modal'
import * as api from '../../../api'
import { Course, Exercise } from '../../../api/materials/entity'

import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export const NewExerciseModal = ({
  course,
  exercise,
  show,
  onCancel,
}: {
  course: Course | null
  exercise: Exercise | null
  show: boolean
  onCancel: Function
}) => {
  const submitButton = useRef<HTMLButtonElement>(null)
  const submit = () => submitButton.current?.click()
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  /**
   * Exercise의 text 수동 업데이트
   */
  useEffect(() => {
    if (!exercise) return setEditorState(EditorState.createEmpty())

    const { contentBlocks, entityMap } = htmlToDraft(exercise.text)
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    )
    const editorState = EditorState.createWithContent(contentState)
    setEditorState(editorState)
  }, [exercise])

  return (
    <Modal
      title={exercise ? `연습문제 ${exercise.id} 수정` : '새 연습문제 추가'}
      visible={show}
      onOk={submit}
      onCancel={() => onCancel()}
      width="1000px"
    >
      <div>
        <Formik
          enableReinitialize
          initialValues={
            exercise ?? {
              title: 'new exercise',
              description: 'hi',
              text: '',
              index: 0,
              image: '',
            }
          }
          onSubmit={async (values, { setErrors }) => {
            values.text = draftToHtml(
              convertToRaw(editorState.getCurrentContent())
            )

            try {
              if (exercise)
                await api.materials.updateExercise({
                  ...values,
                  id: exercise.id,
                })
              else if (course)
                await api.materials.createExercise({
                  ...values,
                  courseId: course.id,
                })

              onCancel(true)
            } catch (e) {
              setErrors(e.errors)
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

              <Form.Item name="index" label="index">
                <InputNumber name="index" />
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
            </Form>
          )}
        </Formik>
        <Editor
          editorState={editorState}
          wrapperClassName="wrapperClassName"
          editorClassName="exercise-editor"
          onEditorStateChange={setEditorState}
        />

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
      </div>
    </Modal>
  )
}
