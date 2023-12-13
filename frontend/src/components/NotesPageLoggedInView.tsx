import { useState, useEffect } from 'react';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { Note as NoteModel } from '../models/note';
import { Note } from './Note';
import styles from "../styles/NotesPage.module.css";
import styleUtils from "../styles/utils.module.css";
import { fetchNotes, deleteNote as apiDeleteNote, fetchCategories } from '../network/notes_api';
import { AddEditNoteDialog } from './AddEditNoteDialog';
import { FaPlus, FaSearch } from "react-icons/fa";
import { Category } from '../models/category';
import FilterNoteDialog from './FilterNoteDialog';
import { useTranslation } from 'react-i18next';


export const NotesPageLoggedInView = () => {

    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [showAddNoteDialog, setShowAddNoteDialog] = useState<boolean>(false)
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);
    const [notesLoading, setNotesLoading] = useState<boolean>(false);
    const [showNotesLoadingError, setShowNotesLoadingError] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showFilterNoteDialog, setShowFilterNoteDialog] = useState<boolean>(false);

    const { t } = useTranslation("global")

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
        async function loadCategories() {
            try {
                const categories = await fetchCategories();
                setCategories(categories);
            } catch (error) {
                console.log(error)
            }
        }
        loadNotes();
        loadCategories();
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
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.notesGrid}`}>
            {notes.map((note) => {
                const categoryName = categories.find(category => category._id === note.categoryId)?.name;
                return (<Col>
                    <Note
                        note={note}
                        categoryName={categoryName}
                        className={styles.note}
                        onDeleteNoteClicked={deleteNote}
                        onNoteClicked={setNoteToEdit}
                    />
                </Col>
                )
            })}
        </Row>
    return (
        <>
            <div className="d-flex gap-2">
                <Button
                    onClick={() => setShowAddNoteDialog(true)}
                    className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                >
                    <FaPlus />
                    {t("buttons.add_new_note")}
                </Button>
                <Button
                    onClick={() => setShowFilterNoteDialog(true)}
                    className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                >
                    <FaSearch />
                    {t("buttons.filter_notes")}
                </Button>
            </div>
            {notesLoading && <Spinner animation='border' variant='primary' />}
            {showNotesLoadingError && <div>Failed to load notes</div>}
            {!notesLoading && !showNotesLoadingError &&
                <>
                    {notes.length > 0 ? notesGrid : <div>No notes to show</div>}
                </>
            }
            {showAddNoteDialog &&
                <AddEditNoteDialog
                    categories={categories}
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
                    categories={categories}
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onNoteSaved={(updatedNote: NoteModel) => {
                        setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
                        setNoteToEdit(null);
                    }}
                />
            }
            {
                showFilterNoteDialog &&
                <FilterNoteDialog
                    categories={categories}
                    onDismiss={() => setShowFilterNoteDialog(false)}
                    onFilterNote={(notes: NoteModel[]) => {
                        setShowFilterNoteDialog(false)
                        setNotes(notes);
                    }}
                />
            }
        </>
    )
}
