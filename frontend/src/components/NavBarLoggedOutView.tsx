import { Button } from "react-bootstrap"
import { useTranslation } from "react-i18next"

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

export const NavBarLoggedOutView = ({ onSignUpClicked, onLoginClicked }: NavBarLoggedOutViewProps) => {
  const {t} = useTranslation("global")
  return (
    <>
        <Button onClick={onSignUpClicked}>{t("auth_actions.sign_up")}</Button>
        <Button onClick={onLoginClicked}>{t("auth_actions.login")}</Button>
    </>
  )
}
