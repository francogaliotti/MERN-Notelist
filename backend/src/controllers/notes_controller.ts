import { RequestHandler } from "express";
import Note from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

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
        if (!mongoose.isValidObjectId(id)){
            throw createHttpError(400, "Invalid Id")
        }
        const note = await Note.findById(id).exec();
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        res.status(200).json(note)
    } catch (error) {
        next(error)
    }
}

interface CreateBody {
    title?: string,
    text?: string
}

export const create: RequestHandler<unknown, unknown, CreateBody, unknown> = async (req, res, next) => {
    const { title, text } = req.body;
    try {
        if (!title) {
            throw createHttpError(400, "Note must have a title")
        }
        const note = await Note.create({
            title,
            text
        });
        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
}

interface UpdateParams {
    id: string
}

interface UpdateBody {
    title?: string,
    text?: string
}

export const update: RequestHandler<UpdateParams, unknown, UpdateBody, unknown> = async(req, res, next) => {
    const { title, text } = req.body;
    const id = req.params.id;
    try {
        if (!mongoose.isValidObjectId(id)){
            throw createHttpError(400, "Invalid Id")
        }
        if (!title) {
            throw createHttpError(400, "Note must have a title")
        }
        const note = await Note.findById(id).exec();
        if (!note) {
            throw createHttpError(404, "Note not found");
        }

        note.title = title;
        note.text = text
        
        const newNote = await note.save();
        res.status(200).json(newNote);
    } catch (error) {
        next(error);
    }
}

export const destroy: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (!mongoose.isValidObjectId(id)){
            throw createHttpError(400, "Invalid Id")
        }
        const note = await Note.findById(id).exec();
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        await note.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}