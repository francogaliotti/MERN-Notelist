import { RequestHandler } from "express";
import createHttpError from "http-errors";
import User from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUser = req.session.userId;
    try {
        if (!authenticatedUser) {
            throw createHttpError(401, "Not authenticated");
        }
        const user = await User.findById(authenticatedUser).select("+email").exec();
        res.json(user);
    } catch (error) {
        next(error);
    }
}

interface SignUpBody {
    username?: string;
    password?: string;
    email?: string;
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const { username, email } = req.body;
    const passwordRaw = req.body.password;
    try {
        if (!username || !passwordRaw || !email) {
            throw createHttpError(400, "Missing required fields");
        }
        const existingUsername = await User.findOne({ username: username }).exec();
        const existingEmail = await User.findOne({ email: email }).exec();
        if (existingUsername) {
            throw createHttpError(409, "Username already exists");
        }
        if (existingEmail) {
            throw createHttpError(409, "Email already exists");
        }
        const passwordHashed = await bcrypt.hash(passwordRaw, 10);
        const user = await User.create({
            username,
            password: passwordHashed,
            email
        });
        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

interface LoginBody {
    username?: string;
    password?: string;
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const {username, password} = req.body;
    try {
        if (!username || !password) {
            throw createHttpError(400, "Missing required fields");
        }
        const user = await User.findOne({username: username}).select("+password +email").exec();
        if (!user) {
            throw createHttpError(401, "Invalid username or password");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw createHttpError(401, "Invalid username or password");
        }
        req.session.userId = user._id;
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export const logout: RequestHandler = async (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
}
