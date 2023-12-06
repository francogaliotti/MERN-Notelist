import { Form } from 'react-bootstrap'
import { FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form'

interface TextInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

export const TextInputField = ({ name, label, register, registerOptions, error, ...props }: TextInputFieldProps) => {
    return (
        <Form.Group controlId={name + "-input"} className='mb-3'>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                {...props}
                {...register(name, registerOptions)}
                isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
                {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
    )
}
