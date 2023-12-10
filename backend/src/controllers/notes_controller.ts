import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import Note from "../models/note";
import { assertIsDefined } from "../util/assertIsDefined";

export const index: RequestHandler = async (req, res, next) => {
    const authUserId = req.session.userId;
    try {
        assertIsDefined(authUserId);
        const notes = await Note.find({ userId: authUserId }).exec();
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
        if (!mongoose.isValidObjectId(id)) {
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
    text?: string,
    categoryId?: string
}

export const create: RequestHandler<unknown, unknown, CreateBody, unknown> = async (req, res, next) => {
    const { title, text, categoryId } = req.body;
    const authUserId = req.session.userId;
    let idCategory;
    try {
        assertIsDefined(authUserId);
        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }
        if (categoryId && !mongoose.isValidObjectId(categoryId)) {
            throw createHttpError(400, "Invalid category Id")
        }
        if (categoryId) {
            idCategory = new mongoose.Types.ObjectId(categoryId)
        }
        const note = await Note.create({
            title,
            text,
            categoryId: idCategory,
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
    text?: string,
    categoryId?: string
}

export const update: RequestHandler<UpdateParams, unknown, UpdateBody, unknown> = async (req, res, next) => {
    const { title, text, categoryId } = req.body;
    const id = req.params.id;
    const authUserId = req.session.userId;
    let idCategory;
    try {
        assertIsDefined(authUserId);
        if (!mongoose.isValidObjectId(id)) {
            throw createHttpError(400, "Invalid Id")
        }
        if (categoryId && !mongoose.isValidObjectId(categoryId)) {
            throw createHttpError(400, "Invalid category Id")
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
        if (categoryId) {
            idCategory = new mongoose.Types.ObjectId(categoryId)
        }

        note.title = title;
        note.text = text;
        note.categoryId = idCategory;
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
        if (!mongoose.isValidObjectId(id)) {
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

interface FilterNoteBody {
    categoryId?: string,
    title?: string,
}

export const filterNote: RequestHandler<unknown, unknown, FilterNoteBody, unknown> = async (req, res, next) => {
    const authUserId = req.session.userId;
    // eslint-disable-next-line prefer-const
    let query: FilterNoteBody = {};
    try {
        if (req.body.categoryId) {
            if (!mongoose.isValidObjectId(req.body.categoryId)) {
                throw createHttpError(400, "Invalid category Id")
            }
            query.categoryId = req.body.categoryId;
        }

        if (req.body.title) {
            query.title = req.body.title;
        }

        assertIsDefined(authUserId);
        const notes = await Note.find({ userId: authUserId, ...query }).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}