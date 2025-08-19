import { Schema, Types, model } from "mongoose"

export interface IProblem {
  number: number
  title: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  status?: "To Do" | "Solved" | "Reviewing"
  dateSolved?: string
  approaches?: {
    title: string
    description: string
    code: string
    language: string
  }[]
  notes?: string
  link?: string
  user: Types.ObjectId
}

const ProblemSchema = new Schema<IProblem>({
  number: { type: Number, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ["To Do", "Solved", "Reviewing"], default: "To Do" },
  dateSolved: { type: String },
  approaches: [
    {
      title: String,
      description: String,
      code: String,
      language: String,
    },
  ],
  notes: String,
  link: String,
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true })

export const Problem = model<IProblem>("Problem", ProblemSchema)
