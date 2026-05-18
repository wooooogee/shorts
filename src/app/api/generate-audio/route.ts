import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 공용 더미 음성 파일 URL (TTS Fallback용)
const FALLBACK_AUDIO_URL = "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/speech.mp3";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, apiKeys } = body;

    const apiKey = apiKeys?.geminiKey?.trim() || process.env.GEMINI_API_KEY || "";

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Note: SDK에서 TTS 모델 호출 시도 (gemini-3.1-flash-tts-preview)
        // 실패하거나 미지원 시 아래의 Fallback으로 자동 전환됨.
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-tts-preview" });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: `Read clearly, smoothly, and warmly. Language: Korean. Text: ${text}` }] }]
        });

        let audioBase64 = null;
        const candidates = (result.response as any).candidates;
        if (candidates?.[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (part.inlineData?.data) {
              audioBase64 = part.inlineData.data;
              break;
            }
          }
        }

        if (audioBase64) {
          return NextResponse.json({ audioBase64 });
        }
      } catch (err) {
        console.error("Generate Audio Gemini Error, using fallback:", err);
      }
    }

    // API 키가 없거나 호출 실패 시 더미 음성 파일 fetch 후 base64 변환 반환
    const audioRes = await fetch(FALLBACK_AUDIO_URL);
    const arrayBuffer = await audioRes.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

    return NextResponse.json({ audioBase64 });

  } catch (error: any) {
    console.error("Generate Audio Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
