import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 시니어 타깃 고품질 실사 이미지 Fallback 목록
const SENIOR_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80"
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, apiKeys } = body;

    const apiKey = apiKeys?.geminiKey?.trim() || process.env.GEMINI_API_KEY || "";

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image-preview" });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: `Create a YouTube Shorts thumbnail or scene visual for senior audience. Context: ${prompt}` }] }]
        });

        let imageBase64 = null;
        const candidates = (result.response as any).candidates;
        if (candidates?.[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (part.inlineData?.data) {
              imageBase64 = part.inlineData.data;
              break;
            }
          }
        }

        if (imageBase64) {
          return NextResponse.json({ imageBase64 });
        }
      } catch (err) {
        console.error("Generate Image Gemini Error, using fallback:", err);
      }
    }

    // API 키가 없거나 호출 실패 시 고화질 시니어 이미지 URL 직접 반환 (엑박 방지)
    const randomUrl = SENIOR_IMAGE_URLS[Math.floor(Math.random() * SENIOR_IMAGE_URLS.length)];
    return NextResponse.json({ imageUrl: randomUrl });

  } catch (error: any) {
    console.error("Generate Image Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

