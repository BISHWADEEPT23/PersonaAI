import express from "express";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// Initialize Firebase Admin
initializeApp();

const app = express();
const PORT = 3000;

// Top-Level Request Deserialization (Ordering Guarantee)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Gemini
let secretManagerClient: SecretManagerServiceClient | null = null;
async function getGeminiApiKey(): Promise<string> {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  
  if (!secretManagerClient) {
    secretManagerClient = new SecretManagerServiceClient();
  }
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
    if (!projectId) throw new Error("No Project ID found");
    
    const name = `projects/${projectId}/secrets/GEMINI_API_KEY/versions/latest`;
    const [version] = await secretManagerClient.accessSecretVersion({ name });
    const payload = version.payload?.data?.toString();
    if (payload) {
      process.env.GEMINI_API_KEY = payload;
      return payload;
    }
  } catch (error) {
    console.error("Failed to fetch GEMINI_API_KEY from Secret Manager:", error);
  }
  throw new Error("GEMINI_API_KEY is not set and could not be fetched from Secret Manager");
}

let ai: GoogleGenAI | null = null;
async function getGeminiClient() {
  if (!ai) {
    const apiKey = await getGeminiApiKey();
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

const REFLECTION_SCHEMA = {
  type: "OBJECT",
  properties: {
    transcribed_text: { type: "STRING" },
    dominant_mood: { type: "STRING" },
    lenses: {
      type: "OBJECT",
      properties: {
        stoic: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            subtitle: { type: "STRING" },
            reflection: { type: "STRING" },
            micro_anchor: { type: "STRING" }
          },
          required: ["title", "subtitle", "reflection", "micro_anchor"]
        },
        compassion: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            subtitle: { type: "STRING" },
            reflection: { type: "STRING" },
            micro_anchor: { type: "STRING" }
          },
          required: ["title", "subtitle", "reflection", "micro_anchor"]
        },
        temporal: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            subtitle: { type: "STRING" },
            reflection: { type: "STRING" },
            micro_anchor: { type: "STRING" }
          },
          required: ["title", "subtitle", "reflection", "micro_anchor"]
        },
        somatic_offramp: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            subtitle: { type: "STRING" },
            reflection: { type: "STRING" },
            micro_anchor: { type: "STRING" }
          },
          required: ["title", "subtitle", "reflection", "micro_anchor"]
        }
      },
      required: ["stoic", "compassion", "temporal", "somatic_offramp"]
    }
  },
  required: ["transcribed_text", "dominant_mood", "lenses"]
};

// Auth Middleware
async function verifyToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing Bearer token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

// API Routes
async function generateContentWithFallback(contents: any[], config: any) {
  const models = ["gemini-3.6-flash", "gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.7-flash"];
  const aiClient = await getGeminiClient();
  let lastError = null;

  for (const model of models) {
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents,
        config
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err.message);
      lastError = err;
      // If error is unrecoverable (e.g. invalid key), we might throw immediately,
      // but for resilience we'll try the next model.
    }
  }
  throw lastError || new Error("All fallback models failed.");
}


