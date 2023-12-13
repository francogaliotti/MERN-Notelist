import { User } from "../models/user"
import { useForm } from "react-hook-form"
import { SignUpCredentials, signUp } from "../network/notes_api"
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { TextInputField } from "./forms/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { useState } from "react";
import { ConflictError } from "../errors/http_errors";
import { useTranslation } from "react-i18next";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

export const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);

    const {t} = useTranslation("global")

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();
    async function onSubmit(credentials: SignUpCredentials) {
        try {
            const newUser = await signUp(credentials);
            onSignUpSuccessful(newUser);
        } catch (error) {
            if(error instanceof ConflictError){
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
                <Modal.Title>{t("auth_actions.sign_up")}</Modal.Title>
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
                        label={t("user_attributes.username")}
                        register={register}
                        registerOptions={{ required: t("user_errors.username") }}
                        error={errors.username}
                        type='text'
                        placeholder={t("user_placeholders.username")}
                    />
                    <TextInputField
                        name='email'
                        label={t("user_attributes.email")}
                        register={register}
                        registerOptions={{ required: t("user_errors.email") }}
                        error={errors.email}
                        type='email'
                        placeholder={t("user_placeholders.email")}
                    />
                    <TextInputField
                        name='password'
                        label={t("user_attributes.password")}
                        register={register}
                        registerOptions={{ required: t("user_errors.password") }}
                        error={errors.password}
                        type='password'
                        placeholder={t("user_errors.password")}
                    />
                    <Button type='submit' disabled={isSubmitting} className={styleUtils.width100}>
                        {t("auth_actions.sign_up")}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
