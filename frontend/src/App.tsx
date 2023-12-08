import { useEffect, useState } from 'react';
import { LoginModal } from './components/LoginModal';
import { NavBar } from './components/NavBar';
import { SignUpModal } from './components/SignUpModal';
import { User } from './models/user';
import { getLoggedInUser } from './network/notes_api';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { NotesPage } from './pages/NotesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import styles from "./styles/App.module.css"

function App() {

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    async function fetchLoggedUser() {
      try {
        const user = await getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onSignUpClicked={() => { setShowSignUpModal(true) }}
          onLoginClicked={() => { setShowLoginModal(true) }}
          onLogOutSuccessful={() => { setLoggedInUser(null) }}
        />
        <Container className={styles.pageContainer}>
          <Routes>
            <Route path="/" element={<NotesPage loggedInUser={loggedInUser} />} />
            <Route path='/privacy' element={<PrivacyPage/>} />
            <Route path='/*' element={<NotFoundPage/>} />
          </Routes>
        </Container>

        {
          showSignUpModal &&
          <SignUpModal
            onDismiss={() => { setShowSignUpModal(false) }}
            onSignUpSuccessful={(user) => {
              setLoggedInUser(user);
              setShowSignUpModal(false);
            }} />
        }
        {
          showLoginModal &&
          <LoginModal
            onDismiss={() => { setShowLoginModal(false) }}
            onLoginSuccessful={(user) => {
              setLoggedInUser(user);
              setShowLoginModal(false);
            }} />
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
