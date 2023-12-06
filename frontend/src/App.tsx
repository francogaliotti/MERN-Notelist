import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { LoginModal } from './components/LoginModal';
import { NavBar } from './components/NavBar';
import { NotesPageLoggedInView } from './components/NotesPageLoggedInView';
import { NotesPageLoggedOutView } from './components/NotesPageLoggedOutView';
import { SignUpModal } from './components/SignUpModal';
import { User } from './models/user';
import { getLoggedInUser } from './network/notes_api';
import styles from "./styles/NotesPage.module.css";

function App() {

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    async function fetchLoggedUser(){
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
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onSignUpClicked={() => { setShowSignUpModal(true) }}
        onLoginClicked={() => { setShowLoginModal(true) }}
        onLogOutSuccessful={() => { setLoggedInUser(null) }}
      />
      <Container className={styles.notesPage}>
        <>
          {
            loggedInUser ?
            <NotesPageLoggedInView /> :
            <NotesPageLoggedOutView />
          }
        </>
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
  );
}

export default App;
