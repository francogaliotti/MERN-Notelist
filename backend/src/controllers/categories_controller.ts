import { RequestHandler } from "express";
import Category from "../models/category";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const index: RequestHandler = async (req, res, next) => {
    try {
        const categories = await Category.find().exec();
        res.status(200).json(categories);
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
        const category = await Category.findById(id).exec();
        if (!category) {
            throw createHttpError(404, "Category not found");
        }
        res.status(200).json(category)
    } catch (error) {
        next(error)
    }
}

interface CreateBody {
    name?: string,
}

export const create: RequestHandler<unknown, unknown, CreateBody, unknown> = async (req, res, next) => {
    const { name } = req.body;
    try {
        if (!name) {
            throw createHttpError(400, "Category must have a title");
        }
        const category = await Category.create({
            name,
        });
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
}

interface UpdateParams {
    id: string
}

interface UpdateBody {
    name?: string,
}

export const update: RequestHandler<UpdateParams, unknown, UpdateBody, unknown> = async (req, res, next) => {
    const id = req.params.id;
    const { name } = req.body;
    try {
        if (!mongoose.isValidObjectId(id)){
            throw createHttpError(400, "Invalid Id")
        }
        const category = await Category.findByIdAndUpdate(id, {
            name,
        }, { new: true }).exec();
        if (!category) {
            throw createHttpError(404, "Category not found");
        }
        res.status(200).json(category);
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
        const category = await Category.findByIdAndDelete(id).exec();
        if (!category) {
            throw createHttpError(404, "Category not found");
        }
        res.status(200).json(category);
    } catch (error) {
        next(error);
    }
}