// models/WorkflowRun.js
import mongoose from "mongoose";

const WorkflowRunSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  action: { type: String, required: true }, // weather | github | news
  ai_response: { type: String, default: "" },
  api_response: { type: String, default: "" },
  final_result: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.WorkflowRun || mongoose.model("WorkflowRun", WorkflowRunSchema);
