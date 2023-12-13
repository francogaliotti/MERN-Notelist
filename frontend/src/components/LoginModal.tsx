import { useForm } from "react-hook-form";
import { User } from "../models/user"
import { LoginCredentials, login } from "../network/notes_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { TextInputField } from "./forms/TextInputField";
import styleUtils from "../styles/utils.module.css";
import { useState } from "react";
import { UnauthorizedError } from "../errors/http_errors";
import { useTranslation } from "react-i18next";

interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void,
}

export const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
    const [errorText, setErrorText] = useState<string | null>(null);

    const { t } = useTranslation("global")

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const newUser = await login(credentials);
            onLoginSuccessful(newUser);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
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
                <Modal.Title>{t("auth_actions.login")}</Modal.Title>
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
                        name='password'
                        label={t("user_attributes.password")}
                        register={register}
                        registerOptions={{ required: t("user_errors.password") }}
                        error={errors.password}
                        type='password'
                        placeholder={t("user_errors.password")}
                    />
                    <Button type='submit' disabled={isSubmitting} className={styleUtils.width100}>
                        {t("auth_actions.login")}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
