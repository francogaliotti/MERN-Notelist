import { Container, Nav, Navbar } from "react-bootstrap"
import { User } from "../models/user"
import { NavBarLoggedInView } from "./NavBarLoggedInView"
import { NavBarLoggedOutView } from "./NavBarLoggedOutView"
import { Link } from "react-router-dom"

interface NavBarProps {
    loggedInUser: User | null,
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
    onLogOutSuccessful: () => void,
}

export const NavBar = ({ loggedInUser, onSignUpClicked, onLoginClicked, onLogOutSuccessful }: NavBarProps) => {
    return (
        <Navbar bg="primary" variant="dark" expand="sm" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/">Notes App</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        <Nav.Link as={Link} to='/privacy'>
                            Privacy
                        </Nav.Link>
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
