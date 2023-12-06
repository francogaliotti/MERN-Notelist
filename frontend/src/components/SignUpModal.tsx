import { User } from "../models/user"
import { useForm } from "react-hook-form"
import { SignUpCredentials, signUp } from "../network/notes_api"
import { Button, Form, Modal } from "react-bootstrap";
import { TextInputField } from "./forms/TextInputField";
import styleUtils from "../styles/utils.module.css";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

export const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<SignUpCredentials>();
    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    }
    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                        name='email'
                        label='Email'
                        register={register}
                        registerOptions={{required: "Email is required"}}
                        error={errors.email}
                        type='email'
                        placeholder='Enter email'
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
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>
            </Modal>
    )
}
