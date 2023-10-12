import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import { Note } from './components/Note';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import { fetchNotes } from './network/notes_api';
import { AddNoteDialog } from './components/AddNoteDialog';

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState<boolean>(false)

  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await fetchNotes();
        setNotes(notes);
      } catch (error) {
        console.log(error)
      }
      
    }
    loadNotes();
  },[])

  return (
    <Container>
      <Button 
        onClick={() => setShowAddNoteDialog(true)}  
        className={`mb-4 ${styleUtils.blockCenter}`}  
      >
        Add new note
      </Button>
      <Row xs={1} md={2} xl={3} className='g-4'>
        {notes.map((note) => (
          <Col>
            <Note note={note} className={ styles.note }/>
          </Col>
        ))}
      </Row>
      { showAddNoteDialog &&
        <AddNoteDialog 
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote: NoteModel) => {
            setNotes([...notes, newNote])
            setShowAddNoteDialog(false);
          }}
        />
      }
    </Container>
  );
}

export default App;
