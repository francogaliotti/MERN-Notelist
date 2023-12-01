import { Note } from "../models/note";

async function fetchData(input: RequestInfo, init?: RequestInit){
    const response = await fetch(input, init);
    if(response.ok){
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = await errorBody.error;
        throw Error(errorMessage);
    }
}

export async function fetchNotes(): Promise<Note[]> {
    const res = await fetchData("/api/notes", {method: "GET"});
    return res.json();
}

export interface NoteInput {
    title: string,
    text?: string,
}

export async function createNote(note: NoteInput): Promise<Note> {
    const res = await fetchData("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    });
    return res.json();
}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const res = await fetchData(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(note)
    });
    return res.json();
}

export async function deleteNote(id: string): Promise<void> {
    await fetchData(`/api/notes/${id}`, {
        method: "DELETE"
    });
}