import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API 실패 또는 키 미설정 시 제공되는 고품질 Fallback 뉴스 풀 (랜덤 셔플용)
const FALLBACK_NEWS_POOL = [
  { topic: "[안내] AI 뉴스 서치 기능을 위해 Gemini API 키를 설정해주세요", source: "시스템 안내", summary: "상단 'API 키 및 연동 설정' 탭에서 키를 입력하시면 최신 트렌드를 AI가 자동 큐레이션합니다." }
];

// 배열 랜덤 셔플 헬퍼
function shuffleArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function POST(request: Request) {
  try {
    const { topic = "최신 동향", count = 5, apiKeys } = await request.json();
    const today = new Date().toISOString().split('T')[0];
    const apiKey = apiKeys?.geminiKey?.trim() || process.env.GEMINI_API_KEY || "";

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `당신은 시니어(6070) 타깃 전문 콘텐츠 큐레이터입니다.
오늘 날짜(${today}) 기준으로 시니어들에게 가장 인기가 높고 실용적인 최신 뉴스, 정부 복지 정책, 생활/건강 트렌드 ${count}개를 발굴하여 JSON 형식으로 작성해 주세요.

[요구사항]
1. topic 필드는 눈에 띄게 대괄호 카테고리([정책], [건강], [경제], [디지털], [취미] 등)를 붙여 작성하세요.
2. summary 필드는 핵심 내용을 1~2줄로 요약하세요.
3. source 필드는 신뢰할 수 있는 출처명(예: 보건복지부, 건강보험공단, 질병관리청 등)을 적어주세요.

반드시 아래 JSON 구조로만 반환하세요:
[
  { "topic": "[정책] 2026년 기초연금 40만원 인상 및 자격 완화", "source": "보건복지부", "status": "Ready", "date": "${today}", "summary": "단독가구 기준 월 소득인정액 250만원 이하 대상 기초연금 인상 안내" }
]`;

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8 }
        });

        const text = result.response.text();
        if (text) {
          const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleanText);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return NextResponse.json({ success: true, data: parsed, isRealApi: true });
          }
        }
      } catch (err) {
        console.error("Search News Gemini Error, using fallback:", err);
      }
    }

    // API 키가 없거나 호출 실패 시 Fallback 풀을 랜덤 셔플하여 동적 느낌 제공
    const shuffled = shuffleArray(FALLBACK_NEWS_POOL).slice(0, 5);
    const fallbackData = shuffled.map((item, idx) => ({
      ...item,
      status: "Ready",
      date: today
    }));

    return NextResponse.json({ success: true, data: fallbackData, isRealApi: false });

  } catch (error: any) {
    console.error("Search News Route Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
