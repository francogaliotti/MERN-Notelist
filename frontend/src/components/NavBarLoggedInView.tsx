import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user";
import { logout as apiLogout } from "../network/notes_api";
import { useTranslation } from "react-i18next";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}
export const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {
    const {t} = useTranslation("global")

    async function logout() {
        try {
            await apiLogout();
            onLogoutSuccessful();
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
            <Navbar.Text>
                {user.username}
            </Navbar.Text>
            <Button onClick={logout}>{t("auth_actions.logout")}</Button>
        </>
    )
}
