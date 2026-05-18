import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 토픽별 스마트 Fallback 데이터 (API 실패 또는 키 미설정 시 완벽 동작 보장 - 최신 알짜 정보 반영)
// 토픽별 스마트 Fallback 데이터 (API 실패 또는 키 미설정 시 완벽 동작 보장 - 최신 알짜 정보 반영)
function getFallbackIdea(topic: string, includeTitleText: boolean = false) {
  const cleanTopic = topic || "시니어 맞춤형 콘텐츠";
  const isBizTopic = cleanTopic.includes("매출") || cleanTopic.includes("마케팅") || cleanTopic.includes("절세") || cleanTopic.includes("고객") || cleanTopic.includes("소상공인") || cleanTopic.includes("직원") || cleanTopic.includes("단골") || cleanTopic.includes("창업") || cleanTopic.includes("지원금");

  const seniorFixedParams = ", shot on 85mm lens, f/1.8 aperture, cinematic lighting, realistic skin texture, subtle wrinkles, natural pores, caught in a candid moment, non-symmetrical face, authentic Korean senior, soft natural light, no airbrushing, look like a real documentary photograph, depth of field, 8k resolution --ar 9:16";
  const bizFixedParams = ", shot on 35mm lens, f/2.8 aperture, professional commercial lighting, vibrant colors, clean modern neat store background, authentic Korean small business owner, bustling atmosphere with happy customers, sharp focus, 8k resolution --ar 9:16";

  const titleTextPrompt = includeTitleText ? ", with bold elegant Korean typography overlay at the top saying the video title" : "";

  if (isBizTopic) {
    return {
      title: `${cleanTopic} (2026 소상공인 전기요금 20만원 지원금 꿀팁)`,
      topic: cleanTopic,
      tags: ["소상공인특보", "전기요금지원", "매장고정비절감"],
      script: "사장님들 주목! 올해 연매출 6천만원 이하 영세 소상공인을 대상으로 전기요금 최대 20만원을 특별 지원합니다. 온라인 신청 한 번으로 고정비를 즉시 줄이는 비결을 알려드립니다.",
      visuals: "A bustling modern cafe with happy customers and a smiling owner holding a smart tablet showing utility bill discount, professional bright lighting, cinematic photography",
      bgm: "경쾌하고 희망찬 어쿠스틱 기타 곡",
      scenes: [
        { scene_no: 1, narration: "사장님들! 요즘 전기요금 비롯해 매장 고정비 내시기 참 부담되시죠?", visual_prompt: "A passionate small business owner looking at utility bills with a serious but hopeful expression in a neat store, bright lighting" + titleTextPrompt + bizFixedParams, visual_prompt_kr: "진지하면서도 희망찬 표정으로 고지서를 바라보는 소상공인 사장님의 모습 (상단 제목 텍스트 포함)" },
        { scene_no: 2, narration: "올해부터 연매출 6천만원 이하 매장은 전기요금을 최대 20만원까지 환급받을 수 있습니다.", visual_prompt: "Holding a shining smart tablet showing 200,000 KRW refund graphic, cinematic style" + bizFixedParams, visual_prompt_kr: "20만원 환급 그래픽이 띄워진 스마트 태블릿을 들고 있는 사장님의 환한 미소" },
        { scene_no: 3, narration: "소상공인 전기요금 특별지원 사이트에서 사업자등록번호만 넣으면 끝! 지금 바로 신청하세요.", visual_prompt: "A crowded store with happy customers paying at the counter, dynamic angle" + bizFixedParams, visual_prompt_kr: "고정비 절감으로 여유를 찾아 활기차게 손님을 맞이하는 매장 카운터 풍경" }
      ]
    };
  }

  return {
    title: `${cleanTopic} (2026 노인 일자리 120만개 확대 꿀팁)`,
    topic: cleanTopic,
    tags: ["시니어일자리", "사회서비스형", "월70만원수당"],
    script: "6070 어르신들 주목! 2026년 정부 노인 일자리가 역대 최대인 120만 개로 확대되었습니다. 특히 월 70만원 이상 수령 가능한 '사회서비스형' 일자리 신청 자격과 합격 비결을 공개합니다.",
    visuals: "A dignified Korean senior smiling confidently holding a job application document in a bright modern community center, professional clean atmosphere",
    bgm: "차분하고 신뢰감을 주는 따뜻한 피아노 연주곡",
    scenes: [
      { scene_no: 1, narration: "어르신들! 은퇴 후 보람찬 경제활동을 찾고 계셨다면 올해가 절호의 기회입니다.", visual_prompt: "A friendly senior lifestyle partner greeting the camera in a modern community center, bright lighting" + titleTextPrompt + seniorFixedParams, visual_prompt_kr: "밝고 모던한 복지센터에서 카메라를 향해 환하게 미소 짓는 어르신의 모습 (상단 제목 텍스트 포함)" },
      { scene_no: 2, narration: "정부 노인 일자리가 120만 개로 대폭 늘어나고, 특히 수당이 높은 사회서비스형이 확대되었습니다.", visual_prompt: "Holding a shining info card showing 1.2M jobs graphic, cinematic style" + seniorFixedParams, visual_prompt_kr: "120만 일자리 확대 그래픽이 담긴 빛나는 카드를 들고 설명하는 모습" },
      { scene_no: 3, narration: "가까운 행정복지센터나 시니어클럽에 신분증 지참 후 방문하세요. 새로운 도전, 지금 시작해보세요!", visual_prompt: "Walking confidently towards a modern office desk, dynamic angle" + seniorFixedParams, visual_prompt_kr: "당당한 발걸음으로 복지센터 상담 창구를 향해 걸어가는 활기찬 뒷모습" }
    ]
  };
}

