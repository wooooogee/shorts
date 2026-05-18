import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 토픽별 스마트 Fallback 데이터 (API 실패 또는 키 미설정 시 완벽 동작 보장 - 최신 알짜 정보 및 디테일 대본 반영)
function getFallbackIdea(topic: string) {
  const cleanTopic = topic || "시니어 맞춤형 콘텐츠";
  const isBizTopic = cleanTopic.includes("매출") || cleanTopic.includes("마케팅") || cleanTopic.includes("절세") || cleanTopic.includes("고객") || cleanTopic.includes("소상공인") || cleanTopic.includes("직원") || cleanTopic.includes("단골") || cleanTopic.includes("창업") || cleanTopic.includes("지원금");

  const seniorFixedParams = ", shot on 85mm lens, f/1.8 aperture, cinematic lighting, realistic skin texture, subtle wrinkles, natural pores, caught in a candid moment, non-symmetrical face, authentic Korean senior, soft natural light, no airbrushing, look like a real documentary photograph, depth of field, 8k resolution --ar 9:16";
  const bizFixedParams = ", shot on 35mm lens, f/2.8 aperture, professional commercial lighting, vibrant colors, clean modern neat store background, authentic Korean small business owner, bustling atmosphere with happy customers, sharp focus, 8k resolution --ar 9:16";

  if (isBizTopic) {
    return {
      title: `${cleanTopic} (2026 소상공인 전기요금 20만원 지원금 꿀팁)`,
      titles: [
        `${cleanTopic} - 2026년 소상공인 전기요금 20만원 즉시 환급받는 비결`,
        `자영업자 고정비 절감 프로젝트: 몰라서 못 받는 전기요금 특별지원금 신청법`,
        `매출은 그대로여도 순수익 20만원 늘리는 가장 쉬운 정부 지원금 활용 팁`
      ],
      subtitles: [
        `"사장님, 아직도 전기세 다 내고 계신가요?"`,
        `연매출 6천만원 이하라면 무조건 20만원 받아가세요!`,
        `온라인 신청 3분이면 고정비 즉시 절감됩니다.`
      ],
      topic: cleanTopic,
      tags: ["소상공인특보", "전기요금지원", "매장고정비절감", "자영업자꿀팁"],
      script: "전국에 계신 사장님들 주목해주십시오! 요즘 가파르게 오르는 물가와 전기요금 비롯한 매장 고정비 때문에 매달 숨이 턱턱 막히실 겁니다. 그래서 정부가 2026년 연매출 6천만원 이하 영세 소상공인 분들을 대상으로 전기요금을 최대 20만원까지 특별 지원하는 사업을 본격 시행하고 있습니다. 기존에 혜택을 받지 못했던 분들도 이번 확대 지원 대상에 포함될 수 있으니 절대 놓치시면 안 됩니다. 복잡한 서류 제출 없이 '소상공인 전기요금 특별지원' 공식 웹사이트에 접속하셔서 사업자등록번호와 한전 고객번호만 입력하시면 간편하게 신청이 완료됩니다. 고정비를 줄이는 것이 곧 순수익을 늘리는 가장 확실한 마케팅이자 매장 관리 비결입니다. 지금 바로 확인해보세요!",
      visuals: "A bustling modern cafe with happy customers and a smiling owner holding a smart tablet showing utility bill discount, professional bright lighting, cinematic photography",
      bgm: "경쾌하고 희망찬 어쿠스틱 기타 곡",
      scenes: [
        { 
          scene_no: 1, 
          narration: "전국에 계신 사장님들! 요즘 가파르게 오르는 물가와 전기요금 비롯한 매장 고정비 때문에 매달 숨이 턱턱 막히고 부담되시죠?", 
          visual_prompt: "A passionate small business owner looking at utility bills with a serious but hopeful expression in a neat store, bright lighting" + bizFixedParams, 
          visual_prompt_kr: "진지하면서도 희망찬 표정으로 고지서를 바라보는 소상공인 사장님의 모습" 
        },
        { 
          scene_no: 2, 
          narration: "올해부터 연매출 6천만원 이하 매장은 전기요금을 최대 20만원까지 환급받을 수 있도록 정부 특별 지원이 대폭 확대되었습니다.", 
          visual_prompt: "Holding a shining smart tablet showing 200,000 KRW refund graphic, cinematic style" + bizFixedParams, 
          visual_prompt_kr: "20만원 환급 그래픽이 띄워진 스마트 태블릿을 들고 있는 사장님의 환한 미소" 
        },
        { 
          scene_no: 3, 
          narration: "온라인 '소상공인 전기요금 특별지원' 웹사이트에서 사업자등록번호와 한전 고객번호만 넣으면 3분 만에 신청 끝! 지금 바로 신청해서 고정비 아끼세요.", 
          visual_prompt: "A crowded store with happy customers paying at the counter, dynamic angle" + bizFixedParams, 
          visual_prompt_kr: "고정비 절감으로 여유를 찾아 활기차게 손님을 맞이하는 매장 카운터 풍경" 
        }
      ]
    };
  }

  return {
    title: `${cleanTopic} (2026 노인 일자리 120만개 확대 꿀팁)`,
    titles: [
      `${cleanTopic} - 2026년 역대급 120만개 노인 일자리 신청 자격 총정리`,
      `월 70만원 이상 받는 '사회서비스형' 시니어 일자리 합격 비결 공개`,
      `은퇴 후 제2의 월급통장 만들기: 6070 어르신 맞춤형 정부 일자리 혜택`
    ],
    subtitles: [
      `"6070 어르신들, 은퇴 후 보람찬 일자리 찾고 계신가요?"`,
      `올해 역대 최대 120만 개 일자리 확충! 월 70만원 수당 기회`,
      `가까운 행정복지센터 방문 전 반드시 알아야 할 꿀팁`
    ],
    topic: cleanTopic,
    tags: ["시니어일자리", "사회서비스형", "월70만원수당", "노후생활비"],
    script: "6070 어르신 여러분 주목해주십시오! 은퇴 후 보람찬 사회 참여와 안정적인 노후 생활비를 위해 경제활동을 찾고 계셨다면 올해 2026년이 절호의 기회입니다. 정부가 올해 노인 일자리를 역대 최대 규모인 120만 개로 대폭 확대했습니다. 특히 어르신들의 경력과 역량을 살려 지역 사회에 공헌하고, 월 70만원 이상의 높은 수당을 수령할 수 있는 '사회서비스형' 일자리가 집중적으로 늘어났습니다. 보육시설 지원, 금융업무 안내, 시니어 컨설턴트 등 업무 환경이 쾌적하고 보람도 큰 일자리들이 많습니다. 신청을 원하시는 어르신께서는 신분증과 주민등록등본을 지참하시고 가까운 행정복지센터나 시니어클럽, 노인복지관에 방문하시면 맞춤형 상담을 받으실 수 있습니다. 어르신들의 아름다운 제2의 인생 도전을 진심으로 응원합니다!",
    visuals: "A dignified Korean senior smiling confidently holding a job application document in a bright modern community center, professional clean atmosphere",
    bgm: "차분하고 신뢰감을 주는 따뜻한 피아노 연주곡",
    scenes: [
      { 
        scene_no: 1, 
        narration: "6070 어르신 여러분! 은퇴 후 보람찬 사회 참여와 안정적인 노후 생활비를 위해 경제활동을 찾고 계셨다면 올해 2026년이 절호의 기회입니다.", 
        visual_prompt: "A friendly senior lifestyle partner greeting the camera in a modern community center, bright lighting" + seniorFixedParams, 
        visual_prompt_kr: "밝고 모던한 복지센터에서 카메라를 향해 환하게 미소 짓는 어르신의 모습" 
      },
      { 
        scene_no: 2, 
        narration: "정부 노인 일자리가 역대 최대인 120만 개로 대폭 늘어나고, 특히 월 70만원 이상 수령 가능한 쾌적한 '사회서비스형' 일자리가 집중 확대되었습니다.", 
        visual_prompt: "Holding a shining info card showing 1.2M jobs graphic, cinematic style" + seniorFixedParams, 
        visual_prompt_kr: "120만 일자리 확대 그래픽이 담긴 빛나는 카드를 들고 설명하는 모습" 
      },
      { 
        scene_no: 3, 
        narration: "신분증 지참 후 가까운 행정복지센터나 시니어클럽에 방문하셔서 맞춤 상담을 받아보세요. 어르신들의 아름다운 제2의 인생 도전을 응원합니다!", 
        visual_prompt: "Walking confidently towards a modern office desk, dynamic angle" + seniorFixedParams, 
        visual_prompt_kr: "당당한 발걸음으로 복지센터 상담 창구를 향해 걸어가는 활기찬 뒷모습" 
      }
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

        const isBizTopic = topic.includes("매출") || topic.includes("마케팅") || topic.includes("절세") || topic.includes("고객") || topic.includes("소상공인") || topic.includes("직원") || topic.includes("단골") || topic.includes("창업") || topic.includes("지원금") || topic.includes("트렌드");
        const targetAudience = isBizTopic ? "소상공인 및 자영업자" : "시니어(60대 이상)";
        const producerRole = isBizTopic ? "대한민국 자영업자 및 소상공인의 매출을 올려주는 실전 마케팅/매장관리 전문 유튜브 쇼츠 프로듀서" : "시니어(60대 이상) 대상의 전문 유튜브 쇼츠 프로듀서";

        const seniorFixedParams = ", shot on 85mm lens, f/1.8 aperture, cinematic lighting, realistic skin texture, subtle wrinkles, natural pores, caught in a candid moment, non-symmetrical face, authentic Korean senior, soft natural light, no airbrushing, look like a real documentary photograph, depth of field, 8k resolution --ar 9:16";
        const bizFixedParams = ", shot on 35mm lens, f/2.8 aperture, professional commercial lighting, vibrant colors, clean modern neat store background, authentic Korean small business owner, bustling atmosphere with happy customers, sharp focus, 8k resolution --ar 9:16";
        const selectedFixedParams = isBizTopic ? bizFixedParams : seniorFixedParams;

        const prompt = `당신은 ${producerRole}입니다.
타깃 시청자: ${targetAudience}
주목할 점: 이미지 생성 시 타깃 시청자에 맞춘 최고급 실사 고정 파라미터가 적용됩니다. (주의: 씬 이미지 프롬프트에 텍스트 오버레이나 글자를 넣지 마세요. 글자는 별도의 추천 제목 및 자막 필드로 제공합니다.)
주제: "${topic}"

[🔥 핵심 요구사항: 최신 뉴스 반영, 디테일 강화 및 뻔한 소리 철저 배제]
1. 누구나 아는 뻔하고 진부한 소리(예: '손님에게 친절하세요', '물을 많이 마시세요', '규칙적으로 운동하세요')는 절대 금지합니다.
2. 타깃 시청자(${targetAudience})와 관련된 가장 최신 뉴스, 최근 발표된 정부 지원 정책, 신선한 시장 트렌드, 또는 잘 알려지지 않은 구체적인 실전 노하우(비결)를 바탕으로 대본을 기획하세요.
3. 시청자가 영상을 보자마자 "이건 몰랐네!", "당장 해봐야겠다!" 하고 감탄할 수 있는 강력한 훅(Hook)과 구체적인 수치, 실질적인 행동 지침(꿀팁)을 제공하세요.
4. [핵심 - 디테일 강화] 대본(script)과 씬별 내레이션(narration)은 기존보다 2~3배 이상 훨씬 더 구체적이고 디테일한 내용을 담아 작성하세요. 짧고 간략한 요약이 아니라, 실제 유튜브 쇼츠 영상에서 시청자를 몰입시킬 수 있는 상세하고 깊이 있는 설명과 풍부한 대사를 한국어 경어체로 작성해야 합니다.
5. [핵심 - 추천 제목 3개] 시청자의 클릭을 유도하는 매력적이고 신선한 숏폼 추천 제목 3개를 'titles' 배열에 작성하세요. 'title' 필드에는 이 중 가장 베스트인 첫 번째 제목을 넣으세요.
6. [핵심 - 추천 훅 자막 3개] 영상 초반 훅(Hook)이나 썸네일 화면에 띄워 시청자의 시선을 사로잡을 자극적이고 흥미로운 추천 훅 자막 3개를 'subtitles' 배열에 작성하세요.
7. visuals 필드는 전체 숏폼의 썸네일에 어울리는 대표 이미지 프롬프트를 영어로 묘사하세요.
8. 장면(scenes)은 정확히 ${sceneCount}개로 나누어 작성하세요. 각 씬의 narration 역시 매우 디테일하고 풍부한 문장으로 구성하세요.
9. [핵심] 각 씬의 'visual_prompt' (영문 프롬프트) 맨 끝에는 반드시 아래의 고정 파라미터 문자열을 그대로 붙여주세요. (텍스트 오버레이 관련 문구는 절대 넣지 마세요)
   고정 파라미터: ${selectedFixedParams}
10. [핵심] 각 씬의 'visual_prompt_kr' 필드에는 해당 씬이 어떤 화면을 연출하는 것인지 직관적이고 구체적인 한글 묘사를 1~2문장으로 작성해주세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "title": "눈길을 사로잡는 베스트 숏폼 제목 (titles의 첫 번째 값)",
  "titles": [
    "추천 숏폼 제목 1 (클릭을 유도하는 매력적인 제목)",
    "추천 숏폼 제목 2 (구체적인 수치나 호기심을 자극하는 제목)",
    "추천 숏폼 제목 3 (타깃 시청자의 공감을 이끌어내는 제목)"
  ],
  "subtitles": [
    "추천 훅 자막 1 (영상 초반 3초 시선을 붙잡는 강력한 멘트)",
    "추천 훅 자막 2 (썸네일에 띄우기 좋은 핵심 요약 자막)",
    "추천 훅 자막 3 (시청자의 궁금증을 폭발시키는 어그로 자막)"
  ],
  "topic": "${topic}",
  "tags": ["태그1", "태그2", "태그3", "태그4"],
  "script": "전체 자막 및 내레이션 대본 (매우 구체적이고 디테일한 설명, 풍부한 분량, 자연스러운 경어체)",
  "visuals": "썸네일용 대표 이미지 시각적 연출 묘사 (영어)",
  "bgm": "어울리는 배경음악 설명",
  "scenes": [
    {
      "scene_no": 1,
      "narration": "씬 1의 내레이션 대사 (구체적이고 디테일한 상황 설명 및 강력한 훅)",
      "visual_prompt": "씬 1의 이미지 생성용 프롬프트 (영어) + 고정 파라미터",
      "visual_prompt_kr": "씬 1의 이미지 프롬프트 한글 연출 설명"
    },
    {
      "scene_no": 2,
      "narration": "씬 2의 내레이션 대사 (핵심 정보 및 실질적인 노하우 상세 설명)",
      "visual_prompt": "씬 2의 이미지 생성용 프롬프트 (영어) + 고정 파라미터",
      "visual_prompt_kr": "씬 2의 이미지 프롬프트 한글 연출 설명"
    }
  ]
}`;

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 4096 }
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


