import { Button, Navbar } from "react-bootstrap";
import { User } from "../models/user"
import { logout as apiLogout } from "../network/notes_api"

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}
export const NavBarLoggedInView = ({ user, onLogoutSuccessful }: NavBarLoggedInViewProps) => {

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
                Signed as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>Log Out</Button>
        </>
    )
}
