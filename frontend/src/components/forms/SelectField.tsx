import { useEffect } from 'react';
import { Form } from 'react-bootstrap'
import { FieldError, RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Option {
    _id: string,
    name: string,
}

interface SelectFieldProps {
    name: string,
    label: string,
    options: Option[],
    register: UseFormRegister<any>,
    registerOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any,
}

export const SelectField = ({ name, label, options, register, registerOptions, error, setValue, placeholder, ...props }: SelectFieldProps) => {

    useEffect(() => {
        setValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Form.Group controlId={name + "-select"} className='mb-3'>
            <Form.Label>{label}</Form.Label>
            <Form.Select
                {...props}
                {...register(name, registerOptions)}
                isInvalid={!!error}>
                <option value=''>{placeholder}</option>
                {options.map((option: Option) => (
                    <option key={option._id} value={option._id}>{option.name}</option>
                )
                )}
            </Form.Select>
        </Form.Group>
    )
}
