import { model, Schema } from "mongoose";

const SubjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

export default model("Subject", SubjectSchema);