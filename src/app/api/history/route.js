// app/api/history/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import WorkflowRun from "@/models/WorkFlowRun";

export async function GET() {
    try {
        await dbConnect();
        const runs = await WorkflowRun.find({})
            .sort({ created_at: -1 })
            .limit(10)
            .select("-__v")
            .lean();
        return NextResponse.json({ total: runs.length, runs }, { status: 200 });
    } catch (err) {
        console.error("History error:", err);
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}
