import { RequestHandler } from "express";
import Note from "../models/note";

export const index: RequestHandler = async (req, res, next) => {
    try {
        const notes = await Note.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

export const show: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    try {
        const note = await Note.findById(id).exec();
        res.status(200).json(note)
    } catch (error) {
        next(error)
    }
}

export const create: RequestHandler = async (req, res, next) => {
    const { title, text } = req.body;
    try {
        const note = await Note.create({
            title,
            text
        });
        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
}