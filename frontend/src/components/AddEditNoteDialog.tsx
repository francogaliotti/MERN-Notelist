import { Button, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Category } from '../models/category'
import { Note } from '../models/note'
import { NoteInput, createNote, updateNote } from '../network/notes_api'
import { SelectField } from './forms/SelectField'
import { TextInputField } from './forms/TextInputField'
import { useTranslation } from 'react-i18next'

interface AddEditNoteDialogProps {
    noteToEdit?: Note,
    onDismiss: () => void,
    onNoteSaved: (note: Note) => void,
    categories: Category[],
}

export const AddEditNoteDialog = ({ noteToEdit, onDismiss, onNoteSaved, categories }: AddEditNoteDialogProps) => {

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<NoteInput>({
        defaultValues: {
            title: noteToEdit?.title || "",
            text: noteToEdit?.text || "",
            categoryId: noteToEdit?.categoryId || ""
        }
    });
    const {t} = useTranslation("global")

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
                    {noteToEdit ? t("note_actions.edit_note") : t("note_actions.add_note")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="addEditNoteForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name='title'
                        label={t("note.title")}
                        register={register}
                        registerOptions={{ required: "Title is required" }}
                        error={errors.title}
                        type='text'
                        placeholder={t("note_placeholders.title")}
                    />
                    <SelectField
                        name='categoryId'
                        label={t("note.category")}
                        register={register}
                        options={categories}
                        registerOptions={{ required: "Category is required" }}
                        error={errors.categoryId}
                        setValue={()=> setValue('categoryId', noteToEdit?.categoryId || "")}
                        placeholder={t("note_placeholders.category")}
                    />
                    <TextInputField
                        name='text'
                        label={t("note.text")}
                        register={register}
                        as='textarea'
                        rows={5}
                        placeholder={t("note_placeholders.text")}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type='submit'
                    form="addEditNoteForm"
                    disabled={isSubmitting}
                >{t("note_actions.save")}</Button>
            </Modal.Footer>
        </Modal>
    )
}
