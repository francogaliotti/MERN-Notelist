import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        next(createHttpError(401, "User is not authenticated"));
    }
}