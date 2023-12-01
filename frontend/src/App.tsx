import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Button, Spinner } from 'react-bootstrap';
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
  const [notesLoading, setNotesLoading] = useState<boolean>(false);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState<boolean>(false);

  useEffect(() => {
    async function loadNotes() {
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await fetchNotes();
        setNotes(notes.reverse());
      } catch (error) {
        console.log(error)
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
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

  const notesGrid =
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
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

  return (
    <Container className={styles.notesPage}>
      <Button
        onClick={() => setShowAddNoteDialog(true)}
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      >
        <FaPlus />
        Add new note
      </Button>
      {notesLoading && <Spinner animation='border' variant='primary' />}
      {showNotesLoadingError && <div>Failed to load notes</div>}
      {!notesLoading && !showNotesLoadingError && 
        <>
          { notes.length > 0 ? notesGrid : <div>No notes to show</div>}
        </>
      }
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
