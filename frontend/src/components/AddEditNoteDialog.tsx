import { Button, Form, Modal } from 'react-bootstrap'
import { Note } from '../models/note'
import { useForm } from 'react-hook-form'
import { NoteInput, createNote, updateNote } from '../network/notes_api'
import { TextInputField } from './forms/TextInputField'

interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void
}

export const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved }: AddEditNoteDialogProps) => {

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || ""
        }
    });

    async function onSubmit(input: NoteInput) {
        try {
            let noteResponse: Note;
            if (noteToEdit) {
                noteResponse = await updateNote(noteToEdit._id, input);
            } else {
                noteResponse = await createNote(input);
            }
            onNoteSaved(noteResponse);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {noteToEdit ? "Edit Note" : "Add Note"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name='title'
                        label='Title'
                        register={register}
                        registerOptions={{ required: "Title is required" }}
                        error={errors.title}
                        type='text'
                        placeholder='Enter title'
                    />
                    <TextInputField
                        name='text'
                        label='Text'
                        register={register}
                        as='textarea'
                        rows={5}
                        placeholder='Enter text'
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type='submit'
                    form="addEditNoteForm"
                    disabled={isSubmitting}
                >Save</Button>
            </Modal.Footer>
        </Modal>
    )
}
