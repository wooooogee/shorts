import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API 실패 또는 키 미설정 시 제공되는 고품질 Fallback 뉴스 풀 (랜덤 셔플용)
// API 실패 또는 키 미설정 시 제공되는 고품질 Fallback 뉴스 풀 (랜덤 셔플용 - 시니어 & 자영업자 최신 알짜 정보)
const FALLBACK_NEWS_POOL = [
  { topic: "[자영업·지원] 2026년 소상공인 전기요금 특별지원금 20만원 신청 접수 시작", source: "중소벤처기업부", summary: "연매출 6천만원 이하 영세 소상공인 대상 전기요금 최대 20만원 감면 혜택 및 온라인 신청 방법 안내" },
  { topic: "[자영업·마케팅] '영수증 리뷰 이벤트는 옛말?' 2026년 숏폼 활용 단골 모객 최신 트렌드", source: "소상공인시장진흥공단", summary: "단순 리뷰 보상이 아닌, 매장 작업 과정을 담은 15초 숏폼으로 인근 주민 단골을 3배 늘린 실전 매장 사례 분석" },
  { topic: "[자영업·절세] '모르면 수백만원 손해' 올해 바뀐 노란우산공제 소득공제 및 복지 혜택 확대", source: "중소기업중앙회", summary: "최대 500만원 소득공제 혜택에 더해, 가입자 대상 무이자 의료·재해 대출 및 경영지원 바우처 신설 소식" },
  { topic: "[자영업·운영] 배달앱 중개수수료 인상에 맞선 '자사앱·전화주문 할인' 성공 전략", source: "외식업중앙회", summary: "배달앱 의존도를 낮추고 전화 주문 고객에게 1,000원 할인과 쿠폰북을 제공해 순이익을 15% 개선한 매장 노하우" },
  { topic: "[자영업·노무] 2026년 최저임금 인상에 따른 주휴수당 계산법 및 알바 관리 스마트 앱 활용법", source: "고용노동부", summary: "복잡한 주휴수당과 4대보험 계산을 터치 한 번으로 해결하고 근로계약서 간편 체결이 가능한 정부 인증 무료 앱 소개" },
  { topic: "[시니어·정책] 2026년 노인 일자리 120만개 확대 및 '시니어 인턴십' 참여 수당 인상", source: "보건복지부", summary: "월 70만원 이상 수령 가능한 사회서비스형 및 민간 취업 연계형 일자리 자격 조건과 주민센터 신청 서류 총정리" },
  { topic: "[시니어·건강] '단순 걷기는 반쪽짜리?' 6070 근감소증 막는 초간단 '의자 스쿼트 3분' 비법", source: "대한노인병학회", summary: "무릎 관절에 무리 없이 집에서 TV 보며 허벅지 근육과 코어를 강화해 낙상 사고를 80% 예방하는 최신 운동법" },
  { topic: "[시니어·디지털] '키오스크 앞에서 당황 끝!' 스마트폰으로 미리 연습하는 무료 시뮬레이터 앱", source: "과학기술정보통신부", summary: "병원 접수, 패스트푸드 주문, KTX 예매 등 복잡한 키오스크 화면을 집에서 똑같이 연습할 수 있는 정부 지원 앱" },
  { topic: "[시니어·금융] 65세 이상 대상 '비과세 종합저축' 5천만원 한도 활용 100% 절세 꿀팁", source: "금융감독원", summary: "일반 예적금 이자소득세 15.4%를 전액 면제받아 실질 이자 수익을 극대화하는 시니어 전용 금융 상품 활용 가이드" },
  { topic: "[시니어·생활] 치매 예방에 특효라는 '손가락 박수 뇌파 운동'의 의학적 효과 입증", source: "서울대병원 신경과", summary: "하루 5분 손끝 자극만으로 전두엽 혈류량을 30% 증가시켜 기억력 감퇴를 막는 최신 뇌 건강 트렌드" }
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

        const prompt = `당신은 시니어(6070) 및 자영업자(소상공인) 타깃 전문 콘텐츠 큐레이터입니다.
오늘 날짜(${today}) 기준으로 시니어와 자영업자들에게 가장 인기가 높고 실용적인 최신 뉴스, 정부 지원 정책, 시장 동향, 생활/건강 트렌드 ${count}개를 발굴하여 JSON 형식으로 작성해 주세요.

[🔥 핵심 요구사항: 뻔한 내용 배제 및 신선함 극대화]
1. 누구나 아는 뻔하고 진부한 소리(예: '물을 많이 마시세요', '손님에게 친절하게 대하세요', '규칙적으로 운동하세요')는 절대 금지합니다.
2. 최근에 발표된 정부 지원금 금액, 구체적인 세법 개정안, 신선한 마케팅 성공 사례, 최신 의학 연구 결과 등 시청자가 "이건 몰랐네!" 하고 감탄할 만한 구체적이고 새로운 사실 위주로 발굴해 주세요.
3. topic 필드는 눈에 띄게 대괄호 카테고리([자영업·지원], [자영업·마케팅], [시니어·정책], [시니어·건강], [경제] 등)를 붙여 작성하세요.
4. summary 필드는 핵심 내용과 구체적인 수치(예: 20만원 지원, 15% 개선 등)를 포함하여 1~2줄로 요약하세요.
5. source 필드는 신뢰할 수 있는 출처명(예: 중소벤처기업부, 국세청, 보건복지부, 서울대병원 등)을 적어주세요.

반드시 아래 JSON 구조로만 반환하세요:
[
  { "topic": "[자영업·지원] 2026년 소상공인 전기요금 특별지원금 20만원 신청 접수 시작", "source": "중소벤처기업부", "status": "Ready", "date": "${today}", "summary": "연매출 6천만원 이하 영세 소상공인 대상 전기요금 최대 20만원 감면 혜택 및 온라인 신청 방법 안내" }
]`;

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 4096 } // 다양성과 신선함 극대화 및 응답 잘림 방지
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

    // API 키가 없거나 호출 실패 시 고품질 최신 알짜 정보 풀을 랜덤 셔플하여 동적 제공
    const shuffled = shuffleArray(FALLBACK_NEWS_POOL).slice(0, 5);
    const fallbackData = shuffled.map((item) => ({
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
