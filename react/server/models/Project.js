import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      minlength: 12,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 30,
    },
    category: {
      type: String,
      trim: true,
      default: "Projet",
    },
    year: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{4}$/,
    },
    status: {
      type: String,
      trim: true,
      default: "Nouveau",
    },
    coverTone: {
      type: String,
      trim: true,
      default: "ocean",
    },
    imageKey: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    technologies: {
      type: [String],
      default: [],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0;
        },
        message: "Ajoutez au moins une technologie.",
      },
    },
    highlights: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },
    demoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(_document, returnedValue) {
        returnedValue.id = returnedValue._id.toString();
        delete returnedValue._id;
        return returnedValue;
      },
    },
  },
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
