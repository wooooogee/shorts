import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 토픽별 스마트 Fallback 데이터 (API 실패 또는 키 미설정 시 완벽 동작 보장)
function getFallbackIdea(topic: string) {
  const cleanTopic = topic || "시니어 맞춤형 콘텐츠";
  const isBizTopic = cleanTopic.includes("매출") || cleanTopic.includes("마케팅") || cleanTopic.includes("절세") || cleanTopic.includes("고객") || cleanTopic.includes("소상공인") || cleanTopic.includes("직원") || cleanTopic.includes("단골") || cleanTopic.includes("창업");

  if (isBizTopic) {
    return {
      title: `${cleanTopic} (매출 2배 뛰는 실전 노하우)`,
      topic: cleanTopic,
      tags: ["자영업꿀팁", "매출상승", "매장관리"],
      script: "사장님들 주목! 매장 매출을 즉시 끌어올리는 실전 꿀팁 3가지를 알려드립니다. 지금 바로 적용해보세요.",
      visuals: "A bustling modern cafe with happy customers and a smiling owner, professional bright lighting, cinematic photography",
      bgm: "경쾌하고 활기찬 어쿠스틱 기타 곡",
      scenes: [
        { scene_no: 1, narration: "사장님들! 요즘 매장 운영하시기 참 힘드시죠?", visual_prompt: "A passionate small business owner looking at the camera in a neat store, bright lighting" },
        { scene_no: 2, narration: "오늘 알려드리는 이 방법 하나면 단골 손님이 2배로 늘어납니다.", visual_prompt: "Holding a shining secret marketing book, cinematic style" },
        { scene_no: 3, narration: "작은 변화가 큰 매출을 만듭니다. 오늘 바로 시작해보세요!", visual_prompt: "A crowded store with happy customers paying at the counter, dynamic angle" }
      ]
    };
  }

  return {
    title: `${cleanTopic} (API 연동 안내)`,
    topic: cleanTopic,
    tags: ["API연동필요", "설정안내"],
    script: "AI API 키가 설정되지 않았거나 호출에 실패했습니다. 상단의 'API 키 및 연동 설정' 탭에서 유효한 Gemini API 키를 입력하시면 AI가 즉시 매력적인 훅과 대본을 기획합니다.",
    visuals: "깔끔하고 모던한 사무실에서 컴퓨터를 조작하는 전문 컨설턴트, professional clean atmosphere",
    bgm: "차분하고 신뢰감을 주는 피아노 연주곡",
    scenes: [
      { scene_no: 1, narration: "안녕하세요. 여러분의 시니어 라이프 파트너입니다.", visual_prompt: "A friendly senior lifestyle partner greeting the camera, bright lighting" },
      { scene_no: 2, narration: "오늘은 아주 특별한 정보를 준비했습니다.", visual_prompt: "Holding a shining info card, cinematic style" },
      { scene_no: 3, narration: "지금 바로 시작해볼까요?", visual_prompt: "Walking towards a modern studio, dynamic angle" }
    ]
  };
}

export async function POST(request: Request) {
  try {
    const { topic, sceneCount = 4, apiKeys } = await request.json();
    const apiKey = apiKeys?.geminiKey?.trim() || process.env.GEMINI_API_KEY || "";

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const isBizTopic = topic.includes("매출") || topic.includes("마케팅") || topic.includes("절세") || topic.includes("고객") || topic.includes("소상공인") || topic.includes("직원") || topic.includes("단골") || topic.includes("창업");
        const targetAudience = isBizTopic ? "소상공인 및 자영업자" : "시니어(60대 이상)";
        const producerRole = isBizTopic ? "대한민국 자영업자 및 소상공인의 매출을 올려주는 실전 마케팅/매장관리 전문 유튜브 쇼츠 프로듀서" : "시니어(60대 이상) 대상의 전문 유튜브 쇼츠 프로듀서";

        const prompt = `당신은 ${producerRole}입니다.
타깃 시청자: ${targetAudience}
주제: "${topic}"

[요구사항]
1. 토큰 절약을 위해 핵심만 간결하게 작성하세요.
2. 타깃 시청자(${targetAudience})가 즉시 공감하고 실전에 적용할 수 있는 구체적이고 매력적인 훅(Hook)과 꿀팁을 제공하세요.
3. 대본(script)과 씬별 내레이션은 전체를 아우르는 자연스러운 한국어 경어체로 작성하세요.
4. visuals 필드는 전체 숏폼의 썸네일에 어울리는 대표 이미지 프롬프트를 영어로 묘사하세요.
5. 장면(scenes)은 정확히 ${sceneCount}개로 나누어, 각 장면별 대사와 이미지 생성용 프롬프트(영어)를 명확히 분리하세요. 일관된 스타일(예: "Pixar 3d style", "cinematic photography")을 프롬프트 끝에 붙여 일괄성을 유지하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "눈길을 사로잡는 숏폼 제목",
  "topic": "${topic}",
  "tags": ["태그1", "태그2", "태그3"],
  "script": "전체 자막 및 내레이션 대본 (자연스러운 말투)",
  "visuals": "썸네일용 대표 이미지 시각적 연출 묘사 (영어)",
  "bgm": "어울리는 배경음악 설명",
  "scenes": [
    {
      "scene_no": 1,
      "narration": "씬 1의 내레이션 대사",
      "visual_prompt": "씬 1의 이미지 생성용 프롬프트 (영어)"
    },
    {
      "scene_no": 2,
      "narration": "씬 2의 내레이션 대사",
      "visual_prompt": "씬 2의 이미지 생성용 프롬프트 (영어)"
    }
  ]
}`;

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        });

        const text = result.response.text();
        if (text) {
          const cleanText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleanText);
          return NextResponse.json(parsed);
        }
      } catch (err) {
        console.error("Generate Idea Gemini Error, using fallback:", err);
      }
    }

    // API 키가 없거나 호출 실패 시 스마트 Fallback 반환
    const fallbackData = getFallbackIdea(topic);
    return NextResponse.json(fallbackData);

  } catch (error: any) {
    console.error("Generate Idea Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

