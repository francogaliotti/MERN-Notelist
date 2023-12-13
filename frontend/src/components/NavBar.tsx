import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap"
import { User } from "../models/user"
import { NavBarLoggedInView } from "./NavBarLoggedInView"
import { NavBarLoggedOutView } from "./NavBarLoggedOutView"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogOutSuccessful: () => void,
}

export const NavBar = ({ loggedInUser, onSignUpClicked, onLoginClicked, onLogOutSuccessful }: NavBarProps) => {

    const [t, i18 ]= useTranslation("global")

    const handleChangeLanguage = (lan: string) => {
        i18.changeLanguage(lan);
    }

    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">Notes App</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        <Nav.Link as={Link} to='/privacy'>
                            {t("others.privacy")}
                        </Nav.Link>
                        <NavDropdown title={t("languages.language")} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=>handleChangeLanguage("en")}>{t("languages.en")}</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>handleChangeLanguage("es")}>{t("languages.es")}</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="ms-auto">
                        {
                            loggedInUser ?
                                <NavBarLoggedInView user={loggedInUser} onLogoutSuccessful={onLogOutSuccessful} />
                                :
                                <NavBarLoggedOutView onSignUpClicked={onSignUpClicked} onLoginClicked={onLoginClicked} />
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>

        </Navbar>
    )
}
