import { RequestHandler } from "express";
import Note from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const index: RequestHandler = async (req, res, next) => {
    const authUserId = req.session.userId;
    try {
        assertIsDefined(authUserId);
        const notes = await Note.find({userId: authUserId}).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

export const show: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    const authUserId = req.session.userId;
    try {
        assertIsDefined(authUserId);
        if (!mongoose.isValidObjectId(id)){
            throw createHttpError(400, "Invalid Id")
        }
        const note = await Note.findById(id).exec();
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        if (!note.userId.equals(authUserId)) {
            throw createHttpError(401, "User is not authorized to access this note");
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
    const authUserId = req.session.userId;
    try {
        assertIsDefined(authUserId);
        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }
        const note = await Note.create({
            title,
            text,
            userId: authUserId
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
    const authUserId = req.session.userId;
    try {
        assertIsDefined(authUserId);
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
        if (!note.userId.equals(authUserId)) {
            throw createHttpError(401, "User is not authorized to access this note");
        }

        note.title = title;
        note.text = text;
        note.userId = authUserId;
        
        const newNote = await note.save();
        res.status(200).json(newNote);
    } catch (error) {
        next(error);
    }
}

export const destroy: RequestHandler = async (req, res, next) => {
    const id = req.params.id;
    const authUserId = req.session.userId;
    try {
        assertIsDefined(authUserId);
        if (!mongoose.isValidObjectId(id)){
            throw createHttpError(400, "Invalid Id")
        }
        const note = await Note.findById(id).exec();
        if (!note) {
            throw createHttpError(404, "Note not found");
        }
        if (!note.userId.equals(authUserId)) {
            throw createHttpError(401, "User is not authorized to delete this note");
        }
        await note.deleteOne();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}