export async function POST(request: Request) {
  try {
    const { topic, sceneCount = 4, includeTitleText = false, apiKeys } = await request.json();
    const apiKey = apiKeys?.geminiKey?.trim() || process.env.GEMINI_API_KEY || "";

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const isBizTopic = topic.includes("매출") || topic.includes("마케팅") || topic.includes("절세") || topic.includes("고객") || topic.includes("소상공인") || topic.includes("직원") || topic.includes("단골") || topic.includes("창업") || topic.includes("지원금") || topic.includes("트렌드");
        const targetAudience = isBizTopic ? "소상공인 및 자영업자" : "시니어(60대 이상)";
        const producerRole = isBizTopic ? "대한민국 자영업자 및 소상공인의 매출을 올려주는 실전 마케팅/매장관리 전문 유튜브 쇼츠 프로듀서" : "시니어(60대 이상) 대상의 전문 유튜브 쇼츠 프로듀서";

        const seniorFixedParams = ", shot on 85mm lens, f/1.8 aperture, cinematic lighting, realistic skin texture, subtle wrinkles, natural pores, caught in a candid moment, non-symmetrical face, authentic Korean senior, soft natural light, no airbrushing, look like a real documentary photograph, depth of field, 8k resolution --ar 9:16";
        const bizFixedParams = ", shot on 35mm lens, f/2.8 aperture, professional commercial lighting, vibrant colors, clean modern neat store background, authentic Korean small business owner, bustling atmosphere with happy customers, sharp focus, 8k resolution --ar 9:16";
        const selectedFixedParams = isBizTopic ? bizFixedParams : seniorFixedParams;

        const titleInstruction = includeTitleText 
          ? `\n[🏷️ 텍스트 오버레이 특별 요구사항]\n사용자가 씬 이미지에 제목 텍스트 입히기를 선택했습니다. 1번 씬(Scene 1)의 visual_prompt 맨 앞부분에 반드시 "A captivating vertical image with bold elegant typography overlay at the top saying the video title," 문구를 추가하여 이미지 생성 시 제목이 멋지게 새겨지도록 연출하세요.` 
          : "";

        const prompt = `당신은 ${producerRole}입니다.
타깃 시청자: ${targetAudience}
주목할 점: 이미지 생성 시 타깃 시청자에 맞춘 최고급 실사 고정 파라미터가 적용됩니다.
주제: "${topic}"${titleInstruction}

[🔥 핵심 요구사항: 최신 뉴스 반영 및 뻔한 소리 철저 배제]
1. 누구나 아는 뻔하고 진부한 소리(예: '손님에게 친절하세요', '물을 많이 마시세요', '규칙적으로 운동하세요')는 절대 금지합니다.
2. 타깃 시청자(${targetAudience})와 관련된 가장 최신 뉴스, 최근 발표된 정부 지원 정책, 신선한 시장 트렌드, 또는 잘 알려지지 않은 구체적인 실전 노하우(비결)를 바탕으로 대본을 기획하세요.
3. 시청자가 영상을 보자마자 "이건 몰랐네!", "당장 해봐야겠다!" 하고 감탄할 수 있는 강력한 훅(Hook)과 구체적인 수치/꿀팁을 제공하세요.
4. 대본(script)과 씬별 내레이션은 전체를 아우르는 자연스러운 한국어 경어체로 작성하세요.
5. visuals 필드는 전체 숏폼의 썸네일에 어울리는 대표 이미지 프롬프트를 영어로 묘사하세요.
6. 장면(scenes)은 정확히 ${sceneCount}개로 나누어 작성하세요.
7. [핵심] 각 씬의 'visual_prompt' (영문 프롬프트) 맨 끝에는 반드시 아래의 고정 파라미터 문자열을 그대로 붙여주세요.
   고정 파라미터: ${selectedFixedParams}
8. [핵심] 각 씬의 'visual_prompt_kr' 필드에는 해당 씬이 어떤 화면을 연출하는 것인지 직관적이고 구체적인 한글 묘사를 1~2문장으로 작성해주세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "눈길을 사로잡는 신선한 숏폼 제목",
  "topic": "${topic}",
  "tags": ["태그1", "태그2", "태그3"],
  "script": "전체 자막 및 내레이션 대본 (자연스러운 말투)",
  "visuals": "썸네일용 대표 이미지 시각적 연출 묘사 (영어)",
  "bgm": "어울리는 배경음악 설명",
  "scenes": [
    {
      "scene_no": 1,
      "narration": "씬 1의 내레이션 대사",
      "visual_prompt": "씬 1의 이미지 생성용 프롬프트 (영어) + 고정 파라미터",
      "visual_prompt_kr": "씬 1의 이미지 프롬프트 한글 연출 설명"
    },
    {
      "scene_no": 2,
      "narration": "씬 2의 내레이션 대사",
      "visual_prompt": "씬 2의 이미지 생성용 프롬프트 (영어) + 고정 파라미터",
      "visual_prompt_kr": "씬 2의 이미지 프롬프트 한글 연출 설명"
    }
  ]
}`;

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85 } // 뻔함을 배제하고 창의성과 신선함 극대화
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
    const fallbackData = getFallbackIdea(topic, includeTitleText);
    return NextResponse.json(fallbackData);

  } catch (error: any) {
    console.error("Generate Idea Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

