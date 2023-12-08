import { useForm } from "react-hook-form";
import { User } from "../models/user"
import { LoginCredentials, login } from "../network/notes_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { TextInputField } from "./forms/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { useState } from "react";
import { UnauthorizedError } from "../errors/http_errors";

interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void,
}

export const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
    const [errorText, setErrorText] = useState<string | null>(null);

    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const newUser = await login(credentials);
            onLoginSuccessful(newUser);
        } catch (error) {
            if(error instanceof UnauthorizedError){
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>Log In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorText && 
                    <Alert variant='danger'>
                        {errorText}
                    </Alert>   
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name='username'
                        label='Username'
                        register={register}
                        registerOptions={{required: "Username is required"}}
                        error={errors.username}
                        type='text'
                        placeholder='Enter username'
                    />
                    <TextInputField
                        name='password'
                        label='Password'
                        register={register}
                        registerOptions={{required: "Password is required"}}
                        error={errors.password}
                        type='password'
                        placeholder='Enter password'
                    />
                    <Button type='submit' disabled={isSubmitting} className={styleUtils.width100}>
                        Log In
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