async function reverse_geocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "PersonaAI-Sanctuary/1.0" },
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.suburb;
      const country = addr.country;
      return city && country ? `${city}, ${country}` : (city || country || "Near Sanctuary");
    }
  } catch (e) {
    console.error("Reverse geocoding failed", e);
  }
  return "Private Sanctuary";
}

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/reflect", verifyToken, upload.array("file"), async (req, res) => {
  try {
    const text = req.body.entry_text || "";
    const cognitiveState = req.body.mood || "";
    
    if (!text && (!req.files || req.files.length === 0)) {
      res.status(400).json({ error: "Missing input content or media." });
      return;
    }

    const parts: any[] = [];
    if (text) {
      parts.push({ text: `User Note: ${text}` });
    }
    if (cognitiveState) {
      parts.push({ text: `Declared Cognitive State: ${cognitiveState}` });
    }

    let lat: number | undefined;
    let lng: number | undefined;
    if (req.body.latitude && req.body.longitude) {
      lat = parseFloat(req.body.latitude);
      lng = parseFloat(req.body.longitude);
    }

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        parts.push({
          inlineData: {
            mimeType: file.mimetype,
            data: file.buffer.toString("base64")
          }
        });
      }
    }

    const systemInstruction = `You are PersonaAI, an ambient, non-judgmental behavioral reflection partner.
Directives:
1. Accurately transcribe any uploaded audio memos or handwritten notebook photos.
2. If location coordinates are provided, identify 1-2 real, quiet nearby parks, public gardens, or pedestrian walking paths.
3. Ground the reflection into four structured lenses:
   - stoic: The Silent Observer (Agency vs External chaos)
   - compassion: The Kindred Embrace (Universal shared humanity)
   - temporal: The Distant Horizon (5-year zoom out)
   - somatic_offramp: The Grounded Reset (A physical micro-anchor, incorporating the nearby quiet walking location if available).
Output strictly valid JSON matching the schema:
{
  "transcribed_text": "High-fidelity transcription of handwriting, or the user's text if no media is provided.",
  "lenses": {
    "stoic": {
      "title": "The Silent Observer",
      "reflection": "Reflection based on dichotomy of control.",
      "inquiry_prompt": "A probing stoic question.",
      "micro_anchor": "Actionable physical-world off-ramp."
    },
    "compassion": {
      "title": "The Kindred Embrace",
      "reflection": "Reflection based on universal humanity.",
      "inquiry_prompt": "A probing compassionate question.",
      "micro_anchor": "Actionable physical-world off-ramp."
    },
    "temporal": {
      "title": "The Distant Horizon",
      "reflection": "Reflection based on a 5-year perspective.",
      "inquiry_prompt": "A probing temporal question.",
      "micro_anchor": "Actionable physical-world off-ramp."
    },
    "somatic": {
      "title": "The Grounded Reset",
      "reflection": "Reflection based on physical grounding.",
      "inquiry_prompt": "A probing somatic question.",
      "micro_anchor": "Actionable physical-world off-ramp."
    }
  }
}`;

    const config: any = {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: REFLECTION_SCHEMA
    };
    
    if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
      config.tools = [{ googleMaps: {} }];
      config.toolConfig = {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      };
    }

    const response = await generateContentWithFallback(
      [{ role: "user", parts }],
      config
    );

    const resultText = response.text || "{}";
    const analysis = JSON.parse(resultText);

    let location_payload = null;
    let place_name = "Desk / Offline";
    if (lat !== undefined && lng !== undefined) {
      place_name = await reverse_geocode(lat, lng);
      location_payload = {
        latitude: lat,
        longitude: lng,
        source: req.body.loc_source || "device_gps",
        place_name: place_name
      };
    }

    const uid = (req as any).user.uid;
    const createdAt = req.body.createdAt ? parseInt(req.body.createdAt) : Date.now();
    const hasMedia = (req.files && Array.isArray(req.files) && req.files.length > 0);

    const clean_payload = JSON.parse(JSON.stringify({
      userId: uid,
      content: text,
      cognitiveState: cognitiveState,
      locationContext: place_name,
      location: location_payload,
      hasMedia: hasMedia,
      imageUrl: req.body.image_url,
      audioUrl: req.body.audio_url,
      analysis: analysis,
      createdAt: createdAt
    }));

    // Write document to user partition
    const db = getFirestore();
    const docRef = db.collection("users").doc(uid).collection("interactions").doc();
    await docRef.set(clean_payload);

    // Return formatted as requested:
    res.json({
      status: "success",
      id: docRef.id,
      data: Object.assign({}, clean_payload, { lenses: analysis })
    });


  } catch (error: any) {
    console.error("Reflect API Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze interaction." });
  }
});

