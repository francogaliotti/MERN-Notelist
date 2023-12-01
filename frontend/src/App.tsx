import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Button } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import { Note } from './components/Note';
import styles from "./styles/NotesPage.module.css";
import styleUtils from "./styles/utils.module.css";
import { fetchNotes, deleteNote as apiDeleteNote } from './network/notes_api';
import { AddEditNoteDialog } from './components/AddEditNoteDialog';
import { FaPlus } from "react-icons/fa";

function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState<boolean>(false)
  const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

  useEffect(() => {
    async function loadNotes() {
      try {
        const notes = await fetchNotes();
        setNotes(notes.reverse());
      } catch (error) {
        console.log(error)
      }

    }
    loadNotes();
  }, [])

  async function deleteNote(note: NoteModel) {
    try {
      await apiDeleteNote(note._id);
      setNotes(notes.filter(existingNote => existingNote._id !== note._id));
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Button
        onClick={() => setShowAddNoteDialog(true)}
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      >
        <FaPlus />
        Add new note
      </Button>
      <Row xs={1} md={2} xl={3} className='g-4'>
        {notes.map((note) => (
          <Col>
            <Note
              note={note}
              className={styles.note}
              onDeleteNoteClicked={deleteNote}
              onNoteClicked={setNoteToEdit}
            />
          </Col>
        ))}
      </Row>
      {showAddNoteDialog &&
        <AddEditNoteDialog
          onDismiss={() => setShowAddNoteDialog(false)}
          onNoteSaved={(newNote: NoteModel) => {
            setNotes([newNote, ...notes])
            setShowAddNoteDialog(false);
          }}
        />
      }
      {
        noteToEdit &&
        <AddEditNoteDialog
          noteToEdit={noteToEdit}
          onDismiss={() => setNoteToEdit(null)}
          onNoteSaved={(updatedNote: NoteModel) => {
            setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
            setNoteToEdit(null);
          }}
        />
      }
    </Container>
  );
}

export default App;
