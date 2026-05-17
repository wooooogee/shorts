import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// 구글 공용 데모 MP4 URL 목록 (비디오 씬 Fallback용)
const DEMO_MP4_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
];

// 시니어 타깃 고품질 실사 이미지 Fallback 목록 (이미지 씬용 - 나노바나나2 시뮬레이션)
const SENIOR_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80", // 따뜻한 미소의 시니어
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80", // 상담받는 어르신
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80", // 활기찬 시니어 부부
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80", // 친절한 안내를 받는 어르신
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"  // 행복하게 웃는 노부부
];

// 🌟 [핵심 추가] 뉴스 주제(Topic)별 스마트 Fallback 대본 및 최고급 디테일 프롬프트 동적 생성기 (Top 10 뉴스 완벽 대응)
function generateSmartFallback(topic: string) {
  const cleanTopic = topic || "2026년 기초연금 40만원 인상안 확정";
  const fixedParams = ", shot on 85mm lens, f/1.8 aperture, cinematic lighting, realistic skin texture, subtle wrinkles, natural pores, caught in a candid moment, non-symmetrical face, authentic Korean senior, soft natural light, no airbrushing, look like a real documentary photograph, depth of field, 8k resolution --ar 9:16";
  
  if (cleanTopic.includes("주택연금") || cleanTopic.includes("12억")) {
    return {
      shorts_title: "집 한 채로 평생 월급! 주택연금 기준 12억 완화",
      scenes: [
        { scene_id: 1, narration: "집 한 채로 평생 월급! 주택연금 기준 12억 완화", image_prompt: "[영상] 멋진 현대식 주택 앞에서 활짝 웃는 노부부. Cinematic tracking shot, a dignified elderly Korean couple smiling warmly in front of a beautiful modern house, warm morning sunlight, highly detailed, realistic motion, slow pan to the right" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "가입 기준이 기존 9억에서 12억으로 대폭 확대되어 더 많은 분들이 혜택을 받습니다.", image_prompt: "[이미지] 친절한 은행 직원과 연금 계약서를 보며 환하게 웃는 노신사. A highly detailed portrait of a Korean senior man in his 70s happily looking at a pension contract document with a friendly bank consultant in a modern clean office, warm lighting" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "내 집에서 평생 살면서 매월 안정적인 연금을 받을 수 있어 노후 걱정이 없어요.", image_prompt: "[이미지] 따뜻한 거실에서 여유롭게 차를 마시는 우아한 노부부. An elegant elderly Korean couple in their 70s drinking tea in a cozy modern living room, warm sunlight streaming through the large window, kind gentle smiles" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "가까운 한국주택금융공사 지사나 은행에서 신분증과 등기권리증만 내면 상담 가능!", image_prompt: "[이미지] 밝고 깨끗한 금융기관에서 직원의 친절한 안내를 받는 어르신. A Korean senior woman kindly guided by a professional staff member inside a clean bright modern financial office, relieved and happy expression" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("돌봄") || cleanTopic.includes("바우처")) {
    return {
      shorts_title: "병원 동행부터 가사까지! 어르신 돌봄 바우처 50시간",
      scenes: [
        { scene_id: 1, narration: "병원 동행부터 가사까지! 어르신 돌봄 바우처 50시간", image_prompt: "[영상] 공원에서 어르신의 산책을 부드럽게 부축하는 따뜻한 요양보호사. Cinematic slow tracking shot, a friendly professional caregiver kindly assisting an elderly Korean woman walking in a beautiful lush park, warm sunlight, gentle breeze, realistic motion" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "혼자 계시거나 거동이 불편하신 어르신들을 위한 맞춤형 돌봄 서비스가 월 50시간으로 확대됩니다.", image_prompt: "[이미지] 깔끔한 주방에서 어르신을 위해 정성껏 건강식을 준비하는 요양보호사. A warm caregiver preparing a healthy nutritious meal for an elderly Korean man in a clean modern kitchen, bright natural lighting, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "청소, 빨래 등 가사 지원은 물론 병원 가실 때도 든든하게 동행해 드려요.", image_prompt: "[이미지] 병원 앞 택시에서 내리는 어르신을 안전하게 부축하는 요양보호사. A caregiver kindly helping an elderly Korean man get out of a clean modern taxi in front of a hospital entrance, bright sunny day, relieved expression" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "가까운 읍면동 주민센터나 복지로 웹사이트에서 본인 또는 가족이 즉시 신청 가능!", image_prompt: "[이미지] 안도감 어린 표정으로 복지센터와 상담 전화를 나누는 어르신. A highly detailed portrait of a Korean senior woman in her 70s talking on the phone with a community center, relieved and happy expression, cozy living room, warm soft lighting" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("운전면허") || cleanTopic.includes("반납")) {
    return {
      shorts_title: "운전면허 자진반납하면 혜택이 무려 50만원!",
      scenes: [
        { scene_id: 1, narration: "운전면허 자진반납하면 혜택이 무려 50만원!", image_prompt: "[영상] 친절한 경찰관에게 운전면허증을 건네며 호탕하게 웃는 멋진 노신사. Cinematic slow pan, a dignified elderly Korean man handing over his driver license to a friendly police officer, big happy proud smile, bright police station office, realistic motion" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "70세 이상 어르신들이 운전면허를 자진반납하실 경우 지자체 지원금이 최대 50만원으로 인상됩니다.", image_prompt: "[이미지] 원목 책상 위에 놓인 깔끔한 반납 증명서와 영롱하게 빛나는 50만원 상품권. A clean official certificate and a shining 500,000 won gift card on a neat wooden desk, soft studio lighting, macro shot, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "교통카드나 지역화폐로 지급되어 장보실 때나 대중교통 이용하실 때 아주 유용해요.", image_prompt: "[이미지] 쾌적한 버스 단말기에 교통카드를 터치하며 환하게 웃는 어르신. A Korean senior woman happily tapping her transport card on a modern clean bus terminal, bright daylight, cheerful expression" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "가까운 주민센터나 경찰서 민원실에 운전면허증만 챙겨가면 원스톱으로 즉시 처리!", image_prompt: "[이미지] 홀가분하고 기쁜 표정으로 주민센터 건물을 나서는 어르신. A Korean senior walking out of a bright modern community center building with a happy relieved expression, sunny day, vibrant colors" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("디지털") || cleanTopic.includes("키오스크")) {
    return {
      shorts_title: "스마트폰 맹탈출! 시니어 디지털 바우처 월 5만원",
      scenes: [
        { scene_id: 1, narration: "스마트폰 맹탈출! 시니어 디지털 바우처 월 5만원", image_prompt: "[영상] 밝은 카페에서 능숙하게 스마트폰을 터치하며 환하게 웃는 우아한 어르신. Cinematic slow zoom in, an elegant elderly Korean woman happily using a clean modern smartphone in a bright sunlit cafe, smooth tapping motion" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "어르신들의 디지털 격차 해소를 위해 매월 5만원의 교육 바우처와 1:1 맞춤 교육이 지원됩니다.", image_prompt: "[이미지] 친절한 청년 강사와 함께 태블릿PC 사용법을 배우며 즐거워하는 노신사. A friendly young instructor kindly teaching an elderly Korean man how to use a tablet in a bright room, kind patient smile, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "복잡한 병원 키오스크 접수부터 기차표 예매, 카카오톡 활용법까지 아주 쉽게 알려드려요.", image_prompt: "[이미지] 베이커리 카페에서 자신감 넘치는 표정으로 무인 키오스크를 조작하는 어르신. A Korean senior woman confidently using a clean modern self order kiosk at a bright bakery cafe, proud expression" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "가까운 노인복지관이나 디지털배움터 웹사이트에서 전화나 방문으로 편하게 신청하세요!", image_prompt: "[이미지] 쾌적한 컴퓨터 교실에서 함께 웃으며 디지털 수업을 듣는 활기찬 시니어들. A group of active Korean seniors laughing together in a bright modern computer classroom, joyful atmosphere, sharp focus" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("응급안심") || cleanTopic.includes("스피커")) {
    return {
      shorts_title: "독거 어르신 생명지킴이! AI 스피커 무상 설치",
      scenes: [
        { scene_id: 1, narration: "독거 어르신 생명지킴이! AI 스피커 무상 설치", image_prompt: "[영상] 아늑한 거실 원목 테이블 위에서 부드러운 불빛을 내뿜는 세련된 AI 스피커. Cinematic slow orbit shot, a sleek modern AI speaker glowing softly on a wooden table in a cozy Korean senior living room, peaceful mood, realistic gentle light pulsing" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "댁내 화재나 낙상, 호흡 이상을 24시간 감지하여 119에 자동 신고해 주는 첨단 기기를 무상 지원합니다.", image_prompt: "[이미지] 깨끗한 하얀 벽면에 설치된 첨단 호흡 감지 레이더 센서, 은은한 작동 램프. A clean modern radar sensor mounted on a pristine white wall, subtle warm indicator light, minimalist aesthetic, macro shot, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "살려달라고 외치기만 해도 AI가 즉시 반응하여 119 구급대와 독거노인종합지원센터로 바로 연결돼요.", image_prompt: "[이미지] 친절한 119 구급대원이 어르신의 건강을 체크하며 따뜻하게 안심시키는 모습. A friendly 119 paramedic kindly checking on an elderly Korean man, relieved expression, bright comfortable room, warm soft lighting" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "관할 읍면동 주민센터나 독거노인종합지원센터에 전화 한 통이면 전문 기사가 직접 방문 설치!", image_prompt: "[이미지] 전문 기사가 어르신에게 AI 스피커 사용법을 친절하고 쉽게 설명하는 모습. A professional technician kindly explaining how to use the AI speaker to a Korean senior woman, kind professional smile, neat living room" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("임플란트")) {
    return {
      shorts_title: "치과비 70% 아끼는 65세 임플란트 혜택!",
      scenes: [
        { scene_id: 1, narration: "치과비 70% 아끼는 65세 임플란트 혜택!", image_prompt: "[영상] 치과 진료실에서 완벽하고 건강한 치아를 드러내며 환하게 웃는 멋진 노신사. Cinematic slow pan, a dignified elderly Korean man smiling brightly with perfect healthy teeth, modern clean dental clinic background, happy proud expression" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "올해 하반기부터 임플란트 지원이 최대 4개까지 대폭 확대됩니다.", image_prompt: "[이미지] 쾌적한 치과 병원에서 친절한 의사 선생님과 기분 좋게 상담하는 어르신. A Korean senior woman kindly consulting with a friendly dentist in a modern clean clinic, warm professional atmosphere, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "만 65세 이상 어르신이라면 본인부담금 30%만 내시면 돼요.", image_prompt: "[이미지] 본인부담금 30% 안내문이 적힌 깔끔하고 세련된 치과 안내 차트. A clean dental chart showing 30 percent cost on a sleek desk with bright lighting, professional medical setting, sharp focus" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "자주 가시는 동네 치과 병원에 신분증만 챙겨가면 즉시 적용!", image_prompt: "[이미지] 가벼운 발걸음으로 화사한 동네 치과 병원 문을 열고 들어서는 어르신. A happy Korean senior walking into a bright modern dental clinic building, sunny day, cheerful mood" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("노인일자리") || cleanTopic.includes("인턴십")) {
    return {
      shorts_title: "월 100만원 보장! 시니어 인턴십 신청하세요",
      scenes: [
        { scene_id: 1, narration: "월 100만원 보장! 시니어 인턴십 신청하세요", image_prompt: "[영상] 쾌적하고 모던한 사무실에서 열정적으로 업무에 집중하며 미소 짓는 노신사. Cinematic slow zoom in, a dignified elderly Korean man working enthusiastically in a modern clean office, proud confident smile, realistic dynamic motion" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "보건복지부 주관으로 전국 3천개 기업에서 대규모 모집을 시작했습니다.", image_prompt: "[이미지] 밝고 넓은 세미나실에 모여 활기차게 오리엔테이션을 듣는 시니어들. A group of active Korean seniors attending an orientation in a bright seminar room, professional corporate atmosphere, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "업무 강도가 낮고 거주지 근처에서 일할 수 있어 인기가 아주 높아요.", image_prompt: "[이미지] 깔끔한 도서관 데스크에서 이용객을 친절하게 안내하며 보람을 느끼는 어르신. A Korean senior woman happily assisting a customer at a neat modern library desk, kind gentle smile, warm interior lighting" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "한국노인인력개발원이나 복지로 홈페이지에서 온라인 즉시 신청!", image_prompt: "[이미지] 아늑한 거실에서 태블릿PC로 일자리 신청 화면을 보며 흐뭇해하는 어르신. A senior man looking at a clean tablet screen showing job application, cozy living room, warm sunlight, satisfied expression" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("교통비") || cleanTopic.includes("패스")) {
    return {
      shorts_title: "교통비 0원! 전국 지하철·버스 무료 패스",
      scenes: [
        { scene_id: 1, narration: "교통비 0원! 전국 지하철·버스 무료 패스", image_prompt: "[영상] 화창한 날씨에 교통카드를 손에 쥐고 호탕하고 행복하게 웃는 멋진 노신사. Cinematic slow pan, a dignified elderly Korean man holding a transport card with a big proud smile, bright outdoor city background, realistic motion" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "기존 지자체별 카드가 하나로 통합되어 전국 어디서나 무료!", image_prompt: "[이미지] 대한민국 지도 위에 영롱하고 고급스럽게 빛나는 통합 스마트 교통카드. A modern smart card shining on a sleek map of Korea, studio lighting, premium aesthetic, macro shot, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "만 65세 이상 어르신이라면 누구나 혜택을 누릴 수 있습니다.", image_prompt: "[이미지] 쾌적하고 깨끗한 최신형 버스에 여유롭게 탑승하며 환하게 웃는 시니어들. A group of happy Korean seniors boarding a clean modern bus, bright daylight, cheerful atmosphere" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "가까운 농협이나 신한은행에서 신분증만 내면 즉시 발급!", image_prompt: "[이미지] 화사한 은행 창구에서 직원의 친절한 안내를 받으며 카드를 발급받는 어르신. A senior woman kindly guided by a bank clerk, bright bank interior, happy relieved expression, cinematic soft lighting" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("백신") || cleanTopic.includes("독감")) {
    return {
      shorts_title: "비싼 대상포진 백신 0원! 무료 지정병원 확대",
      scenes: [
        { scene_id: 1, narration: "비싼 대상포진 백신 0원! 무료 지정병원 확대", image_prompt: "[영상] 깨끗한 진료실에서 의사 선생님의 따뜻한 진료를 받으며 온화하게 웃는 어르신. Cinematic slow zoom in, a dignified elderly Korean woman receiving a checkup from a friendly doctor, clean modern hospital, peaceful happy smile, realistic motion" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "비용 부담이 컸던 대상포진과 독감 백신 무료 접종이 대폭 확대됩니다.", image_prompt: "[이미지] 청결한 병원 트레이 위에 놓인 깔끔한 진료 차트와 영롱한 백신 바이알. A neat medical chart and a clean vaccine vial on a pristine hospital tray, professional medical lighting, macro shot, sharp focus" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "전국 5천 곳의 지정된 동네 병의원 어디서나 편하게 맞으실 수 있어요.", image_prompt: "[이미지] 홀가분하고 건강한 발걸음으로 화사한 동네 의원 건물을 나서는 노신사. A Korean senior man happily walking out of a modern local clinic building, bright sunny day, relieved expression" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "질병관리청 홈페이지나 보건소 전화로 가까운 병원을 즉시 확인하세요!", image_prompt: "[이미지] 안도감 어린 밝은 표정으로 보건소 직원과 전화 안내를 나누는 어르신. A Korean senior woman talking on the phone with a public health center staff, relieved and happy expression, warm cozy living room" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("다방") || cleanTopic.includes("통기타")) {
    return {
      shorts_title: "7080 그때 그 시절, 우리가 사랑했던 다방 커피와 통기타",
      scenes: [
        { scene_id: 1, narration: "7080 그때 그 시절, 우리가 사랑했던 다방 커피와 통기타", image_prompt: "[영상] 아늑하고 레트로한 70년대 음악 다방에서 통기타를 치며 낭만적으로 노래하는 청년과 이를 흐뭇하게 바라보는 시니어들. Cinematic slow pan, a cozy retro 1970s Korean music cafe, a young man playing acoustic guitar, older patrons smiling with nostalgia, warm vintage lighting" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "통기타 소리와 계란 노른자 띄운 모닝 쌍화차 한 잔이면 세상 부러울 게 없었죠.", image_prompt: "[이미지] 김이 모락모락 나는 레트로 찻잔에 담긴 노른자 띄운 쌍화차와 오래된 LP판. A steaming vintage teacup with traditional Korean Ssanghwa tea with an egg yolk on top next to old vinyl records, wooden table, warm nostalgic atmosphere" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "DJ 박스 쪽지로 신청곡을 보내며 가슴 설레던 청춘의 추억이 생생합니다.", image_prompt: "[이미지] 유리창 너머 추억의 DJ 박스 안에서 사연 쪽지를 읽으며 미소 짓는 멋진 DJ. A handsome retro DJ inside a glass DJ booth reading a song request note with a gentle smile, vintage microphone, soft studio lighting" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "바쁜 일상에 잊고 지냈던 그 시절 낭만, 오늘 따뜻한 커피 한 잔과 함께 꺼내보세요.", image_prompt: "[이미지] 거실 창가에서 김이 나는 커피를 마시며 옛 추억에 잠겨 온화하게 미소 짓는 노부부. An elegant elderly Korean couple drinking coffee by the living room window, smiling warmly with nostalgic memories, soft sunlight" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "가슴 따뜻해지는 시니어 추억 여행, 지금 바로 구독하고 함께 떠나요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("국민학교") || cleanTopic.includes("운동회") || cleanTopic.includes("고무신")) {
    return {
      shorts_title: "검정 고무신 신고 뛰놀던 국민학교 시절 운동회 풍경",
      scenes: [
        { scene_id: 1, narration: "검정 고무신 신고 뛰놀던 국민학교 시절 운동회 풍경", image_prompt: "[영상] 만국기가 펄럭이는 옛날 시골 학교 운동장에서 환하게 웃으며 달리기 삼매경에 빠진 아이들과 응원하는 마을 사람들. Cinematic slow motion, a nostalgic 1960s Korean elementary school sports day, colorful flags fluttering, children running happily on a dirt field, cheers, bright autumn sunlight" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "흙먼지 날리며 이어달리기 하고, 터지던 박에서 쏟아지던 오색 꽃가루 기억하시나요?", image_prompt: "[이미지] 가을 하늘 높이 매달린 큰 박이 터지며 '축 운동회' 현수막과 오색 꽃가루가 쏟아지는 아름다운 풍경. A large paper gourd splitting open in the blue autumn sky, releasing colorful confetti and a festive banner, sharp focus, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "어머니가 정성껏 싸주신 찬합 속 김밥과 사이다 한 병은 세상 최고의 만찬이었죠.", image_prompt: "[이미지] 돗자리 위에 놓인 옛날 양은 도시락 속 먹음직스러운 김밥과 유리병 사이다. Delicious traditional Korean gimbap in a vintage metal lunchbox next to a glass soda bottle on a picnic mat, warm sunlight, macro shot" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "비록 살림은 빠듯해도 온 동네가 잔치처럼 정을 나누던 그 시절이 그립습니다.", image_prompt: "[이미지] 나무 그늘 아래서 이웃들과 함께 웃으며 음식을 나누어 먹는 따뜻한 옛날 시골 풍경. Warm nostalgic scene of Korean villagers sharing food and laughing together under a large tree shade, 1960s aesthetic, gentle lighting" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "가슴 따뜻해지는 시니어 추억 여행, 지금 바로 구독하고 함께 떠나요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("모델") || cleanTopic.includes("시니어 모델")) {
    return {
      shorts_title: "은퇴 후 제2의 인생! 돈도 버는 시니어 모델 도전기",
      scenes: [
        { scene_id: 1, narration: "은퇴 후 제2의 인생! 돈도 버는 시니어 모델 도전기", image_prompt: "[영상] 화려한 조명이 쏟아지는 런웨이에서 멋진 슈트를 입고 당당하고 우아하게 워킹하는 백발의 시니어 모델. Cinematic slow motion tracking shot, a dignified white haired Korean senior model walking confidently on a brightly lit fashion runway, wearing a stylish modern suit, elegant posture" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "나이는 숫자에 불과합니다! 최근 패션 및 광고계에서 액티브 시니어 모델의 수요가 폭발적입니다.", image_prompt: "[이미지] 모던하고 세련된 스튜디오에서 전문 포토그래퍼 앞 포즈를 취하며 환하게 웃는 우아한 어르신. An elegant Korean senior woman posing confidently in front of a professional photographer in a modern clean photo studio, bright studio lighting" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "자세 교정과 걷기 운동으로 건강을 되찾는 것은 물론, 짭짤한 활동 수입까지 얻을 수 있어요.", image_prompt: "[이미지] 전신 거울 앞 바른 자세로 당당하게 미소 지으며 워킹 연습을 하는 활기찬 시니어들. A group of active Korean seniors practicing runway walking in front of a large mirror in a bright dance studio, proud happy smiles" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "지자체 시니어 아카데미나 문화센터의 시니어 모델 강좌를 통해 초보자도 쉽게 시작 가능!", image_prompt: "[이미지] 문화센터 강좌 안내 데스크에서 친절한 강사와 기분 좋게 상담을 나누는 노신사. A Korean senior man happily consulting with a friendly instructor at a bright modern academy desk, cheerful atmosphere" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "멋진 제2의 인생을 응원합니다! 더 많은 시니어 꿀팁을 위해 구독해 주세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("맨발") || cleanTopic.includes("어싱")) {
    return {
      shorts_title: "돈 안 드는 최고의 운동 '맨발 걷기', 전국 명소 베스트 5",
      scenes: [
        { scene_id: 1, narration: "돈 안 드는 최고의 운동 '맨발 걷기', 전국 명소 베스트 5", image_prompt: "[영상] 피톤치드 가득한 울창한 황톳길 숲속에서 맨발로 부드러운 흙을 밟으며 여유롭게 산책하는 노부부. Cinematic slow tracking shot, a dignified elderly Korean couple walking barefoot on a beautiful red clay forest path, lush green trees, warm morning sunlight streaming through mist" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "땅과 접촉하는 어싱(Earthing)은 체내 활성산소를 배출하고 불면증과 관절염 완화에 탁월합니다.", image_prompt: "[이미지] 부드럽고 촉촉한 황토 흙 위에 맨발을 딛고 서서 평온하게 미소 짓는 어르신의 발과 다리 클로즈업. Macro close up of healthy bare feet standing on soft moist red clay soil, peaceful natural morning light, highly detailed" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "계족산 황톳길, 문경새재, 서울숲 등 전국 곳곳에 세족 시설까지 완비된 명품 황톳길이 많아요.", image_prompt: "[이미지] 산책 후 깨끗하게 관리된 편백나무 세족장에서 시원한 물로 발을 씻으며 환하게 웃는 시니어들. A group of happy Korean seniors washing their feet with cool clean water at a wooden foot washing station in a park, joyful atmosphere" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "처음엔 무리하지 말고 하루 20분씩, 푹신한 모래나 황톳길에서 가볍게 시작해 보세요!", image_prompt: "[이미지] 햇살 좋은 공원 벤치에서 맨발 산책 후 여유롭게 물을 마시며 상쾌해하는 노신사. A Korean senior man sitting on a park bench drinking water after barefoot walking, feeling refreshed and healthy, bright sunny day" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 건강 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("치매") || cleanTopic.includes("아침")) {
    return {
      shorts_title: "치매 예방 1등 공신! 매일 아침 꼭 먹어야 할 '이것'",
      scenes: [
        { scene_id: 1, narration: "치매 예방 1등 공신! 매일 아침 꼭 먹어야 할 '이것'", image_prompt: "[영상] 햇살 가득한 아늑한 주방에서 신선하고 건강한 아침 식단을 준비하며 온화하게 웃는 우아한 어르신. Cinematic slow zoom in, an elegant elderly Korean woman smiling warmly while preparing a fresh healthy breakfast in a sunlit cozy kitchen, beautiful morning atmosphere" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "뇌 신경 세포를 보호하고 인지 기능을 높여주는 최고의 아침 식단은 바로 달걀과 호두, 그리고 들기름입니다.", image_prompt: "[이미지] 원목 식탁 위에 정갈하게 차려진 따뜻한 삶은 달걀, 신선한 호두 알맹이, 그리고 고소한 들기름 한 스푼. A beautifully arranged healthy breakfast with warm boiled eggs, fresh walnuts, and a spoon of perilla oil on a neat wooden table, macro shot" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "풍부한 레시틴과 오메가3 지방산이 뇌 혈관을 청소해 주어 깜빡깜빡하는 증상을 크게 줄여줘요.", image_prompt: "[이미지] 쾌적한 진료실에서 의사 선생님의 뇌 건강 칭찬을 들으며 환하고 자신감 넘치게 웃는 노신사. A dignified Korean senior man laughing proudly while receiving positive brain health results from a friendly doctor in a clean modern clinic" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "거창한 요리 대신 매일 아침 간편하게 챙겨 드시고 100세까지 맑은 두뇌를 유지하세요!", image_prompt: "[이미지] 아침 식탁에서 부부가 서로에게 견과류를 챙겨주며 행복하게 미소 짓는 따뜻한 풍경. A heartwarming scene of an elderly Korean couple happily sharing nuts at the morning breakfast table, kind smiles, soft sunlight" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 건강 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("돋보기") || cleanTopic.includes("글씨")) {
    return {
      shorts_title: "핸드폰 글씨가 작아서 불편하다면? 1분 만에 돋보기 만드는 법",
      scenes: [
        { scene_id: 1, narration: "핸드폰 글씨가 작아서 불편하다면? 1분 만에 돋보기 만드는 법", image_prompt: "[영상] 거실 소파에서 안경을 벗고 인상을 찌푸리며 스마트폰을 보던 어르신이 화면을 터치하자 글씨가 커지며 환하게 웃는 모습. Cinematic slow pan, an elderly Korean man squinting at his smartphone on a sofa, then smiling brightly with relief as the text enlarges clearly, cozy living room" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "설정 창에서 '디스플레이'에 들어가 '글자 크기'를 최대로 키우면 카카오톡과 뉴스가 아주 시원하게 보입니다.", image_prompt: "[이미지] 스마트폰 화면 설정 창에서 글자 크기 조절 바를 오른쪽으로 움직여 글씨가 크고 선명해진 직관적인 화면. A clean clear smartphone screen showing the font size adjustment slider moved to maximum, crisp large Korean text, sharp focus" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "또한 '접근성' 메뉴에서 '돋보기' 단축키를 켜두면 약병이나 영수증의 작은 글씨도 카메라로 크게 확대해 볼 수 있어요.", image_prompt: "[이미지] 스마트폰 카메라 돋보기 기능으로 약병 뒷면의 작은 안내 글씨를 크고 선명하게 확대해서 보며 안도하는 어르신. A Korean senior woman happily viewing enlarged clear text on a medicine bottle using her smartphone magnifier app, relieved expression" + fixedParams, gen_type: "image" },
        { scene_id: 4, fallback_type: true, narration: "자녀들 기다릴 필요 없이 지금 당장 1분만 따라 해보시고 눈 편하게 스마트폰 사용하세요!", image_prompt: "[이미지] 쾌적한 카페에서 큰 글씨로 설정된 스마트폰으로 편하게 뉴스를 읽으며 여유롭게 커피를 마시는 노신사. A dignified Korean senior man comfortably reading large text news on his smartphone in a bright sunlit cafe, relaxed expression" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 스마트 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  if (cleanTopic.includes("손주") || cleanTopic.includes("인생샷")) {
    return {
      shorts_title: "스마트폰 하나로 우리 손주 예쁘게 찍어주는 인생샷 비법",
      scenes: [
        { scene_id: 1, narration: "스마트폰 하나로 우리 손주 예쁘게 찍어주는 인생샷 비법", image_prompt: "[영상] 화창한 공원에서 해맑게 웃으며 뛰어오는 귀여운 손주를 스마트폰으로 열정적으로 촬영하며 행복해하는 할아버지. Cinematic slow tracking shot, a happy grandfather enthusiastically filming his cute running grandchild with a modern smartphone in a beautiful sunny park, joyful atmosphere" + fixedParams, gen_type: "video" },
        { scene_id: 2, narration: "카메라 앱에서 '인물 사진' 모드를 선택하시면 배경은 부드럽게 흐려지고 손주의 얼굴이 화보처럼 돋보입니다.", image_prompt: "[이미지] 스마트폰 화면 속에 완벽하게 초점이 맞은 귀여운 아이의 미소와 아름답게 흐려진 보케(Bokeh) 공원 배경. A stunning portrait of a cute smiling Korean child displayed on a clean smartphone screen, beautiful blurry bokeh park background, sharp focus" + fixedParams, gen_type: "image" },
        { scene_id: 3, narration: "아이의 눈높이에 맞춰 무릎을 굽히고 찍으면 다리도 길어 보이고 표정이 훨씬 자연스럽게 담겨요.", image_prompt: "[이미지] 잔디밭에서 무릎을 굽히고 아이와 눈을 맞추며 다정한 미소로 스마트폰 카메라를 들이대는 따뜻한 할머니. A warm elderly Korean woman kneeling on the grass, making eye contact and smiling gently while taking a photo of her grandchild" + fixedParams, gen_type: "image" },
        { scene_id: 4, narration: "이번 주말, 사랑하는 손주에게 평생 기억에 남을 멋진 인생샷을 직접 선물해 보세요!", image_prompt: "[이미지] 아늑한 거실에서 할아버지 할머니와 손주가 함께 모여 스마트폰으로 찍은 멋진 사진들을 보며 웃음꽃을 피우는 풍경. A heartwarming family scene of grandparents and grandchild laughing together while looking at beautiful photos on a smartphone, cozy living room" + fixedParams, gen_type: "image" },
        { scene_id: 5, narration: "돈 버는 시니어 스마트 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
      ]
    };
  }
  
  // 기본 기초연금 / 기타 Fallback (동적 제목 적용)
  const fallbackTitle = cleanTopic.replace(/\[.*?\]\s*/, '');
  return {
    shorts_title: fallbackTitle.length < 35 ? fallbackTitle : "월 40만원 기초연금, 아직도 신청 안 하셨나요?",
    scenes: [
      { scene_id: 1, narration: fallbackTitle.length < 35 ? fallbackTitle : "월 40만원 기초연금, 아직도 신청 안 하셨나요?", image_prompt: "[영상] 모던한 거실에서 연금 통장을 손에 쥐고 환하고 행복하게 웃는 우아한 노부부. Cinematic slow zoom in, a dignified elderly Korean couple holding a bankbook with happy proud smiles, modern living room, warm morning sunlight, realistic gentle motion" + fixedParams, gen_type: "video" },
      { scene_id: 2, narration: "내년부터 수급 자격이 대폭 완화되어 더 많은 분들이 혜택을 받습니다.", image_prompt: "[이미지] 안도감 어린 표정으로 복지센터와 전화 상담을 나누며 미소 짓는 어르신. A highly detailed portrait of a Korean senior woman in her 70s talking on the phone with a community center, relieved expression, warm soft lighting" + fixedParams, gen_type: "image" },
      { scene_id: 3, narration: "단독가구 기준 월 소득 인정액이 250만원 이하면 가능해요.", image_prompt: "[이미지] 원목 테이블 위 커피잔 옆에 놓인 깔끔하고 이해하기 쉬운 소득 기준 차트. A clean graphic chart showing income criteria on a wooden table next to a coffee cup, cozy cafe atmosphere, sharp focus, highly detailed" + fixedParams, gen_type: "image" },
      { scene_id: 4, narration: "주민센터나 복지로 홈페이지에서 신분증만 있으면 즉시 신청!", image_prompt: "[이미지] 화창한 날씨에 가벼운 발걸음으로 화사한 주민센터 건물을 향해 걷는 노신사. A Korean senior man walking happily towards a bright community center building, sunny day, vibrant colors, cinematic lighting" + fixedParams, gen_type: "image" },
      { scene_id: 5, narration: "더 많은 시니어 꿀팁을 원하시면 구독과 좋아요 눌러주세요!", image_prompt: "[영상] 카메라를 향해 환하게 웃으며 손을 흔드는 노부부. Cinematic slow motion tracking shot, a happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, warm golden hour lighting" + fixedParams, gen_type: "video" }
    ]
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, topic, source, mode, scenes: customScenes, shorts_title: customTitle, apiKeys, ttsVoice, bgmTrack } = body;

    const geminiApiKey = apiKeys?.geminiKey?.trim() || process.env.GEMINI_API_KEY || "AIzaSyAUUp084Z6vN9NnjjfKHzUCjlG1Dg_Z-Wc";

    // -------------------------------------------------------------------------
    // [Step 2] AI 대본 및 맞춤형 프롬프트 생성 단계 (사용자 직접 생성용 한글+영어 하이브리드)
    // -------------------------------------------------------------------------
    if (mode === "step2_script") {
      let scriptResult = null;
      let isRealApi = false;
      const fixedParams = ", shot on 85mm lens, f/1.8 aperture, cinematic lighting, realistic skin texture, subtle wrinkles, natural pores, caught in a candid moment, non-symmetrical face, authentic Korean senior, soft natural light, no airbrushing, look like a real documentary photograph, depth of field, 8k resolution --ar 9:16";
      
      if (geminiApiKey) {
        try {
          const sysPrompt = `당신은 유튜브 숏폼 대본 및 최고급 AI 시각화 프롬프트 엔지니어입니다.
주제: ${topic || "2026년 시니어 복지 꿀팁"}
위 주제로 시니어(6070) 타겟의 50초 숏폼 대본(총 5개 씬)을 작성하세요.
각 씬마다 'gen_type'을 'video' 또는 'image' 중 하나로 적절히 할당하세요.
[중요: 시니어 타겟 내레이션 작성 지침]
- 어르신들이 듣기에 말이 너무 빠르지 않도록 문장의 길이를 간결하게 하고, 호흡 간격을 여유롭게 배치하세요.
- AI 성우가 차분하고 느린 톤으로 낭독할 수 있도록 발음하기 편한 단어와 자연스러운 경어체를 사용하세요.

사용자가 직접 외부 최고급 AI 툴(Luma Dream Machine, Midjourney v6 등)에 복사해서 최상의 결과물을 얻을 수 있도록 'image_prompt' 필드를 아래 규칙으로 '극도로 디테일하게' 작성하세요.

1. gen_type이 'video' (플로우)인 경우: 
- 카메라 앵글(Wide shot, Tracking shot 등), 인물의 미세한 표정과 행동 변화, 주변 환경의 디테일, 시간대, 빛의 느낌, 그리고 구체적인 카메라 무빙(Slow pan, slight zoom in 등)을 포함하여 작성하세요.
- 반드시 [영상] 말머리와 함께 상황을 설명하는 한글 1~2문장 뒤에 핵심 영문 프롬프트를 적고, 맨 끝에 아래의 고정 파라미터 문자열을 반드시 그대로 붙여주세요.
- 고정 파라미터: ${fixedParams}
- (예시: [영상] 햇살이 비치는 공원에서 활짝 웃으며 걷는 시니어 부부. Cinematic tracking shot, a dignified Korean elderly couple walking happily in a beautiful lush park, warm morning sunlight filtering through trees, highly detailed, realistic motion, slow pan to the right${fixedParams})

2. gen_type이 'image' (나노바나나)인 경우: 
- 인물의 옷차림, 나이대(60s, 70s), 표정, 배경의 구체적인 소품 등을 설명하는 핵심 영문 프롬프트를 적고, 맨 끝에 아래의 고정 파라미터 문자열을 반드시 그대로 붙여주세요.
- 고정 파라미터: ${fixedParams}
- (예시: [이미지] 세련된 거실에서 차를 마시며 여유롭게 미소 짓는 노부부. A highly detailed portrait of an elegant Korean elderly couple in their 70s, drinking tea in a modern cozy living room, warm morning sunlight streaming through the window, kind smile, wearing neat casual clothes${fixedParams})

응답은 반드시 아래 JSON 구조만 반환하세요:
{
  "shorts_title": "숏폼 제목",
  "scenes": [
    { "scene_id": 1, "narration": "내레이션", "image_prompt": "프롬프트", "gen_type": "video" }
  ]
}`;
          
          const textRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: sysPrompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          });
          
          if (textRes.ok) {
            const textData = await textRes.json();
            const rawJson = textData?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawJson) {
              scriptResult = JSON.parse(rawJson);
              isRealApi = true;
            }
          }
        } catch (err) {
          console.error("Step2 Script Gemini Error:", err);
        }
      }
      
      // API 실패 시 Fallback 적용
      if (!scriptResult || !scriptResult.scenes) {
        scriptResult = generateSmartFallback(topic);
      }
      
      return NextResponse.json({ success: true, data: scriptResult, isRealApi });
    }

    return NextResponse.json({ success: false, error: "알 수 없는 요청 모드입니다." }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
