import React from 'react'
import { Note as NoteModel } from '../models/note'
import { Card } from "react-bootstrap"
import styles from "../styles/Note.module.css"
import { formatDate } from '../utils/formatDate'
import { MdDelete } from "react-icons/md"
import styleUtils from "./../styles/utils.module.css";


interface NoteProps {
    note: NoteModel,
    className?: string,
    onNoteClicked: (note: NoteModel) => void,
    onDeleteNoteClicked: (note: NoteModel) => void,
    categoryName?: string,
}

export const Note = ({ note, onNoteClicked, onDeleteNoteClicked, className, categoryName }: NoteProps) => {
    const { title, text, createdAt, updatedAt } = note;

    let createdUpdatedText: string;
    if (updatedAt > createdAt) {
        createdUpdatedText = "Updated: " + formatDate(updatedAt);
    } else {
        createdUpdatedText = "Created: " + formatDate(createdAt);
    }

    return (
        <Card
            className={`${styles.noteCard} ${className}`}
            onClick={(e) => onNoteClicked(note)}
        >
            <Card.Body className={styles.cardBody}>
                <Card.Title className={styleUtils.flexCenter}>
                    {title}
                    <MdDelete
                        className="text-muted ms-auto"
                        onClick={(e) => {
                            onDeleteNoteClicked(note);
                            e.stopPropagation();
                        }}
                    />
                </Card.Title>
                <Card.Subtitle
                    className={styles.cardSubtitle}>
                    {categoryName}
                </Card.Subtitle>
                <Card.Text
                    className={styles.cardText}>
                    {text}
                </Card.Text>
            </Card.Body>
            <Card.Footer className='text-muted'>
                {createdUpdatedText}
            </Card.Footer>
        </Card>
    )
}
