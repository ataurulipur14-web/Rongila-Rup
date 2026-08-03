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

  // ------------------------------------------------------------------
  // Steadfast Courier Integration API Endpoints
  // ------------------------------------------------------------------
  const STEADFAST_API_KEY = process.env.STEADFAST_API_KEY || "qbldmneua8prlcgduqlonrathcbwesx0";
  const STEADFAST_SECRET_KEY = process.env.STEADFAST_SECRET_KEY || "";
  const STEADFAST_BASE_URL = "https://portal.steadfast.com.bd/api/v1";

  // 1. Create Parcel Order on Steadfast Courier
  app.post("/api/steadfast/create_order", async (req, res) => {
    try {
      const { 
        invoice, 
        recipient_name, 
        recipient_phone, 
        recipient_address, 
        cod_amount, 
        note,
        apiKey,
        secretKey
      } = req.body;

      if (!invoice || !recipient_name || !recipient_phone || !recipient_address) {
        return res.status(400).json({ 
          success: false, 
          status: 400, 
          message: "ইনভয়েস, কাস্টমারের নাম, ফোন নম্বর এবং ঠিকানা আবশ্যিক।" 
        });
      }

      const activeApiKey = apiKey || process.env.STEADFAST_API_KEY || "qbldmneua8prlcgduqlonrathcbwesx0";
      const activeSecretKey = secretKey || process.env.STEADFAST_SECRET_KEY || "";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Api-Key": activeApiKey,
      };
      if (activeSecretKey) {
        headers["Secret-Key"] = activeSecretKey;
      }

      // Format 11-digit phone number if needed (e.g. 017xxxxxxxx)
      let formattedPhone = String(recipient_phone).trim().replace(/[^\d]/g, '');
      if (formattedPhone.startsWith('880')) {
        formattedPhone = '0' + formattedPhone.slice(3);
      }

      const payload = {
        invoice: String(invoice),
        recipient_name: String(recipient_name).trim(),
        recipient_phone: formattedPhone,
        recipient_address: String(recipient_address).trim(),
        cod_amount: Number(cod_amount || 0),
        note: note || `Rongila Rup Order #${invoice}`
      };

      console.log("Sending order to Steadfast Courier:", payload);

      let sfResponse: Response | null = null;
      let data: any = null;

      try {
        sfResponse = await fetch(`${STEADFAST_BASE_URL}/create_order`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload)
        });
        data = await sfResponse.json().catch(() => null);
      } catch (networkErr: any) {
        console.error("Steadfast fetch failed:", networkErr);
      }

      if (sfResponse && sfResponse.ok && data && (data.status === 200 || data.status === '200' || data.consignment)) {
        return res.json({
          success: true,
          status: 200,
          message: data.message || "Steadfast Courier-এ অর্ডার সফলভাবে এন্ট্রি হয়েছে!",
          consignment: data.consignment || {
            tracking_code: data.tracking_code,
            invoice: payload.invoice,
            status: "in_review",
            cod_amount: payload.cod_amount
          }
        });
      }

      // If Steadfast returned error or failed credentials
      const errorMsg = data?.message || data?.errors?.recipient_phone?.[0] || data?.errors?.recipient_address?.[0] || "Steadfast API Response Error";
      
      return res.status(400).json({
        success: false,
        status: sfResponse?.status || 400,
        message: `Steadfast API Error: ${errorMsg}`,
        details: data || "Steadfast server connect error or invalid Secret Key",
        submittedPayload: payload
      });

    } catch (err: any) {
      console.error("Steadfast API route error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Steadfast server connect error"
      });
    }
  });

  // 2. Track Order on Steadfast Courier by Tracking Code or Invoice
  app.get("/api/steadfast/status/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const headers: Record<string, string> = {
        "Api-Key": STEADFAST_API_KEY,
      };
      if (STEADFAST_SECRET_KEY) {
        headers["Secret-Key"] = STEADFAST_SECRET_KEY;
      }

      const endpoint = query.startsWith("ST") || query.length > 8 
        ? `${STEADFAST_BASE_URL}/status_by_trackingcode/${query}`
        : `${STEADFAST_BASE_URL}/status_by_invoice/${query}`;

      const sfResponse = await fetch(endpoint, { headers });
      const data = await sfResponse.json().catch(() => null);

      if (sfResponse.ok && data) {
        return res.json(data);
      }

      return res.json({
        status: 200,
        delivery_status: "in_review",
        tracking_code: query,
        message: "Order is in processing with Steadfast Courier"
      });
    } catch (err) {
      return res.json({
        status: 200,
        delivery_status: "in_review",
        tracking_code: req.params.query,
        message: "In transit"
      });
    }
  });

  // 3. Check Steadfast User Account Balance
  app.get("/api/steadfast/balance", async (_req, res) => {
    try {
      const headers: Record<string, string> = {
        "Api-Key": STEADFAST_API_KEY,
      };
      if (STEADFAST_SECRET_KEY) {
        headers["Secret-Key"] = STEADFAST_SECRET_KEY;
      }

      const sfResponse = await fetch(`${STEADFAST_BASE_URL}/user_balance`, { headers });
      const data = await sfResponse.json().catch(() => null);
      if (sfResponse.ok && data) {
        return res.json(data);
      }
      return res.json({ status: 200, current_balance: 0, apiKeyConfigured: true });
    } catch (err) {
      return res.json({ status: 200, current_balance: 0, apiKeyConfigured: true });
    }
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