app.post("/api/gemini/analyze", verifyToken, async (req, res) => {
  try {
    // Defensive Payload Ingestion
    const data = (req.body && typeof req.body === 'object') ? req.body : {};
    const text = typeof data.text === 'string' ? data.text : "";
    const cognitiveState = typeof data.cognitiveState === 'string' ? data.cognitiveState : "";
    const media = Array.isArray(data.media) ? data.media : [];

    if (!text && media.length === 0) {
      res.status(400).json({ error: "Missing input content or media." });
      return;
    }

    const parts: any[] = [];
    if (text) {
      parts.push({ text: `User Note: ${text}` });
    }
    if (cognitiveState) {
      parts.push({ text: `Declared Cognitive State: ${cognitiveState}` });
    }
    
    // Add location context if available
    const locationContext = data.locationContext || "";
    if (locationContext) {
       parts.push({ text: `User Location Context: ${locationContext}` });
    }
    
    // Attempt to extract lat/lng from location context if it looks like coordinates
    let lat: number | undefined;
    let lng: number | undefined;
    if (locationContext && typeof locationContext === 'string' && locationContext.includes(',')) {
       const [latStr, lngStr] = locationContext.split(',');
       const parsedLat = parseFloat(latStr.trim());
       const parsedLng = parseFloat(lngStr.trim());
       if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
           lat = parsedLat;
           lng = parsedLng;
       }
    }

    for (const m of media) {
      if (m && m.mimeType && m.data) {
        // Strip the data:image/png;base64, prefix if present
        const base64Data = m.data.includes(',') ? m.data.split(',')[1] : m.data;
        parts.push({
          inlineData: {
            mimeType: m.mimeType,
            data: base64Data
          }
        });
      }
    }

    const systemInstruction = `You are PersonaAI, an ambient, non-judgmental behavioral reflection partner.
Directives:
1. Accurately transcribe any uploaded audio memos or handwritten notebook photos.
2. If location coordinates are provided, identify 1-2 real, quiet nearby parks, public gardens, or pedestrian walking paths.
3. Ground the reflection into four structured lenses:
   - stoic: The Silent Observer (Agency vs External chaos)
   - compassion: The Kindred Embrace (Universal shared humanity)
   - temporal: The Distant Horizon (5-year zoom out)
   - somatic_offramp: The Grounded Reset (A physical micro-anchor, incorporating the nearby quiet walking location if available).
Output strictly valid JSON matching the schema:
{
  "transcribed_text": "High-fidelity transcription of handwriting, or the user's text if no media is provided.",
  "lenses": {
    "stoic": {
      "title": "The Silent Observer",
      "reflection": "Reflection based on dichotomy of control.",
      "inquiry_prompt": "A probing stoic question.",
      "micro_anchor": "Actionable physical-world off-ramp."
    },
    "compassion": {
      "title": "The Kindred Embrace",
      "reflection": "Reflection based on universal humanity.",
      "inquiry_prompt": "A probing compassionate question.",
      "micro_anchor": "Actionable physical-world off-ramp."
    },
    "temporal": {
      "title": "The Distant Horizon",
      "reflection": "Reflection based on a 5-year perspective.",
      "inquiry_prompt": "A probing temporal question.",
      "micro_anchor": "Actionable physical-world off-ramp."
    },
    "somatic": {
      "title": "The Grounded Reset",
      "reflection": "Reflection based on physical grounding.",
      "inquiry_prompt": "A probing somatic question.",
      "micro_anchor": "Actionable physical-world off-ramp."
    }
  }
}`;

    const config: any = {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: REFLECTION_SCHEMA
    };

    // Add Google Maps grounding if coordinates are present
    if (lat !== undefined && lng !== undefined) {
      config.tools = [{ googleMaps: {} }];
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      };
    }

    const response = await generateContentWithFallback(
      [{ role: "user", parts }],
      config
    );

    const resultText = response.text || "{}";
    const analysis = JSON.parse(resultText);
    res.json(analysis);

  } catch (error: any) {
    console.error("Gemini Analyze API Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze interaction." });
  }
});

app.post("/api/gemini/chat", verifyToken, async (req, res) => {
  try {
    const aiClient = await getGeminiClient();
    const { message, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.role, // 'user' or 'model'
      parts: [{ text: msg.content }]
    }));

    const response = await generateContentWithFallback(
      [
        ...formattedHistory,
        {
          role: "user",
          parts: [{ text: message }]
        }
      ],
      {
        systemInstruction: "You are a helpful and thoughtful journaling assistant. You help the user reflect on their day, brainstorm ideas, or summarize thoughts. Keep responses concise and insightful."
      }
    );

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate content" });
  }
});

app.post("/api/gemini/summarize", verifyToken, async (req, res) => {
  try {
    const aiClient = await getGeminiClient();
    const { history } = req.body;

    if (!history || history.length === 0) {
      res.status(400).json({ error: "History is required for summarization" });
      return;
    }

    const formattedHistory = history.map((msg: any) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`).join('\n\n');

    const response = await generateContentWithFallback(
      [
        {
          role: "user",
          parts: [{ text: `Based on the following journal conversation, generate a short, insightful title (max 5 words) and a brief 2-3 sentence summary reflecting the main thoughts or mood. Return the result strictly as a JSON object with "title" and "summary" keys.\n\nConversation:\n${formattedHistory}` }]
        }
      ],
      {
        responseMimeType: "application/json"
      }
    );

    const resultText = response.text;
    const json = JSON.parse(resultText);
    res.json(json);
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to summarize content" });
  }
});

// Slack Integration Webhook
app.post("/api/integrations/slack", verifyToken, async (req: express.Request, res: express.Response) => {
  const { nudge, lens_type = "somatic" } = req.body;

  const slack_webhook = process.env.SLACK_WEBHOOK_URL;
  if (!slack_webhook) {
    res.json({ status: "mocked", message: "Slack webhook URL not set in environment" });
    return;
  }

  const payload = {
    text: `🌿 *PersonaAI ${lens_type.charAt(0).toUpperCase() + lens_type.slice(1)} Off-Ramp*\n>${nudge}\n_Take 10 minutes to step away from the screen._`
  };

  try {
    const response = await fetch(slack_webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    res.json({ status: "delivered", code: response.status });
  } catch (error) {
    console.error("Slack integration error:", error);
    res.status(500).json({ error: "Failed to deliver Slack nudge" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
