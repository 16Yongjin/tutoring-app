import React, { InputHTMLAttributes } from 'react'
import { Form, Input } from 'antd'
import { useField } from 'formik'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  textarea?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props)
  return (
    <Form.Item label={label} validateStatus={error ? 'error' : ''} help={error}>
      <Input {...field} {...props} id={field.name} />
    </Form.Item>
  )
}
