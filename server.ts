import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", appName: "Rongila Rup" });
  });

  // AI Virtual Style Consultant Endpoint
  app.post("/api/ai/stylist", async (req, res) => {
    try {
      const { message, lang = 'bn', catalog = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (!ai) {
        // Fallback response if API key is not configured yet
        const fallbackText = lang === 'bn'
          ? "ধন্যবাদ! আপনার প্রশ্নের উত্তর দেওয়ার জন্য আমাদের স্টাইলিস্ট সিস্টেম প্রস্তুত হচ্ছে। আমাদের জামদানি শাড়ি ও রয়্যাল ব্লু পাঞ্জাবি কালেকশন দেখতে পারেন!"
          : "Thank you! Our AI stylist is initializing. Check out our Jamdani Sarees and Royal Blue Panjabis for festive elegance!";
        return res.json({
          reply: fallbackText,
          recommendedProductIds: ['rr-saree-001', 'rr-panjabi-001']
        });
      }

      const catalogSummary = catalog.map((item: any) => ({
        id: item.id,
        nameBn: item.nameBn,
        nameEn: item.nameEn,
        category: item.category,
        price: item.price,
        fabricBn: item.fabricBn,
        colorBn: item.colorBn
      }));

      const systemInstruction = `You are "রঙিলা রূপ AI স্টাইলিস্ট" (Rongila Rup AI Stylist), an expert fashion consultant for a high-end Bengali ethnic boutique store "Rongila Rup" (রঙিলা রূপ).
You speak fluent Bengali (বাংলা) and warm, friendly English.
Your goal is to suggest traditional Bengali outfits (Sarees like Jamdani, Kanjivaram, Tant, Panjabi, Jewelry, Anarkali) based on the user's occasion, color preference, budget, or gift requirement.

Available Catalog JSON:
${JSON.stringify(catalogSummary, null, 2)}

Instructions:
1. Respond in the language requested by the user or default to Bengali if user asked in Bengali.
2. Be warm, polite, and enthusiastic about Bengali culture, Boishakh, Eid, Durga Puja, weddings, Gaye Holud, and festive styling.
3. Recommend specific product IDs from the catalog that match the user's inquiry.
4. Output your answer strictly as a JSON object with two fields:
   - "reply": string (Your helpful advice and friendly style guide text formatted nicely with bullet points if helpful)
   - "recommendedProductIds": string[] (Array of matching product IDs from catalog like ["rr-saree-001", "rr-jewelry-001"])`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: message,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        }
      });

      const text = response.text || "{}";
      try {
        const parsed = JSON.parse(text);
        return res.json({
          reply: parsed.reply || text,
          recommendedProductIds: parsed.recommendedProductIds || []
        });
      } catch (parseErr) {
        return res.json({
          reply: text,
          recommendedProductIds: ['rr-saree-001', 'rr-panjabi-001']
        });
      }

    } catch (err: any) {
      console.error("Error in AI Stylist endpoint:", err);
      res.status(500).json({
        error: "Failed to generate AI advice",
        reply: "দুঃখিত, স্টাইলিস্ট রেসপন্স তৈরিতে একটি সাময়িক সমস্যা হয়েছে। আপনি অনুগ্রহ করে আমাদের সেরা বিক্রিত প্রোডাক্টগুলো দেখতে পারেন।"
      });
    }
  });

  // Track Order Simulation Endpoint
  app.post("/api/orders/track", (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: "Order ID required" });
    }

    const mockStatus = {
      orderId,
      status: "out_for_delivery",
      statusBn: "ডেলিভারির জন্য বের হয়েছে",
      courier: "Steadfast Courier / Pathao Express",
      trackingCode: `ST-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: "আজ বিকাল ৫:০০ টার মধ্যে",
      steps: [
        { label: "অর্ডার কনফার্মড", date: "অগাস্ট ১, ২০২৬", done: true },
        { label: "প্যাকিং সম্পন্ন", date: "অগাস্ট ২, ২০২৬ - সকাল ৯:০০", done: true },
        { label: "কুরিয়ারে হস্তান্তর", date: "অগাস্ট ২, ২০২৬ - দুপুর ১২:৩০", done: true },
        { label: "ডেলিভারি চলছে", date: "চলমান...", done: true },
        { label: "পণ্য গ্রহণ", date: "অপেক্ষমান", done: false },
      ]
    };

    return res.json(mockStatus);
  });

  // Vite middleware for development or Static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rongila Rup Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
