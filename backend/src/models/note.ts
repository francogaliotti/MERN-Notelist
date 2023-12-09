import { InferSchemaType, Schema, model } from "mongoose";

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
    }
}, { timestamps: true });

type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);