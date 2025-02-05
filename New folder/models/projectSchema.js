import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        sellerName: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        projectName: {
            type: String,
            required: true,
        },
        propertyImage: {
            type: String,
        },
        descriptionImage: {
            type: String,
        },
        category: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Project = mongoose.model("Project", projectSchema);

export default Project