import { InferSchemaType, Schema, model } from "mongoose";

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

type Category = InferSchemaType<typeof categorySchema>;

export default model<Category>("Category", categorySchema);