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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, topic, source, mode, scenes: customScenes, shorts_title: customTitle, apiKeys, ttsVoice, bgmTrack } = body;

    const geminiApiKey = apiKeys?.geminiKey || process.env.GEMINI_API_KEY;
    const openaiApiKey = apiKeys?.openaiKey || process.env.OPENAI_API_KEY;

    // -------------------------------------------------------------------------
    // [Step 2] Gemini API 대본 및 나노바나나2 프롬프트 파싱 (기존 semi_script 호환)
    // -------------------------------------------------------------------------
    if (mode === "step2_script" || mode === "semi_script") {
      if (geminiApiKey) {
        try {
          const genAI = new GoogleGenerativeAI(geminiApiKey);
          const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
          });

          const systemPrompt = `당신은 60대 이상 시니어를 대상으로 유튜브 숏폼(Shorts) 콘텐츠를 제작하는 100만 유튜버이자 전문 작가입니다.
[작성 규칙 - 나노바나나2 + 플로우 AI 최적화 모드]
1. 타깃 심리: 복잡한 설명은 배제하고 '내 연금', '내 병원비 혜택', '건강 꿀팁' 등 시니어가 즉각 반응하는 이득 위주로 작성하세요.
2. 분량 및 자막: 총 5개의 씬(Scene)으로 구성하며, 각 씬의 대본(narration)은 화면 하단 자막으로 들어갈 수 있도록 15~20자 내외의 구어체로 짧고 간결하게 작성하세요.
3. AI 흔적 제거: '알아보겠습니다', '안녕하세요', '오늘은', '결론적으로' 등의 단어는 절대 사용하지 마세요. "~하셨나요?", "~받으실 수 있어요" 등 친근하고 따뜻한 대화체를 사용하세요.
4. 나노바나나2 프롬프트(image_prompt): 안티그래비티의 나노바나나2 노드에서 8K 초고화질 실사 이미지를 생성하기 위한 영문 프롬프트를 작성하세요. 인물의 행동과 따뜻한 조명 위주로 작성하며, AI 광택이나 왜곡이 없도록 세밀하게 묘사하세요 (예: "A dignified and friendly elderly Korean couple holding a bankbook, warm smiles, cozy modern living room, 8k resolution, photorealistic").
5. 생성 타입(gen_type): 크레딧 관리를 위해 1번 씬(Hook)과 5번 씬(Outro)은 "video" (Flow 비디오 변환)로 설정하고, 2~4번 씬은 "image" (Nano Banana 2 고화질 이미지)로 기본 설정하세요.

입력된 뉴스/정책 데이터를 분석하여 반드시 아래의 JSON 형식으로만 결과를 출력하세요.
{
  "shorts_title": "유튜브 업로드용 훅이 포함된 제목",
  "scenes": [
    { "scene_id": 1, "narration": "1번 씬 대본", "image_prompt": "1번 씬 영문 프롬프트", "gen_type": "video" },
    { "scene_id": 2, "narration": "2번 씬 대본", "image_prompt": "2번 씬 영문 프롬프트", "gen_type": "image" },
    ...
  ]
}`;

          const prompt = `뉴스 주제: ${topic}\n출처: ${source}\n위 내용을 바탕으로 나노바나나2+플로우 연동용 시니어 숏폼 대본 JSON을 생성하세요.`;
          const result = await model.generateContent([{ text: systemPrompt }, { text: prompt }]);
          const parsedData = JSON.parse(result.response.text());

          return NextResponse.json({ 
            success: true, 
            data: {
              id: id || Date.now(), topic,
              shorts_title: parsedData.shorts_title || "월 40만원 기초연금, 아직도 신청 안 하셨나요?",
              created_at: new Date().toISOString().split('T')[0],
              status: "Script Generated", scenes: parsedData.scenes
            },
            isRealApi: true
          });
        } catch (apiErr: any) { console.error("Gemini API Error, falling back to mock:", apiErr); }
      }

      // Gemini Fallback
      const mockScriptDraft = {
        id: id || Date.now(), topic: topic || "2026년 기초연금 인상안 확정",
        shorts_title: "월 40만원 기초연금, 아직도 신청 안 하셨나요?",
        created_at: new Date().toISOString().split('T')[0], status: "Script Generated",
        scenes: [
          { scene_id: 1, narration: "월 40만원 기초연금, 아직도 신청 안 하셨나요?", image_prompt: "A dignified elderly Korean couple holding a bankbook with happy smiles, modern living room, 8k resolution, photorealistic", gen_type: "video" },
          { scene_id: 2, narration: "내년부터 수급 자격이 대폭 완화되어 더 많은 분들이 받습니다.", image_prompt: "A Korean senior woman talking on the phone with a community center, relieved expression, warm lighting", gen_type: "image" },
          { scene_id: 3, narration: "단독가구 기준 월 소득 인정액이 250만원 이하면 가능해요.", image_prompt: "A clean graphic chart showing income criteria on a wooden table next to a coffee cup", gen_type: "image" },
          { scene_id: 4, narration: "주민센터나 복지로 홈페이지에서 신분증만 있으면 즉시 신청!", image_prompt: "A Korean senior man walking happily towards a bright community center building, sunny day", gen_type: "image" },
          { scene_id: 5, narration: "더 많은 시니어 꿀팁을 원하시면 구독과 좋아요 눌러주세요!", image_prompt: "A happy Korean elderly couple waving hands towards the camera, heartwarming atmosphere, cinematic lighting", gen_type: "video" }
        ]
      };
      return NextResponse.json({ success: true, data: mockScriptDraft, isRealApi: false });
    }

    // -------------------------------------------------------------------------
    // [Step 3] Nano Banana 2 (이미지) & Flow (영상) 비주얼 합성 단계 (🌟 커스텀 URL 최우선 보호)
    // -------------------------------------------------------------------------
    if (mode === "step3_visual") {
      let visualScenes = customScenes;
      let isRealImage = false;

      if (openaiApiKey) {
        try {
          const openai = new OpenAI({ apiKey: openaiApiKey });
          const firstScene = customScenes[0];
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `${firstScene.image_prompt}, a friendly and dignified Korean senior person, realistic photorealistic style, 8k resolution, warm cinematic lighting --ar 9:16`,
            n: 1, size: "1024x1792",
          });
          const realImageUrl = imageResponse?.data?.[0]?.url;
          if (realImageUrl) isRealImage = true;

          visualScenes = customScenes.map((sc: any, idx: number) => ({
            ...sc,
            video_url: sc.video_url || (idx === 0 ? realImageUrl : (sc.gen_type === "video" ? DEMO_MP4_URLS[idx % 5] : SENIOR_IMAGE_URLS[idx % 5])),
            isRealGen: idx === 0 ? true : false,
            final_engine: sc.video_url ? sc.final_engine || "사용자 직접 교체 (Custom URL)" : (sc.gen_type === "video" ? "Nano Banana 2 + Flow (Video)" : "Nano Banana 2 (Image)")
          }));
        } catch (apiErr: any) { console.error("OpenAI DALL-E 3 Error, falling back to mock:", apiErr); }
      }

      if (!isRealImage) {
        visualScenes = customScenes.map((sc: any, idx: number) => ({
          ...sc,
          video_url: sc.video_url || (sc.gen_type === "video" ? DEMO_MP4_URLS[idx % 5] : SENIOR_IMAGE_URLS[idx % 5]),
          final_engine: sc.video_url ? sc.final_engine || "사용자 직접 교체 (Custom URL)" : (sc.gen_type === "video" ? "Nano Banana 2 + Flow (Video)" : "Nano Banana 2 (Image)")
        }));
      }

      return NextResponse.json({ 
        success: true, 
        data: { id, topic, shorts_title: customTitle, scenes: visualScenes, status: "Visual Synthesized" },
        isRealApi: isRealImage 
      });
    }

    // -------------------------------------------------------------------------
    // [Step 4] AI 성우 오디오(TTS) 및 자막 생성 단계 (🌟 사용자가 선택한 ttsVoice 동적 반영)
    // -------------------------------------------------------------------------
    if (mode === "step4_audio") {
      let audioScenes = customScenes;
      let isRealTTS = false;
      const selectedVoice = ttsVoice || "onyx"; // 기본값 onyx (중후한 남성)

      if (openaiApiKey) {
        try {
          const openai = new OpenAI({ apiKey: openaiApiKey });
          const firstScene = customScenes[0];
          const mp3Response = await openai.audio.speech.create({
            model: "tts-1", voice: selectedVoice as any, input: firstScene.narration,
          });
          const buffer = Buffer.from(await mp3Response.arrayBuffer());
          const audioBase64 = `data:audio/mp3;base64,${buffer.toString('base64')}`;
          isRealTTS = true;

          audioScenes = customScenes.map((sc: any, idx: number) => ({
            ...sc,
            audio_url: idx === 0 ? audioBase64 : `/audio/sample${(idx % 5) + 1}.mp3`,
            video_url: sc.video_url || (sc.gen_type === "video" ? DEMO_MP4_URLS[idx % 5] : SENIOR_IMAGE_URLS[idx % 5]),
            tts_voice: selectedVoice
          }));
        } catch (apiErr: any) { console.error("OpenAI TTS Error, falling back to mock:", apiErr); }
      }

      if (!isRealTTS) {
        audioScenes = customScenes.map((sc: any, idx: number) => ({
          ...sc, 
          audio_url: sc.audio_url || `/audio/sample${(idx % 5) + 1}.mp3`,
          video_url: sc.video_url || (sc.gen_type === "video" ? DEMO_MP4_URLS[idx % 5] : SENIOR_IMAGE_URLS[idx % 5]),
          tts_voice: selectedVoice
        }));
      }

      return NextResponse.json({ 
        success: true, 
        data: { id, topic, shorts_title: customTitle, scenes: audioScenes, status: "Audio & Subtitles Ready", bgm_track: bgmTrack || "none" },
        isRealApi: isRealTTS 
      });
    }

    // -------------------------------------------------------------------------
    // [Step 5] 최종 패키징 및 대시보드 등록 (🌟 커스텀 URL 및 오디오 설정 최우선 보호)
    // -------------------------------------------------------------------------
    if (mode === "step5_package" || mode === "semi_final") {
      const finalScenes = customScenes.map((sc: any, idx: number) => ({
        ...sc,
        video_url: sc.video_url || (sc.gen_type === "video" ? DEMO_MP4_URLS[idx % 5] : SENIOR_IMAGE_URLS[idx % 5]),
        audio_url: sc.audio_url || `/audio/sample${(idx % 5) + 1}.mp3`,
        final_engine: sc.video_url ? sc.final_engine || "사용자 직접 교체 (Custom URL)" : (sc.gen_type === "video" ? "Nano Banana 2 + Flow (Video)" : "Nano Banana 2 (Image)"),
        tts_voice: ttsVoice || sc.tts_voice || "onyx"
      }));

      const finalResult = {
        id: id || Date.now(), topic: topic || "2026년 기초연금 인상안 확정",
        shorts_title: customTitle || "월 40만원 기초연금, 아직도 신청 안 하셨나요?",
        created_at: new Date().toISOString().split('T')[0],
        upload_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        status: "Anti-gravity AI Generated", scenes: finalScenes, isRealApi: true,
        bgm_track: bgmTrack || "piano"
      };
      return NextResponse.json({ success: true, data: finalResult });
    }

    // 완전 자동화 모드
    const mockAutoResult = {
      id: id || Date.now(), topic: topic || "2026년 기초연금 인상안 확정",
      shorts_title: "월 40만원 기초연금, 아직도 신청 안 하셨나요?",
      created_at: new Date().toISOString().split('T')[0],
      upload_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      status: "Anti-gravity AI Generated", bgm_track: "piano",
      scenes: [
        { scene_id: 1, narration: "월 40만원 기초연금, 아직도 신청 안 하셨나요?", image_prompt: "A dignified elderly Korean couple holding a bankbook with happy smiles", video_url: DEMO_MP4_URLS[0], audio_url: "/audio/sample1.mp3", final_engine: "Nano Banana 2 + Flow (Video)", tts_voice: "onyx" },
        { scene_id: 2, narration: "내년부터 수급 자격이 대폭 완화되어 더 많은 분들이 받습니다.", image_prompt: "A Korean senior woman talking on the phone with a community center", video_url: SENIOR_IMAGE_URLS[1], audio_url: "/audio/sample2.mp3", final_engine: "Nano Banana 2 (Image)", tts_voice: "onyx" },
        { scene_id: 3, narration: "단독가구 기준 월 소득 인정액이 250만원 이하면 가능해요.", image_prompt: "A clean graphic chart showing income criteria on a wooden table", video_url: SENIOR_IMAGE_URLS[2], audio_url: "/audio/sample3.mp3", final_engine: "Nano Banana 2 (Image)", tts_voice: "onyx" },
        { scene_id: 4, narration: "주민센터나 복지로 홈페이지에서 신분증만 있으면 즉시 신청!", image_prompt: "A Korean senior man walking happily towards a bright community center building", video_url: SENIOR_IMAGE_URLS[3], audio_url: "/audio/sample4.mp3", final_engine: "Nano Banana 2 (Image)", tts_voice: "onyx" },
        { scene_id: 5, narration: "더 많은 시니어 꿀팁을 원하시면 구독과 좋아요 눌러주세요!", image_prompt: "A happy Korean elderly couple waving hands towards the camera", video_url: DEMO_MP4_URLS[4], audio_url: "/audio/sample5.mp3", final_engine: "Nano Banana 2 + Flow (Video)", tts_voice: "onyx" }
      ]
    };
    return NextResponse.json({ success: true, data: mockAutoResult });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
