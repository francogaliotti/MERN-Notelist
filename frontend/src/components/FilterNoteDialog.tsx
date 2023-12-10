import { Button, Modal, Form } from "react-bootstrap"
import { Category } from "../models/category"
import { useForm } from "react-hook-form"
import { TextInputField } from "./forms/TextInputField"
import { SelectField } from "./forms/SelectField"
import { FilterNoteObject, filterNotes } from "../network/notes_api"
import { Note } from "../models/note"

interface FilterNoteDialogProps {
    onDismiss: () => void,
    onFilterNote: (notes: Note[]) => void,
    categories: Category[],
}

const FilterNoteDialog = ({ onDismiss, onFilterNote, categories }: FilterNoteDialogProps) => {
    
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<FilterNoteObject>();

    async function onSubmit(input: FilterNoteObject) {
        try {
            console.log(input);
            const response = await filterNotes(input);
            onFilterNote(response);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Filter Notes
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form id="filterNotesForm" onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name='title'
                        label='Title'
                        register={register}
                        type='text'
                        placeholder='Enter title'
                    />
                    <SelectField
                        name='categoryId'
                        label='Category'
                        register={register}
                        options={categories}
                        setValue={()=>{}}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type='submit'
                    form="filterNotesForm"
                    disabled={isSubmitting}
                >Filter</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FilterNoteDialog