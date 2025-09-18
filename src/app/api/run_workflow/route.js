// app/api/run-workflow/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import WorkflowRun from "@/models/WorkFlowRun";

const DEFAULT_CITY = process.env.DEFAULT_CITY || "Delhi,India";

/** Helper: call OpenAI (Chat Completion). Falls back to mock if key missing or USE_MOCK_AI=true */
async function callOpenAI(prompt) {
    const useMock = process.env.USE_MOCK_AI === "true" || !process.env.OPENAI_API_KEY;
    if (useMock) {
        // Keep it short (tweet-sized). Deterministic-ish mock.
        const short = prompt.length > 80 ? prompt.slice(0, 77) + "..." : prompt;
        return `Quick thought: ${short}`;
    }

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const endpoint = "https://openrouter.ai/api/v1/chat/completions";
    const body = {
        model: "mistralai/mistral-small-3.2-24b-instruct:free", // replace with your preferred model
        messages: [
            { role: "system", content: "You are a concise assistant. Produces tweet-sized outputs (<= 20 words)." },
            { role: "user", content: `Write a short tweet based on: ${prompt}` },
        ],
        max_tokens: 60,
        temperature: 0.7,
    };

    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`OpenAI error: ${res.status} ${text}`);
    }

    const json = await res.json();
    // Path to message depends on response format
    let msg = json?.choices?.[0]?.message?.content ?? json?.choices?.[0]?.text ?? "";
    msg = msg.replace(/```json/g, "").replace(/```/g, "").trim();
    return msg.trim();
}

/** Weather: OpenWeatherMap */
async function fetchWeather(location) {
    const key = process.env.WEATHER_API_KEY;
    const city = location && location.trim() !== "" ? location.trim() : DEFAULT_CITY;

    if (!key) {
        return `Weather data unavailable (OPENWEATHER_API_KEY missing).`;
    }

    const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`;
    // const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        return j?.message || `Weather fetch failed with status ${res.status}`;
    }
    const j = await res.json();
    // console.log(j);
    const desc = j?.current?.condition?.text ?? "Weather";
    const temp = Math.round(j?.current?.temp_c ?? 0);
    const name = j?.name ?? city;
    return `${capitalize(desc)} in ${name}, ${temp}°C`;
}

/** GitHub: trending approximation using search API (repos created in last 7 days by stars) */
async function fetchGithubTrending() {
    const token = process.env.GITHUB_TOKEN;
    // approximate trending by repos created in last 7 days with most stars
    const d = new Date();
    d.setDate(d.getDate() - 7);
    const since = d.toISOString().slice(0, 10);
    const q = `created:>${since}`;
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=5`;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(url, { headers });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        return `GitHub fetch failed: ${res.status} ${text}`;
    }

    const j = await res.json();
    const items = j.items || [];
    if (!items.length) return "No trending repos found.";
    const top = items.slice(0, 3).map(it => `${it.full_name} (${it.stargazers_count}★)`).join(", ");
    return `Trending: ${top}`;
}

/** News: top headline using NewsAPI */
async function fetchNews() {
    const key = process.env.NEWSAPI_KEY;
    if (!key) return "News API key missing";
    const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=3&apiKey=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        return j?.message || `News fetch failed: ${res.status}`;
    }
    const j = await res.json();
    const articles = j.articles || [];
    if (!articles.length) return "No top headlines found";
    const top = articles[0];
    return `${top.title} — ${top.source?.name ?? "source"}`;
}

function capitalize(s = "") {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Main POST handler */
export async function POST(req) {
    try {
        const body = await req.json();
        const { prompt, action, location } = body || {};

        if (!prompt || !action) {
            return NextResponse.json({ error: "prompt and action are required" }, { status: 400 });
        }

        // Connect DB early
        await dbConnect();

        // Create initial DB record with pending status (so run is traceable)
        const initial = await WorkflowRun.create({
            prompt,
            action,
            ai_response: "",
            api_response: "",
            final_result: "",
            created_at: new Date(),
        });

        // Step 1: AI Agent 
        let ai_response;
        try {
            ai_response = await callOpenAI(prompt);
        } catch (aiErr) {
            console.error("AI error:", aiErr);
            ai_response = `AI error: ${aiErr.message}`;
        }

        // Step 2: Third-party API call
        let api_response = "";
        try {
            if (action === "weather") {
                api_response = await fetchWeather(location);
            } else if (action === "github") {
                api_response = await fetchGithubTrending();
            } else if (action === "news") {
                api_response = await fetchNews();
            } else {
                api_response = `Unknown action "${action}". Supported: weather, github, news.`;
            }
        } catch (apiErr) {
            console.error("Third-party API error:", apiErr);
            api_response = `API error: ${apiErr.message}`;
        }

        // Step 3: Combine
        const hashtag = action === "weather" ? "#weather" : action === "github" ? "#opensource" : "#news";
        // trim responses to avoid huge payloads
        const ai_trim = ai_response?.trim?.() ?? "";
        const api_trim = api_response?.trim?.() ?? "";
        const final_result = `${ai_trim} ${api_trim} ${hashtag}`.trim();

        // Step 4: Save results to DB (update record)
        await WorkflowRun.findByIdAndUpdate(initial._id, {
            ai_response: ai_trim,
            api_response: api_trim,
            final_result,
        }, { new: true });

        // Return the composed result
        return NextResponse.json({ ai_response: ai_trim, api_response: api_trim, final_result }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
    }
}
