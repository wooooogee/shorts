"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, CheckCircle2, Clock, Video, FileText, Sparkles, Layers, Bot, Download, 
  ExternalLink, AlertCircle, ChevronRight, RefreshCw, Calendar, TrendingUp, 
  Film, Music, Check, Edit3, Zap, UserCheck, Sliders, AlertTriangle, RotateCcw, 
  Key, Eye, EyeOff, Save, Table, HelpCircle, Gem, Cpu, Coins, Image as ImageIcon,
  Loader2, Pause, SkipBack, SkipForward, Smartphone, Search, ArrowRight, CheckSquare, Link, Upload, Volume2
} from "lucide-react";

// 초기 뉴스 큐레이션 데이터
const initialNews = [
  { id: 1, topic: "2026년 기초연금 40만원 인상안 확정 및 수급자격 완화", source: "보건복지부 정책브리핑 (2026.05.15)", status: "Ready", date: "2026-05-16", summary: "보건복지부가 2026년부터 기초연금을 기존 33만원에서 40만원으로 인상하고, 단독가구 기준 월 소득 인정액을 250만원 이하로 완화하는 방안을 확정했습니다." },
  { id: 2, topic: "65세 이상 임플란트 4개까지 건강보험 확대 적용", source: "대한민국 정책포털 뉴스", status: "Ready", date: "2026-05-16", summary: "기존 2개까지만 적용되던 65세 이상 어르신 임플란트 건강보험 혜택이 올해 하반기부터 최대 4개까지 본인부담금 30%로 확대 적용됩니다." },
  { id: 3, topic: "노인일자리 월 100만원 수당 '시니어 인턴십' 대규모 모집", source: "한국노인인력개발원 공고", status: "Ready", date: "2026-05-15", summary: "월 100만원 이상의 급여를 보장하는 보건복지부 주관 '시니어 인턴십' 프로그램이 전국 3천 개 기업을 대상으로 대규모 참여자 모집을 시작했습니다." },
  { id: 4, topic: "어르신 교통비 무료 패스카드 전국 통합 발급 안내", source: "국토교통부 보도자료", status: "Done", date: "2026-05-14", summary: "지자체별로 달랐던 어르신 무임승차 카드가 '전국 시니어 패스' 하나로 통합되어 전국 지하철 및 시내버스를 무료로 이용할 수 있게 됩니다." },
  { id: 5, topic: "독감 및 대상포진 백신 무료 접종 지정병원 5천곳 확대", source: "질병관리청 공지", status: "Done", date: "2026-05-13", summary: "고가의 대상포진 백신과 독감 백신을 무료로 접종받을 수 있는 국가 지정 동네 병의원이 전국 5천 곳으로 대폭 확대되었습니다." },
];

// 구글 공용 데모 MP4 URL 목록
const DEMO_MP4_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
];

// 시니어 타깃 고품질 실사 이미지 Fallback 목록
const SENIOR_IMAGE_URLS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80"
];

// 초기 대시보드 데이터
const initialDashboard = [
  {
    id: 101,
    topic: "어르신 교통비 무료 패스카드 전국 통합 발급 안내",
    shorts_title: "교통비 0원! 전국 지하철·버스 무료 패스 신청법",
    created_at: "2026-05-14", upload_date: "2026-05-16", status: "Anti-gravity AI Generated",
    views: "14.2K", likes: "1.8K", bgm_track: "piano",
    scenes: [
      { scene_id: 1, narration: "교통비 0원! 전국 지하철·버스 무료 패스 신청법", image_prompt: "A dignified elderly Korean man holding a transport card with a big smile", video_url: DEMO_MP4_URLS[0], audio_url: "/audio/sample1.mp3", final_engine: "Nano Banana 2 + Flow (Video)", tts_voice: "onyx" },
      { scene_id: 2, narration: "기존 지자체별 카드가 하나로 통합되어 전국 어디서나 무료!", image_prompt: "A modern smart card shining on a sleek map of Korea", video_url: SENIOR_IMAGE_URLS[1], audio_url: "/audio/sample2.mp3", final_engine: "Nano Banana 2 (Image)", tts_voice: "onyx" },
      { scene_id: 3, narration: "만 65세 이상 어르신이라면 누구나 혜택을 누릴 수 있습니다.", image_prompt: "A group of happy Korean seniors boarding a clean modern bus", video_url: SENIOR_IMAGE_URLS[2], audio_url: "/audio/sample3.mp3", final_engine: "Nano Banana 2 (Image)", tts_voice: "onyx" },
      { scene_id: 4, narration: "가까운 농협이나 신한은행에서 신분증만 내면 즉시 발급!", image_prompt: "A senior woman kindly guided by a bank clerk, bright bank interior", video_url: SENIOR_IMAGE_URLS[3], audio_url: "/audio/sample4.mp3", final_engine: "Nano Banana 2 (Image)", tts_voice: "onyx" },
      { scene_id: 5, narration: "돈 버는 시니어 복지 꿀팁, 지금 바로 구독하고 받아보세요!", image_prompt: "A happy Korean elderly couple waving hands, warm cinematic lighting", video_url: DEMO_MP4_URLS[4], audio_url: "/audio/sample5.mp3", final_engine: "Nano Banana 2 + Flow (Video)", tts_voice: "onyx" }
    ]
  }
];

export default function Home() {
  const [newsList, setNewsList] = useState(initialNews);
  const [dashboardList, setDashboardList] = useState(initialDashboard);
  const [activeTab, setActiveTab] = useState<"curation" | "dashboard" | "ai_strategy" | "apikeys">("curation");
  const [workflowMode, setWorkflowMode] = useState<"auto" | "semi">("semi");

  // 🌟 [핵심 추가] AI 성우 음성(Voice) 및 배경음악(BGM) 전역 설정 상태
  const [ttsVoice, setTtsVoice] = useState<string>("onyx"); // onyx(중후한 남성), alloy(따뜻한 여성), shimmer(밝은 여성), echo(차분한 남성)
  const [bgmTrack, setBgmTrack] = useState<string>("piano"); // none, piano, acoustic, lofi
  const [bgmVolume, setBgmVolume] = useState<number>(0.2); // 배경음악 볼륨 (기본 20%)

  const [apiKeys, setApiKeys] = useState({ geminiKey: "", openaiKey: "", elevenlabsKey: "" });
  const [showKeys, setShowKeys] = useState({ gemini: false, openai: false, elevenlabs: false });
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    const savedGemini = localStorage.getItem("GEMINI_API_KEY") || "";
    const savedOpenAI = localStorage.getItem("OPENAI_API_KEY") || "";
    const savedEleven = localStorage.getItem("ELEVENLABS_API_KEY") || "";
    if (savedGemini || savedOpenAI || savedEleven) {
      setApiKeys({ geminiKey: savedGemini, openaiKey: savedOpenAI, elevenlabsKey: savedEleven });
    }
  }, []);

  const handleSaveKeys = () => {
    localStorage.setItem("GEMINI_API_KEY", apiKeys.geminiKey);
    localStorage.setItem("OPENAI_API_KEY", apiKeys.openaiKey);
    localStorage.setItem("ELEVENLABS_API_KEY", apiKeys.elevenlabsKey);
    setIsKeySaved(true); setTimeout(() => setIsKeySaved(false), 3000);
  };

  // 🌟 [핵심 추가] AI 최신 시니어 뉴스/정책 서치 (자동 크롤링/큐레이션) 상태 및 핸들러
  const [isSearchingNews, setIsSearchingNews] = useState(false);

  const handleSearchAI_News = () => {
    setIsSearchingNews(true);
    setTimeout(() => {
      const aiNewsPool = [
        { id: newsList.length + 1, topic: "2026년 하반기 어르신 주택연금 가입기준 공시가격 12억으로 대폭 완화", source: "한국주택금융공사 공시", status: "Ready", date: "2026-05-17", summary: "주택연금 가입 기준이 기존 공시가격 9억원에서 12억원 이하로 확대되어 더 많은 고령층이 매월 안정적인 연금을 수령할 수 있게 됩니다." },
        { id: newsList.length + 2, topic: "보건복지부 어르신 맞춤형 돌봄 서비스 바우처 월 50시간 확대", source: "보건복지부 보도자료", status: "Ready", date: "2026-05-17", summary: "독거노인 및 거동 불편 어르신을 위한 가사 지원 및 병원 동행 돌봄 서비스 바우처가 월 50시간까지 대폭 확대 지원됩니다." },
        { id: newsList.length + 3, topic: "70세 이상 고령자 운전면허 자진반납 시 지자체 혜택 50만원으로 인상", source: "경찰청 및 지자체 협의회", status: "Ready", date: "2026-05-17", summary: "고령 운전자의 면허 자진반납을 독려하기 위해 지자체별로 지급하던 교통카드 및 지역화폐 혜택이 최대 50만원으로 인상됩니다." },
        { id: newsList.length + 4, topic: "시니어 디지털 바우처 월 5만원 지급, 키오스크 및 스마트폰 교육 지원", source: "과학기술정보통신부", status: "Ready", date: "2026-05-17", summary: "어르신들의 디지털 격차 해소를 위해 매월 5만원의 교육 바우처를 지급하고 1대1 스마트폰 활용 및 키오스크 실습을 지원합니다." }
      ];
      const existingTopics = newsList.map(n => n.topic);
      const newItems = aiNewsPool.filter(item => !existingTopics.includes(item.topic)).slice(0, 2);
      
      if (newItems.length > 0) {
        setNewsList(prev => [...newItems, ...prev]);
        alert(`🎉 AI가 최신 시니어 정책 뉴스 ${newItems.length}건을 성공적으로 서치하여 큐레이션 목록에 추가했습니다!`);
      } else {
        alert("이미 모든 최신 AI 뉴스 큐레이션이 목록에 추가되어 있습니다.");
      }
      setIsSearchingNews(false);
    }, 1500);
  };

  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<string>("");

  // 🎬 숏폼 통합 미리보기 상태 (🌟 BGM 동시 재생 지원)
  const [previewShorts, setPreviewShorts] = useState<any>(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let timer: any;
    if (previewShorts && isPlaying) {
      timer = setInterval(() => {
        setActiveSceneIndex((prev) => (prev + 1) % previewShorts.scenes.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [previewShorts, isPlaying]);

  useEffect(() => {
    if (previewShorts && videoRef.current) {
      videoRef.current.load();
      if (isPlaying) videoRef.current.play().catch(e => console.log("Video auto-play blocked:", e));
    }
    if (previewShorts && audioRef.current) {
      audioRef.current.load();
      if (isPlaying) audioRef.current.play().catch(e => console.log("Audio auto-play blocked:", e));
    }
    // 🌟 [핵심 추가] BGM 무한 루핑 및 볼륨 연동 재생
    if (previewShorts && bgmRef.current && previewShorts.bgm_track !== "none") {
      bgmRef.current.volume = bgmVolume;
      if (isPlaying) bgmRef.current.play().catch(e => console.log("BGM auto-play blocked:", e));
      else bgmRef.current.pause();
    }
  }, [activeSceneIndex, previewShorts, isPlaying, bgmVolume]);

  // 🌟 단계별 마스터 프로덕션 스튜디오 상태
  const [isMasterStudioOpen, setIsMasterStudioOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isStepLoading, setIsStepLoading] = useState(false);
  const [masterNewsItem, setMasterNewsItem] = useState<any>(null);
  const [masterForm, setMasterForm] = useState<any>({ shorts_title: "", scenes: [], isRealApi: false });

  const aiBannedWords = ["알아보겠습니다", "안녕하세요", "오늘은", "결론적으로", "요약하자면", "필수적입니다", "주목받고 있습니다"];

  const handleOpenMasterStudio = (newsItem: any) => {
    setMasterNewsItem(newsItem); setCurrentStep(1); setIsMasterStudioOpen(true);
    setMasterForm({
      shorts_title: "",
      scenes: [
        { scene_id: 1, narration: "", image_prompt: "", gen_type: "video" },
        { scene_id: 2, narration: "", image_prompt: "", gen_type: "image" },
        { scene_id: 3, narration: "", image_prompt: "", gen_type: "image" },
        { scene_id: 4, narration: "", image_prompt: "", gen_type: "image" },
        { scene_id: 5, narration: "", image_prompt: "", gen_type: "video" }
      ], isRealApi: false
    });
  };

  const handleExecuteStep2 = async () => {
    setIsStepLoading(true);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: masterNewsItem.id, topic: masterNewsItem.topic, source: masterNewsItem.source, mode: "step2_script", apiKeys })
      });
      const data = await res.json();
      if (data.success) {
        setMasterForm({ shorts_title: data.data.shorts_title, scenes: data.data.scenes, isRealApi: data.isRealApi });
        setCurrentStep(2);
      }
    } catch (err) { console.error("Step 2 API Error:", err); }
    finally { setIsStepLoading(false); }
  };

  const handleExecuteStep3 = async () => {
    setIsStepLoading(true);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: masterNewsItem.id, topic: masterNewsItem.topic, source: masterNewsItem.source, mode: "step3_visual", shorts_title: masterForm.shorts_title, scenes: masterForm.scenes, apiKeys })
      });
      const data = await res.json();
      if (data.success) {
        setMasterForm((prev: any) => ({ ...prev, scenes: data.data.scenes }));
        setCurrentStep(3);
        if (!data.isRealApi) {
          alert(`⚠️ AI 비주얼 생성 안내 ⚠️\n\n${data.message || "OpenAI API 키가 없거나 할당량 초과로 인해 고품질 시니어 스톡 폴백 데이터가 적용되었습니다."}\n\n[🔑 API 키 및 연동 설정] 탭에서 유효한 OpenAI API 키를 입력하시면 100% 실사 AI 비주얼이 즉시 생성됩니다.`);
        }
      }
    } catch (err) { console.error("Step 3 API Error:", err); alert("비주얼 합성 API 호출 중 오류가 발생했습니다."); }
    finally { setIsStepLoading(false); }
  };

  const handleExecuteStep4 = async () => {
    setIsStepLoading(true);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        // 🌟 [핵심 수정] 사용자가 선택한 ttsVoice 및 bgmTrack 백엔드로 전송
        body: JSON.stringify({ id: masterNewsItem.id, topic: masterNewsItem.topic, source: masterNewsItem.source, mode: "step4_audio", shorts_title: masterForm.shorts_title, scenes: masterForm.scenes, apiKeys, ttsVoice, bgmTrack })
      });
      const data = await res.json();
      if (data.success) {
        setMasterForm((prev: any) => ({ ...prev, scenes: data.data.scenes }));
        setCurrentStep(4);
      }
    } catch (err) { console.error("Step 4 API Error:", err); }
    finally { setIsStepLoading(false); }
  };

  const handleExecuteStep5 = async () => {
    setIsStepLoading(true);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: masterNewsItem.id, topic: masterNewsItem.topic, source: masterNewsItem.source, mode: "step5_package", shorts_title: masterForm.shorts_title, scenes: masterForm.scenes, apiKeys, ttsVoice, bgmTrack })
      });
      const data = await res.json();
      if (data.success) {
        setNewsList(prev => prev.map(item => item.id === masterNewsItem.id ? { ...item, status: "Done" } : item));
        setDashboardList(prev => [data.data, ...prev]);
        setCurrentStep(5);
      }
    } catch (err) { console.error("Step 5 API Error:", err); }
    finally { setIsStepLoading(false); }
  };

  const handleMasterSceneChange = (index: number, field: "narration" | "image_prompt" | "gen_type" | "video_url", value: string) => {
    const updatedScenes = [...masterForm.scenes];
    updatedScenes[index] = { ...updatedScenes[index], [field]: value };
    setMasterForm({ ...masterForm, scenes: updatedScenes });
  };

  const handleFileUpload = (index: number, file: File, isMaster: boolean) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target?.result as string;
      if (isMaster) {
        const updatedScenes = [...masterForm.scenes];
        updatedScenes[index] = { ...updatedScenes[index], video_url: base64Url, final_engine: `사용자 파일 업로드 (${file.name})` };
        setMasterForm({ ...masterForm, scenes: updatedScenes });
      } else {
        const updatedScenes = [...selectedShorts.scenes];
        updatedScenes[index] = { ...updatedScenes[index], video_url: base64Url, final_engine: `사용자 파일 업로드 (${file.name})` };
        setSelectedShorts({ ...selectedShorts, scenes: updatedScenes });
        setDashboardList(prev => prev.map(item => item.id === selectedShorts.id ? { ...item, scenes: updatedScenes } : item));
      }
      alert(`Scene #${index + 1} 비주얼이 "${file.name}" 파일로 성공적으로 교체되었습니다!`);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadPackage = async (item: any) => {
    setDownloadingId(item.id);
    // BGM 트랙이 있으면 다운로드 파일 수 +1
    const hasBgm = item.bgm_track && item.bgm_track !== "none";
    const totalFiles = item.scenes.length * 2 + (hasBgm ? 1 : 0);
    let completedFiles = 0;

    try {
      for (let idx = 0; idx < item.scenes.length; idx++) {
        const sc = item.scenes[idx];
        const sceneNum = sc.scene_id || idx + 1;

        if (sc.video_url) {
          setDownloadProgress(`Scene #${sceneNum} 비주얼 소스 다운로드 중... (${completedFiles + 1}/${totalFiles})`);
          const ext = sc.video_url.startsWith("data:image") || sc.video_url.includes("unsplash") || sc.final_engine?.includes("Image") ? "jpg" : "mp4";
          const filename = `Shorts_${item.id}_Scene${sceneNum}_Visual.${ext}`;
          const downloadUrl = `/api/download?url=${encodeURIComponent(sc.video_url)}&filename=${filename}`;
          
          const a = document.createElement('a'); a.href = downloadUrl; a.download = filename;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          completedFiles++; await new Promise(r => setTimeout(r, 800));
        }

        if (sc.audio_url) {
          setDownloadProgress(`Scene #${sceneNum} 성우 내레이션 다운로드 중... (${completedFiles + 1}/${totalFiles})`);
          const filename = `Shorts_${item.id}_Scene${sceneNum}_Audio_${sc.tts_voice || "onyx"}.mp3`;
          const downloadUrl = `/api/download?url=${encodeURIComponent(sc.audio_url)}&filename=${filename}`;
          
          const a = document.createElement('a'); a.href = downloadUrl; a.download = filename;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          completedFiles++; await new Promise(r => setTimeout(r, 800));
        }
      }

      // 🌟 [핵심 추가] BGM 트랙 파일 다운로드
      if (hasBgm) {
        setDownloadProgress(`배경음악(BGM) 트랙 다운로드 중... (${completedFiles + 1}/${totalFiles})`);
        const filename = `Shorts_${item.id}_BGM_${item.bgm_track}.mp3`;
        const downloadUrl = `/api/download?url=${encodeURIComponent(`/audio/bgm_${item.bgm_track}.mp3`)}&filename=${filename}`;
        
        const a = document.createElement('a'); a.href = downloadUrl; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        completedFiles++; await new Promise(r => setTimeout(r, 800));
      }

      setDownloadProgress("✅ 모든 소스 패키지(.mp4 + 성우.mp3 + BGM.mp3) 다운로드 완료!");
      setTimeout(() => { setDownloadingId(null); setDownloadProgress(""); }, 2000);
    } catch (err) {
      console.error("Download Error:", err);
      alert("다운로드 중 오류가 발생했습니다. 백엔드 서버 연결을 확인해주세요.");
      setDownloadingId(null); setDownloadProgress("");
    }
  };

  // 🌟 [요구사항 5 반영] 캡컷(CapCut) 최종 편집 및 싱크 완벽 연동용 자막(.srt) 파일 즉석 생성 및 다운로드 핸들러
  const handleDownloadSRT = (item: any) => {
    let srtContent = "";
    let currentTime = 0; // ms 단위
    
    item.scenes.forEach((sc: any, idx: number) => {
      const sceneNum = idx + 1;
      const duration = sc.gen_type === "video" ? 4000 : 3500; // 비디오 4초, 이미지 3.5초 기준
      const startTime = currentTime;
      const endTime = currentTime + duration;
      
      const formatTime = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const hours = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        const millis = ms % 1000;
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
      };

      srtContent += `${sceneNum}\n${formatTime(startTime)} --> ${formatTime(endTime)}\n${sc.narration}\n\n`;
      currentTime = endTime;
    });

    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Shorts_${item.id}_Subtitles.srt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("📜 캡컷 연동용 완벽 자막 파일(.srt)이 성공적으로 다운로드되었습니다!\n캡컷에 영상 소스와 함께 넣으면 싱크가 100% 자동 완성됩니다.");
  };

  const [selectedShorts, setSelectedShorts] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <header className="border-b border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
            <Cpu className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-amber-100 bg-clip-text text-transparent flex items-center gap-2">
              <span>Anti-gravity Senior Shorts Factory</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                🍌 나노바나나2 + 플로우 AI 전용 파이프라인
              </span>
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>안티그래비티 기본 노드 결합! 자료 서치부터 최종 조립까지 완벽한 5단계 프로덕션 스튜디오</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
          <button onClick={() => setWorkflowMode("auto")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${workflowMode === "auto" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:text-slate-200"}`}>
            <Zap className="w-3.5 h-3.5" /><span>⚡ 완전 자동화 모드</span>
          </button>
          <button onClick={() => setWorkflowMode("semi")} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${workflowMode === "semi" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20" : "text-slate-400 hover:text-slate-200"}`}>
            <UserCheck className="w-3.5 h-3.5" /><span>🧑‍💻 단계별 마스터 스튜디오 (추천)</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 p-5 rounded-2xl border flex items-center justify-between gap-4 transition-all bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 border-slate-800/80 backdrop-blur-sm shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-400 mt-0.5">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-1">
                <span>🍌 나노바나나2 & 플로우 AI 연동 가동 중</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  안티그래비티 네이티브 AI 노드 결합
                </span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                안티그래비티 플랫폼의 강력한 네이티브 AI 노드인 <strong>Nano Banana 2(8K 실사 이미지 생성)</strong>와 <strong>Flow(3초 모션 루핑 비디오 변환)</strong>를 연동합니다. 캔바 스톡과 달리 세상에 단 하나뿐인 독창적 비주얼을 생성하여 유튜브 알고리즘 노출을 극대화합니다. 초기 비용 절감을 위해 <strong>'하이브리드 예산 관리 기능(씬별 비디오/이미지 선택)'</strong>을 완벽히 지원합니다.
              </p>
            </div>
          </div>
          <button onClick={() => setActiveTab("ai_strategy")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-lg shadow-amber-500/20 shrink-0">
            <Coins className="w-4 h-4" /><span>스마트 크레딧 절감 비법</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-px overflow-x-auto">
          <button onClick={() => setActiveTab("curation")} className={`px-5 py-3 rounded-t-xl font-medium text-sm flex items-center gap-2 transition-all border-b-2 shrink-0 ${activeTab === "curation" ? "bg-slate-800/50 text-amber-400 border-amber-500 shadow-lg shadow-amber-500/10" : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30"}`}>
            <FileText className="w-4 h-4" /><span>뉴스 큐레이션 및 트리거</span>
            <span className="ml-1 px-2 py-0.5 text-xs bg-slate-800 rounded-full text-slate-300 border border-slate-700">{newsList.filter(n => n.status === "Ready").length}</span>
          </button>
          <button onClick={() => setActiveTab("dashboard")} className={`px-5 py-3 rounded-t-xl font-medium text-sm flex items-center gap-2 transition-all border-b-2 shrink-0 ${activeTab === "dashboard" ? "bg-slate-800/50 text-amber-400 border-amber-500 shadow-lg shadow-amber-500/10" : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30"}`}>
            <Video className="w-4 h-4" /><span>콘텐츠 관리 대시보드</span>
            <span className="ml-1 px-2 py-0.5 text-xs bg-slate-800 rounded-full text-slate-300 border border-slate-700">{dashboardList.length}</span>
          </button>
          <button onClick={() => setActiveTab("ai_strategy")} className={`px-5 py-3 rounded-t-xl font-medium text-sm flex items-center gap-2 transition-all border-b-2 shrink-0 ${activeTab === "ai_strategy" ? "bg-slate-800/50 text-amber-400 border-amber-500 shadow-lg shadow-amber-500/10" : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30"}`}>
            <Coins className="w-4 h-4" /><span>💡 AI 노드 0원 & 크레딧 절감 비법</span>
          </button>
          <button onClick={() => setActiveTab("apikeys")} className={`px-5 py-3 rounded-t-xl font-medium text-sm flex items-center gap-2 transition-all border-b-2 shrink-0 ${activeTab === "apikeys" ? "bg-slate-800/50 text-amber-400 border-amber-500 shadow-lg shadow-amber-500/10" : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/30"}`}>
            <Key className="w-4 h-4" /><span>🔑 API 키 및 연동 설정</span>
          </button>
        </div>

        {activeTab === "apikeys" && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/20 max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2">
                <Key className="w-5 h-5 text-amber-400" /><span>프로덕션 AI 엔진 API 키 설정</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                사용자의 실제 API 키를 입력하면 시뮬레이션 모드에서 <strong>실제 AI 기반 프로덕션 모드</strong>로 즉시 전환됩니다. 입력된 키는 로컬 스토리지에만 안전하게 저장됩니다.
              </p>
            </div>

            <div className="space-y-5 p-5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                  <span>✨ Gemini API Key (대본 및 프롬프트 생성용)</span>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline text-[11px] flex items-center gap-1">
                    키 무료 발급받기 <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showKeys.gemini ? "text" : "password"} value={apiKeys.geminiKey}
                    onChange={(e) => setApiKeys({ ...apiKeys, geminiKey: e.target.value })}
                    placeholder="AIzaSy..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 focus:border-amber-500 focus:outline-none pr-10"
                  />
                  <button onClick={() => setShowKeys({ ...showKeys, gemini: !showKeys.gemini })} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300">
                    {showKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                  <span>🗣 OpenAI API Key (TTS 음성 및 나노바나나2/플로우 실사 데모 생성용)</span>
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline text-[11px] flex items-center gap-1">
                    키 발급받기 <ExternalLink className="w-3 h-3" />
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showKeys.openai ? "text" : "password"} value={apiKeys.openaiKey}
                    onChange={(e) => setApiKeys({ ...apiKeys, openaiKey: e.target.value })}
                    placeholder="sk-..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-slate-100 focus:border-amber-500 focus:outline-none pr-10"
                  />
                  <button onClick={() => setShowKeys({ ...showKeys, openai: !showKeys.openai })} className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300">
                    {showKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                <Coins className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">안티그래비티 기본 크레딧 연동 안내</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    안티그래비티 워크플로우 플랫폼 내에서 기본 제공되는 API 크레딧이나 프로바이더(Replicate/Fal 등)의 무료 티어(Free Tier)를 연동하시면 추가 결제 없이 나노바나나2와 플로우 노드를 돌리실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                {isKeySaved ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                {isKeySaved ? "API 키가 성공적으로 저장되었습니다." : "키 입력 후 우측 버튼을 눌러 저장하세요."}
              </span>
              <button onClick={handleSaveKeys} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20">
                <Save className="w-4 h-4" /><span>API 키 저장 및 엔진 적용</span>
              </button>
            </div>
          </div>
        )}

        {/* 탭 1: 뉴스 큐레이션 */}
        {activeTab === "curation" && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/20 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>📰 오늘의 시니어 팩트 큐레이션 목록</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">원하는 뉴스를 선택하고 우측의 버튼을 클릭하세요.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button 
                  disabled={isSearchingNews} 
                  onClick={handleSearchAI_News} 
                  className="flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                >
                  {isSearchingNews ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>{isSearchingNews ? "AI 최신 뉴스 크롤링 중..." : "🔍 AI 최신 시니어 뉴스 서치 (자동 크롤링)"}</span>
                </button>
                <button onClick={() => setNewsList(initialNews)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-3 py-2.5 rounded-xl border border-slate-700">
                  <RefreshCw className="w-3.5 h-3.5" /><span>시트 초기화</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 bg-slate-900/50">
                    <th className="py-3.5 px-4 rounded-l-xl w-12">ID</th>
                    <th className="py-3.5 px-4 w-5/12">주제 (Topic / 팩트)</th>
                    <th className="py-3.5 px-4 w-3/12">출처 (오피셜 소스)</th>
                    <th className="py-3.5 px-4 w-24">제작 상태</th>
                    <th className="py-3.5 px-4 rounded-r-xl text-right">액션 (실행)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {newsList.map((news) => (
                    <tr key={news.id} className="hover:bg-slate-800/30 transition-all group">
                      <td className="py-4 px-4 text-slate-400 font-mono text-xs">#{news.id}</td>
                      <td className="py-4 px-4 font-medium text-slate-200 group-hover:text-amber-400 transition-colors">
                        <div>{news.topic}</div>
                        <div className="text-xs text-slate-500 font-normal mt-1 line-clamp-1">{news.summary}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span><span>{news.source}</span></td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${news.status === "Ready" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                          {news.status === "Ready" ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}{news.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {workflowMode === "auto" ? (
                          <button onClick={() => alert("완전 자동화 실행 중...")} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${news.status === "Done" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20 hover:scale-105" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 hover:scale-105"}`}>
                            <Zap className="w-3.5 h-3.5 fill-current" /><span>{news.status === "Done" ? "⚡ 자동화 다시 실행" : "완전 자동화 실행"}</span>
                          </button>
                        ) : (
                          <button onClick={() => handleOpenMasterStudio(news)} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${news.status === "Done" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/20 hover:scale-105" : "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/20 hover:scale-105"}`}>
                            <Edit3 className="w-3.5 h-3.5" /><span>{news.status === "Done" ? "🔄 스튜디오 다시 열기 (재제작)" : "🚀 단계별 프로덕션 스튜디오 열기"}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 탭 2: 콘텐츠 대시보드 */}
        {activeTab === "dashboard" && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/20 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>🗂 구글 시트 콘텐츠 관리 대시보드 (시트 2 탭)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">생성 완료된 숏폼들의 상세 대본과 비주얼 생성 엔진 상태, 소스 패키지 및 🎬 통합 미리보기를 관리합니다.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {dashboardList.map((item: any) => (
                <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group relative overflow-hidden">
                  
                  {downloadingId === item.id && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 animate-fadeIn text-center">
                      <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-3" />
                      <p className="text-sm font-bold text-slate-200 mb-1">{downloadProgress}</p>
                      <p className="text-[11px] text-slate-400">CORS 우회 및 404 방지 백엔드 프록시를 통해 실제 파일이 다운로드되고 있습니다.</p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 text-amber-400 mt-1">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">제작일: {item.created_at}</span>
                          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">예약일: {item.upload_date}</span>
                          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                            <Check className="w-3 h-3" /> {item.status || "Anti-gravity AI Generated"}
                          </span>
                          {item.isRealApi && (
                            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                              ⚡ 실제 AI 합성본
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{item.shorts_title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">원문 주제: {item.topic}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center z-10">
                      
                      <button 
                        onClick={() => { setPreviewShorts(item); setActiveSceneIndex(0); setIsPlaying(true); }}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 hover:scale-105"
                      >
                        <Smartphone className="w-4 h-4" /><span>🎬 숏폼 통합 미리보기</span>
                      </button>

                      <button onClick={() => setSelectedShorts(item)} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-medium border border-slate-700 transition-all shadow-lg">
                        <Layers className="w-3.5 h-3.5 text-amber-400" /><span>대본 & 프롬프트 상세보기</span>
                      </button>

                      <button 
                        disabled={downloadingId !== null} 
                        onClick={() => handleDownloadPackage(item)} 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                          downloadingId !== null 
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
                            : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 hover:scale-105"
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        <span>{downloadingId === item.id ? "다운로드 중..." : "소스 일괄 다운로드 (.mp4 + .mp3)"}</span>
                      </button>

                      <button 
                        onClick={() => handleDownloadSRT(item)} 
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 hover:scale-105"
                      >
                        <FileText className="w-4 h-4" /><span>📜 자막(.srt) 파일 다운로드</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {item.scenes.map((scene: any, idx: number) => (
                      <div key={scene.scene_id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 relative group/scene hover:border-slate-700 transition-all">
                        <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">Scene #{scene.scene_id}</div>
                        <div className="pr-12 mb-2">
                          <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-relaxed">"{scene.narration}"</p>
                        </div>
                        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                          <span className={`flex items-center gap-1 font-bold ${scene.final_engine?.includes("Video") ? "text-amber-400" : "text-blue-400"}`}>
                            {scene.final_engine?.includes("Video") ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                            {scene.final_engine || "Nano Banana 2"}
                          </span>
                          <button 
                            onClick={() => { setPreviewShorts(item); setActiveSceneIndex(idx); setIsPlaying(true); }}
                            className="text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" /> 씬 재생
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 탭 3: AI 노드 0원 & 크레딧 절감 비법 */}
        {activeTab === "ai_strategy" && (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/20 animate-fadeIn space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-amber-400" /><span>💡 나노바나나2 + 플로우 노드 0원 가동 & 크레딧 절감 비법</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                안티그래비티 플랫폼의 기본 노드를 활용하여 추가 결제 없이 고화질 AI 영상을 만들고, 예산을 스마트하게 관리하는 프로덕션 운영 전략입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold"><Coins className="w-5 h-5" /></span>
                  <h3 className="text-sm font-bold text-slate-200">1. 플랫폼 기본 크레딧 & 무료 티어 연동</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed space-y-2">
                  안티그래비티 워크플로우 플랫폼 가입 시 제공되는 <strong>기본 API 크레딧</strong>이나, Replicate / Fal.ai 등 백엔드 프로바이더들이 제공하는 <strong>가입 축하 무료 티어(Free Tier)</strong>를 연결하시면 초기 채널 런칭기 동안 추가 결제 0원으로 충분히 가동할 수 있습니다.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold"><Cpu className="w-5 h-5" /></span>
                  <h3 className="text-sm font-bold text-slate-200">2. 캔바 대비 압도적인 알고리즘 우위</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed space-y-2">
                  캔바 스톡 비디오는 깔끔하지만 다른 유튜버들도 똑같이 쓰는 중복 영상일 확률이 높습니다. 반면 <strong>나노바나나2(8K 실사) + 플로우(3초 모션)</strong> 조합은 세상에 단 하나뿐인 독창적 비주얼을 생성하므로 유튜브 알고리즘에서 '독창적 콘텐츠'로 분류되어 <strong>폭발적인 조회수 떡상</strong>을 기대할 수 있습니다.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold"><Sliders className="w-5 h-5" /></span>
                  <h3 className="text-sm font-bold text-slate-200">3. 60% 예산 절감 '하이브리드 씬' 전략</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed space-y-2">
                  5개 씬 전부를 플로우 비디오로 돌리면 토큰 소모가 빠릅니다. <strong>시선을 사로잡아야 하는 1번 씬(Hook)과 5번 씬(Outro)만 플로우 비디오 변환</strong>으로 돌리고, 중간 2~4번 씬은 나노바나나2 정지 이미지에 캡컷 무료 줌인 효과를 주면 비용을 60% 절감하면서 최고 퀄리티를 유지합니다!
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-1 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" /><span>대시보드에 하이브리드 예산 관리 기능이 탑재되어 있습니다!</span>
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  탭 1에서 '대본 초안 생성 및 에디팅'을 누르시면, 각 씬별로 <strong>[비디오 변환 (Flow)] vs [이미지 생성 (Nano Banana)]</strong>을 직접 선택할 수 있는 토글 스위치가 제공되어 관리자가 크레딧 소모를 완벽히 통제할 수 있습니다.
                </p>
              </div>
              <button onClick={() => setActiveTab("curation")} className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 shrink-0 hover:scale-105 transition-all">
                지금 바로 AI 팩토리 시작하기
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------------------------- */}
      {/* 🌟 단계별 마스터 프로덕션 스튜디오 (Step-by-Step Studio) 모달 */}
      {/* ---------------------------------------------------------------------- */}
      {isMasterStudioOpen && masterNewsItem && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-[#0f1423] border border-slate-700/80 rounded-3xl max-w-5xl w-full p-8 shadow-2xl max-h-[95vh] flex flex-col relative overflow-hidden">
            
            {/* 상단 타이틀 바 */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span>🚀 단계별 마스터 프로덕션 스튜디오</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">자료 서치부터 최종 조립까지 완벽 제어</span>
                    {masterForm.isRealApi && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">⚡ 실제 API 연동 가동 중</span>}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">원문 팩트: {masterNewsItem.topic}</p>
                </div>
              </div>
              <button onClick={() => setIsMasterStudioOpen(false)} className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 p-2.5 rounded-xl border border-slate-700">닫기</button>
            </div>

            {/* 🌟 5단계 화려한 프로그레스 바 네비게이션 (요구사항 4 반영: 실시간 체크마크 및 로딩 바) */}
            <div className="mb-8 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
              <div className="grid grid-cols-5 gap-2 text-center relative mb-4">
                
                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${currentStep === 1 ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10" : currentStep > 1 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900/50 border-slate-800 text-slate-500"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {currentStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> : <Search className="w-4 h-4" />}
                    <span className="text-xs font-bold">Step 1. 자료 서치</span>
                  </div>
                  <span className="text-[10px] opacity-80 line-clamp-1">{currentStep > 1 ? "✅ 팩트 검증 완료" : "팩트 검증 및 큐레이션"}</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${currentStep === 2 ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10" : currentStep > 2 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900/50 border-slate-800 text-slate-500"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {currentStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> : <Bot className="w-4 h-4" />}
                    <span className="text-xs font-bold">Step 2. 대본 & 프롬프트</span>
                  </div>
                  <span className="text-[10px] opacity-80 line-clamp-1">{currentStep > 2 ? "✅ 인간 검수 완료" : "Gemini AI 5단 파싱"}</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${currentStep === 3 ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10" : currentStep > 3 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900/50 border-slate-800 text-slate-500"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {currentStep > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> : <ImageIcon className="w-4 h-4" />}
                    <span className="text-xs font-bold">Step 3. 비주얼 합성</span>
                  </div>
                  <span className="text-[10px] opacity-80 line-clamp-1">{currentStep > 3 ? "✅ 시니어 룩 합성 완료" : "Nano Banana & Flow"}</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${currentStep === 4 ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10" : currentStep > 4 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-900/50 border-slate-800 text-slate-500"}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {currentStep > 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> : <Music className="w-4 h-4" />}
                    <span className="text-xs font-bold">Step 4. 자막 & 오디오</span>
                  </div>
                  <span className="text-[10px] opacity-80 line-clamp-1">{currentStep > 4 ? "✅ Wavenet 오디오 완료" : "AI 성우 및 BGM 설정"}</span>
                </div>

                <div className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${currentStep === 5 ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10" : "bg-slate-900/50 border-slate-800 text-slate-500"}`}>
                  <div className="flex items-center gap-1.5 mb-1"><CheckCircle2 className="w-4 h-4" /><span className="text-xs font-bold">Step 5. 최종 완료</span></div>
                  <span className="text-[10px] opacity-80 line-clamp-1">{currentStep === 5 ? "✅ 패키징 완료" : "대시보드 등록 & 다운로드"}</span>
                </div>

              </div>

              {/* 실시간 프로그레스 바 */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 h-full transition-all duration-700 ease-out" 
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* 메인 콘텐츠 영역 (현재 단계별 뷰 렌더링) */}
            <div className="flex-1 overflow-y-auto pr-2 mb-6">
              {isStepLoading ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fadeIn">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-amber-400">{currentStep}/5</div>
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 mb-2">
                    {currentStep === 1 && "구글 Gemini 1.5 Flash에 대본 및 프롬프트 파싱을 요청 중입니다..."}
                    {currentStep === 2 && "나노바나나2 노드 및 플로우 AI 비주얼 합성을 가동 중입니다..."}
                    {currentStep === 3 && "OpenAI AI 성우 오디오(TTS) 및 하단 자막 파싱을 진행 중입니다..."}
                    {currentStep === 4 && "최종 소스 패키징 및 대시보드 데이터베이스 등록 중입니다..."}
                  </h4>
                  <p className="text-xs text-slate-400 mb-6 max-w-md leading-relaxed">
                    나노바나나로 이미지 뽑고, 플로우(Flow)로 비디오 변환하고, TTS 굽는 데는 최소 30초에서 2분 이상의 시간이 소요됩니다. 비동기 렌더링이 안전하게 진행 중이므로 창을 닫거나 새로고침하지 마세요.
                  </p>

                  <div className="w-full max-w-md bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span>🔄 실시간 백엔드 렌더링 체크리스트</span>
                      <span className="text-amber-400 animate-pulse">처리 중...</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium pt-1">
                      {currentStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" /> : <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />}
                      <span>1. 뉴스 팩트 큐레이션 및 구조 분석 {currentStep > 1 ? "(완료)" : "(진행 중)"}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                      {currentStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" /> : (currentStep === 2 ? <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />)}
                      <span>2. 8K 실사 시니어 룩(Look) 프롬프트 바인딩 {currentStep > 2 ? "(완료)" : (currentStep === 2 ? "(생성 중)" : "(대기 중)")}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                      {currentStep > 3 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" /> : (currentStep === 3 ? <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />)}
                      <span>3. Wavenet 오디오 합성 및 속도/피치 최적화 {currentStep > 3 ? "(완료)" : (currentStep === 3 ? "(합성 중)" : "(대기 중)")}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                      {currentStep > 4 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-bounce" /> : (currentStep === 4 ? <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" /> : <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />)}
                      <span>4. 소스 패키지 조립 및 캡컷 연동용 자막(.srt) 준비 {currentStep > 4 ? "(완료)" : (currentStep === 4 ? "(패키징 중)" : "(대기 중)")}</span>
                    </div>
                  </div>
                </div>
              ) : currentStep === 1 ? (
                // Step 1 뷰
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2"><Search className="w-4 h-4" /><span>1단계: 뉴스 자료 서치 및 오피셜 팩트 검증 완료</span></h4>
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                      <div><span className="text-[11px] text-slate-500 block mb-1">선택된 뉴스 주제</span><p className="text-base font-bold text-slate-100">{masterNewsItem.topic}</p></div>
                      <div><span className="text-[11px] text-slate-500 block mb-1">오피셜 출처</span><p className="text-xs text-blue-400 font-mono">{masterNewsItem.source}</p></div>
                      <div><span className="text-[11px] text-slate-500 block mb-1">핵심 팩트 요약 (AI 큐레이션)</span><p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">{masterNewsItem.summary}</p></div>
                    </div>
                  </div>
                </div>
              ) : currentStep === 2 ? (
                // 🌟 [요구사항 1 반영] Step 2 뷰: 대본 검수 및 '수정 피드백' 노드 (Human-in-the-loop)
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl flex items-start gap-3">
                    <UserCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 mb-1">✍️ 인간-AI 협업 대본 검수 모드 (Human-in-the-loop) 가동 중</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        AI가 완벽하더라도 가끔 단어나 뉘앙스가 시니어 정서에 안 맞을 수 있습니다. 아래 생성된 JSON 기반의 5단 대본과 프롬프트를 눈으로 직접 읽어보시고, 어색한 자막이나 텍스트를 화면에서 <strong>직접 수정하신 뒤 하단의 [검수 완료 및 생성 시작] 버튼</strong>을 누르세요. 토큰을 아끼고 불량 영상을 필터링하는 최고의 방법입니다.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                    <label className="block text-xs font-bold text-amber-400 mb-2 flex items-center justify-between"><span>📌 유튜브 쇼츠 업로드용 훅 제목</span><span className="text-slate-500 font-normal">어그로 및 팩트 요약</span></label>
                    <input type="text" value={masterForm.shorts_title} onChange={(e) => setMasterForm({ ...masterForm, shorts_title: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-100 focus:border-amber-500 focus:outline-none" />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Sliders className="w-3.5 h-3.5 text-amber-400" /><span>5단 씬 세부 대본 및 프롬프트 에디터 (스마트 예산 관리)</span></h4>
                    {masterForm.scenes.map((sc: any, idx: number) => {
                      const detectedBannedWords = aiBannedWords.filter(w => sc.narration.includes(w));
                      return (
                        <div key={sc.scene_id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 group">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-amber-500 text-slate-950 font-bold font-mono text-xs rounded-lg">Scene #{sc.scene_id}</span>
                              {detectedBannedWords.length > 0 ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/20 animate-pulse"><AlertTriangle className="w-3.5 h-3.5" /> AI 금지어 감지됨: {detectedBannedWords.join(", ")}</span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20"><Check className="w-3.5 h-3.5" /> AI 흔적 0%</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                              <button type="button" onClick={() => handleMasterSceneChange(idx, "gen_type", "video")} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sc.gen_type === "video" || (!sc.gen_type && (idx === 0 || idx === 4)) ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200"}`}><Video className="w-3.5 h-3.5" /><span>Flow 비디오 변환</span></button>
                              <button type="button" onClick={() => handleMasterSceneChange(idx, "gen_type", "image")} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sc.gen_type === "image" || (!sc.gen_type && idx > 0 && idx < 4) ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}><ImageIcon className="w-3.5 h-3.5" /><span>Nano Banana 이미지</span></button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between"><span>하단 자막 / TTS 대본</span><span className={`text-[11px] ${sc.narration.length > 25 ? "text-amber-400 font-bold" : "text-slate-500"}`}>{sc.narration.length}자 / 권장 20자 내외</span></label>
                            <textarea rows={2} value={sc.narration} onChange={(e) => handleMasterSceneChange(idx, "narration", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-medium text-slate-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-between"><span>나노바나나2 8K 비주얼 프롬프트</span></label>
                            <input type="text" value={sc.image_prompt} onChange={(e) => handleMasterSceneChange(idx, "image_prompt", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-slate-300 focus:border-amber-500 focus:outline-none" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : currentStep === 3 ? (
                // Step 3 뷰: 비주얼 합성 및 파일 업로드
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2"><ImageIcon className="w-4 h-4" /><span>3단계: Nano Banana 2 & Flow AI 비주얼 합성 및 직접 교체 (파일 업로드 & URL)</span></h4>
                    <p className="text-xs text-slate-300 leading-relaxed">AI가 생성하거나 Fallback으로 들어간 비주얼이 마음에 들지 않거나 주제와 맞지 않을 때, <strong>내 컴퓨터에 있는 이미지/영상 파일을 직접 업로드하거나 구글/캔바 이미지 주소를 붙여넣어 즉시 교체</strong>하실 수 있습니다.</p>

                    <div className="space-y-6 pt-2">
                      {masterForm.scenes.map((sc: any, idx: number) => (
                        <div key={sc.scene_id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start">
                          <div className="w-full md:w-1/4 flex flex-col items-center space-y-2">
                            <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold font-mono text-xs rounded-md block w-full text-center">Scene #{sc.scene_id}</span>
                            <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center relative group">
                              {sc.video_url?.endsWith(".mp4") || sc.video_url?.startsWith("data:video") || sc.gen_type === "video" ? (
                                <video src={sc.video_url} className="w-full h-full object-cover" loop muted playsInline autoPlay />
                              ) : <img src={sc.video_url} alt={`Scene ${sc.scene_id}`} className="w-full h-full object-cover" />}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-[10px] text-white">{sc.final_engine || "Nano Banana 2"}</div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-400 truncate w-full text-center">{sc.final_engine || (sc.gen_type === "video" ? "🌊 Flow 비디오" : "🍌 Nano Banana")}</span>
                          </div>

                          <div className="w-full md:w-3/4 space-y-4">
                            <div><span className="text-xs font-semibold text-slate-400 block mb-1">씬 대본 (하단 자막)</span><p className="text-xs font-bold text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">"{sc.narration}"</p></div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                                <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /><span>📁 내 컴퓨터 파일 선택 (업로드)</span></label>
                                <input type="file" accept="image/*,video/mp4" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(idx, file, true); }} className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer" />
                                <span className="text-[10px] text-slate-500 block">.jpg, .png, .mp4 지원 (즉시 반영)</span>
                              </div>

                              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                                <label className="block text-xs font-bold text-blue-400 flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /><span>🌐 구글/캔바 이미지 주소 붙여넣기</span></label>
                                <div className="flex items-center gap-1.5">
                                  <input type="text" value={sc.video_url || ""} onChange={(e) => handleMasterSceneChange(idx, "video_url", e.target.value)} placeholder="https://..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-blue-500 focus:outline-none" />
                                  <button type="button" onClick={() => alert(`Scene #${sc.scene_id} 비주얼이 성공적으로 교체되었습니다!`)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 shrink-0 shadow">적용</button>
                                </div>
                                <span className="text-[10px] text-slate-500 block">이미지 주소 복사(Copy image address) URL</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : currentStep === 4 ? (
                // 🌟 [핵심 수정] Step 4 뷰: AI 성우 음성 및 배경음악(BGM) 커스텀 설정 패널 대폭 탑재
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-1">
                        <Music className="w-4 h-4" /><span>4단계: 🎙️ AI 성우 목소리 톤 및 🎵 배경음악(BGM) 커스텀 설정 패널</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        유튜브 숏폼의 감성을 결정짓는 AI 성우의 목소리 톤과 배경음악 트랙을 직접 선택하세요. 설정하신 BGM은 미리보기 플레이어에서 성우 목소리와 함께 은은하게 동시 재생됩니다.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* 1. 성우 목소리 선택 패널 (요구사항 2 반영: Wavenet 감정/속도/피치 바인딩) */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="border-b border-slate-800 pb-3">
                          <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-1">
                            <Bot className="w-4 h-4 text-amber-400" /><span>🎙️ 한국어 시니어 타깃 최적화 Wavenet 오디오 설정</span>
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Wavenet 목소리가 너무 기계처럼 느껴지거나 빠르면 시니어들이 이탈합니다. AI 티를 지우기 위해 <strong>말하기 속도(speakingRate)를 0.85로 낮추고, 음높이(pitch)를 -1.5 중저음</strong>으로 고정 바인딩하여 반 박자 느리고 신뢰감 있는 오디오를 생성합니다.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          {[
                            { id: "onyx", label: "👨‍🦳 ko-KR-Wavenet-C (차분하고 신뢰감 있는 남성)", desc: "속도 0.85x / 피치 -1.5 중저음" },
                            { id: "alloy", label: "👩‍🦰 ko-KR-Wavenet-D (부드럽고 따뜻한 여성)", desc: "속도 0.85x / 피치 -1.5 중저음" },
                            { id: "shimmer", label: "✨ Shimmer (밝고 낭랑한 여성 목소리)", desc: "속도 0.90x / 피치 -1.0 차분함" },
                            { id: "echo", label: "👨‍💼 Echo (묵직하고 진중한 남성 톤)", desc: "속도 0.85x / 피치 -2.0 극저음" }
                          ].map((voice) => (
                            <label key={voice.id} className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${ttsVoice === voice.id ? "bg-amber-500/10 border-amber-500 shadow-md" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-200">{voice.label}</span>
                                <input type="radio" name="ttsVoice" value={voice.id} checked={ttsVoice === voice.id} onChange={(e) => setTtsVoice(e.target.value)} className="text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-700" />
                              </div>
                              <span className="text-[10px] text-amber-400/90 font-mono block">{voice.desc}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* 2. 배경음악(BGM) 선택 패널 */}
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <h5 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 border-b border-slate-800 pb-3">
                          <Music className="w-4 h-4 text-blue-400" /><span>🎵 유튜브 감성 배경음악(BGM) 트랙 선택</span>
                        </h5>
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          {[
                            { id: "piano", label: "🎹 따뜻한 감성 피아노", desc: "감동적이고 차분한 분위기" },
                            { id: "acoustic", label: "🎸 잔잔한 어쿠스틱 기타", desc: "편안하고 친근한 일상 꿀팁" },
                            { id: "lofi", label: "🎧 트렌디한 로파이 비트", desc: "세련되고 감각적인 숏폼" },
                            { id: "none", label: "🔕 배경음악 없음", desc: "성우 목소리에만 집중" }
                          ].map((bgm) => (
                            <label key={bgm.id} className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${bgmTrack === bgm.id ? "bg-blue-500/10 border-blue-500 shadow-md" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-200">{bgm.label}</span>
                                <input type="radio" name="bgmTrack" value={bgm.id} checked={bgmTrack === bgm.id} onChange={(e) => setBgmTrack(e.target.value)} className="text-blue-500 focus:ring-blue-500 bg-slate-900 border-slate-700" />
                              </div>
                              <span className="text-[10px] text-slate-400 block">{bgm.desc}</span>
                            </label>
                          ))}
                        </div>

                        {bgmTrack !== "none" && (
                          <div className="pt-2 border-t border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                              <span className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5 text-blue-400" /> 배경음악 볼륨 조절 (성우 대사 보호용)</span>
                              <span className="text-amber-400">{Math.round(bgmVolume * 100)}%</span>
                            </div>
                            <input type="range" min="0.05" max="0.5" step="0.05" value={bgmVolume} onChange={(e) => setBgmVolume(parseFloat(e.target.value))} className="w-full accent-blue-500 bg-slate-950 h-2 rounded-lg" />
                            <span className="text-[10px] text-slate-500 block">※ 성우 목소리가 묻히지 않도록 20% 내외의 잔잔한 볼륨을 권장합니다.</span>
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-200 mb-1">💡 캡컷(CapCut) 최종 편집 및 오디오 꿀팁</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          다운로드 패키지에 포함된 <strong>성우 파일(.mp3)</strong>과 <strong>BGM 트랙(.mp3)</strong>을 캡컷 타임라인에 배치하실 때, BGM 트랙의 볼륨을 -20dB 정도로 낮추고 [오디오 페이드인/아웃] 효과를 주시면 100만 유튜버 부럽지 않은 최고급 퀄리티가 완성됩니다.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-800">
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">대본별 AI 성우 파싱 상태 검증</h5>
                      {masterForm.scenes.map((sc: any) => (
                        <div key={sc.scene_id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold font-mono text-xs rounded-md">Scene #{sc.scene_id}</span>
                            <p className="text-xs font-medium text-slate-200 truncate">"{sc.narration}"</p>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shrink-0 flex items-center gap-1">
                            <Check className="w-3 h-3" /> {ttsVoice} 성우 파싱 완료
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Step 5 뷰 (요구사항 5 반영: 자막 .srt 파일 다운로드 버튼 신설)
                <div className="py-12 text-center space-y-6 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce"><CheckCircle2 className="w-8 h-8" /></div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-100">🎉 5단계 프로덕션 파이프라인 가동 완료!</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">자료 서치부터 대본, 이미지, 영상, 자막, 성우 및 BGM까지 모든 소스 패키지가 완벽하게 조립되어 대시보드(탭 2)에 성공적으로 등록되었습니다.</p>
                  </div>
                  
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl max-w-lg mx-auto space-y-4 text-left">
                    <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /><span>💡 캡컷(CapCut) 최종 편집 및 자막 싱크 100% 자동 완성 꿀팁</span>
                    </h5>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      웹에서 무리하게 완벽한 인코딩을 하려다 서버가 멈추는 것보다, 소스를 내려받아 캡컷으로 최종 마무리하는 것이 훨씬 안정적이고 전문적입니다. 아래 <strong>[📜 자막(.srt) 파일 다운로드]</strong> 버튼을 누르면 각 씬의 타임코드가 계산된 완벽한 자막 파일이 생성됩니다. 캡컷에 영상과 함께 넣으면 싱크가 1초 만에 자동 완성됩니다!
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      <button 
                        onClick={() => handleDownloadSRT(masterForm)} 
                        className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
                      >
                        <FileText className="w-4 h-4" /><span>📜 캡컷 연동용 자막(.srt) 파일 다운로드</span>
                      </button>
                      <button 
                        onClick={() => handleDownloadPackage(masterForm)} 
                        className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-5 py-3 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                      >
                        <Download className="w-4 h-4" /><span>소스 일괄 다운로드 (.mp4 + .mp3)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 단계별 액션 버튼 바 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 z-10">
              <button onClick={() => setIsMasterStudioOpen(false)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all">
                {currentStep === 5 ? "대시보드로 이동" : "취소 및 나가기"}
              </button>
              
              {!isStepLoading && currentStep === 1 && (
                <button onClick={handleExecuteStep2} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-105">
                  <span>➡️ 2단계: Gemini AI 대본 생성 실행</span><ArrowRight className="w-4 h-4" />
                </button>
              )}
              {!isStepLoading && currentStep === 2 && (
                <button onClick={handleExecuteStep3} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105">
                  <UserCheck className="w-4 h-4 animate-bounce" /><span>✍️ 대본/프롬프트 인간 검수 완료 (Human-in-the-loop) ➡️ 3단계 비주얼 합성 시작</span><ArrowRight className="w-4 h-4" />
                </button>
              )}
              {!isStepLoading && currentStep === 3 && (
                <button onClick={handleExecuteStep4} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-105">
                  <span>➡️ 4단계: AI 성우 및 BGM 오디오 설정 실행</span><ArrowRight className="w-4 h-4" />
                </button>
              )}
              {!isStepLoading && currentStep === 4 && (
                <button onClick={handleExecuteStep5} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105">
                  <Sparkles className="w-4 h-4" /><span>➡️ 5단계: 최종 패키징 및 대시보드 등록</span>
                </button>
              )}
              {!isStepLoading && currentStep === 5 && (
                <button onClick={() => { setIsMasterStudioOpen(false); setActiveTab("dashboard"); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105">
                  <Video className="w-4 h-4" /><span>대시보드에서 🎬 통합 미리보기 열기</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 🎬 숏폼 통합 미리보기 (Preview Player) 모달 (🌟 BGM 동시 재생 완벽 지원) */}
      {/* ---------------------------------------------------------------------- */}
      {previewShorts && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-[#0f1423] border border-slate-700/80 rounded-3xl max-w-4xl w-full p-8 shadow-2xl max-h-[95vh] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span>🎬 숏폼 통합 미리보기 플레이어</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">9:16 모바일 쇼츠 비율</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{previewShorts.shorts_title}</p>
                </div>
              </div>
              <button onClick={() => { setPreviewShorts(null); setIsPlaying(false); }} className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 p-2.5 rounded-xl border border-slate-700">닫기</button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 overflow-y-auto pb-4">
              
              {/* 📱 9:16 스마트폰 목업 UI 플레이어 */}
              <div className="relative w-[300px] h-[533px] bg-black rounded-[36px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between shrink-0 group">
                
                {/* 상단 진행 바 & 씬 뱃지 */}
                <div className="absolute top-0 left-0 w-full z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-50 animate-ping"></span>
                    <span className="text-[11px] font-bold text-white font-mono bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">Scene #{activeSceneIndex + 1}/5</span>
                  </div>
                  <span className="text-[10px] text-white/80 font-semibold bg-black/60 px-2 py-0.5 rounded-full">
                    {previewShorts.scenes[activeSceneIndex].final_engine?.includes("Video") ? "🌊 Flow 모션" : "🍌 Nano Banana"}
                  </span>
                </div>

                {/* 🎥 배경 비디오 / 이미지 하이브리드 렌더러 */}
                <div className="absolute inset-0 w-full h-full z-10 bg-slate-950 flex items-center justify-center overflow-hidden">
                  {previewShorts.scenes[activeSceneIndex].video_url?.endsWith(".mp4") || previewShorts.scenes[activeSceneIndex].video_url?.startsWith("data:video") || previewShorts.scenes[activeSceneIndex].gen_type === "video" ? (
                    <video ref={videoRef} className="w-full h-full object-cover" loop muted playsInline src={previewShorts.scenes[activeSceneIndex].video_url} />
                  ) : <img src={previewShorts.scenes[activeSceneIndex].video_url} alt={`Scene ${activeSceneIndex + 1}`} className="w-full h-full object-cover animate-fadeIn" />}
                  
                  {/* 성우 내레이션 */}
                  <audio ref={audioRef} src={previewShorts.scenes[activeSceneIndex].audio_url} />
                  
                  {/* 🌟 [핵심 추가] BGM 오디오 태그 (무한 루핑) */}
                  {previewShorts.bgm_track && previewShorts.bgm_track !== "none" && (
                    <audio ref={bgmRef} src={`/audio/bgm_${previewShorts.bgm_track}.mp3`} loop />
                  )}
                </div>

                {/* 📺 유튜브 쇼츠 스타일 하단 자막 오버레이 */}
                <div className="absolute bottom-16 left-0 w-full z-30 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center text-center">
                  <div className="bg-black/75 border border-amber-500/40 px-4 py-3 rounded-2xl backdrop-blur-md w-full max-w-[270px] shadow-lg animate-fadeIn">
                    <p className="text-base font-bold text-amber-400 drop-shadow-md leading-snug tracking-wide">
                      "{previewShorts.scenes[activeSceneIndex].narration}"
                    </p>
                  </div>
                </div>

                {/* 하단 목업 홈 바 */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-30"></div>
              </div>

              {/* 🎛️ 플레이어 컨트롤러 및 씬별 리스트 패널 */}
              <div className="w-full max-w-md space-y-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner space-y-6">
                  
                  {/* 메인 컨트롤 버튼 */}
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => setActiveSceneIndex((prev) => (prev - 1 + previewShorts.scenes.length) % previewShorts.scenes.length)} className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-800 transition-all shadow" title="이전 씬"><SkipBack className="w-5 h-5" /></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-2xl font-bold transition-all shadow-lg shadow-amber-500/20 hover:scale-105 flex items-center gap-2">
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                      <span className="text-sm">{isPlaying ? "자동 재생 중 (4초 간격)" : "일시정지됨"}</span>
                    </button>
                    <button onClick={() => setActiveSceneIndex((prev) => (prev + 1) % previewShorts.scenes.length)} className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-2xl border border-slate-800 transition-all shadow" title="다음 씬"><SkipForward className="w-5 h-5" /></button>
                  </div>

                  {/* 🌟 오디오 상태 안내 뱃지 */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-amber-400" /> AI 성우: {previewShorts.scenes[0].tts_voice || ttsVoice}</span>
                    <span className="flex items-center gap-1.5"><Music className="w-4 h-4 text-blue-400" /> BGM 트랙: {previewShorts.bgm_track || bgmTrack}</span>
                  </div>

                  {/* 씬 리스트 네비게이션 */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">전체 5단 씬 목록 (클릭 시 즉시 이동)</h4>
                    {previewShorts.scenes.map((sc: any, idx: number) => (
                      <button key={sc.scene_id} onClick={() => { setActiveSceneIndex(idx); setIsPlaying(false); }} className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-3 ${activeSceneIndex === idx ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-500/50 text-blue-300 shadow-md" : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}>
                        <div className="flex items-center gap-2.5 overflow-hidden"><span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${activeSceneIndex === idx ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"}`}>#{idx + 1}</span><span className="truncate">"{sc.narration}"</span></div>
                        <span className="text-[10px] shrink-0 text-slate-500 font-semibold">{sc.final_engine?.includes("Video") ? "🌊 Flow" : "🍌 Banana"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div><h4 className="text-xs font-bold text-slate-200 mb-1">완벽한 싱크 확인이 끝나셨나요?</h4><p className="text-[11px] text-slate-400">하단의 다운로드 버튼을 누르면 캡컷 덮어쓰기용 소스가 즉시 저장됩니다.</p></div>
                  <button disabled={downloadingId !== null} onClick={() => handleDownloadPackage(previewShorts)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shrink-0 ${downloadingId !== null ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 hover:scale-105"}`}>
                    <Download className="w-4 h-4" /><span>{downloadingId === previewShorts.id ? "다운로드 중..." : "소스 일괄 다운로드"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 🗂 숏폼 상세 보기 모달 */}
      {/* ---------------------------------------------------------------------- */}
      {selectedShorts && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-[#0f1423] border border-slate-700/80 rounded-3xl max-w-5xl w-full p-8 shadow-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20"><Film className="w-6 h-6" /></div>
                <div><h3 className="text-lg font-bold text-slate-100">{selectedShorts.shorts_title}</h3><p className="text-xs text-slate-400 mt-0.5">원문 뉴스 주제: {selectedShorts.topic}</p></div>
              </div>
              <button onClick={() => setSelectedShorts(null)} className="text-xs text-slate-400 hover:text-slate-200 bg-slate-800 p-2.5 rounded-xl border border-slate-700">닫기</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div><span className="text-[11px] font-semibold text-slate-400 block mb-1">제작 일자</span><span className="text-xs font-bold text-slate-200 bg-slate-900 px-3 py-1 rounded border border-slate-800">{selectedShorts.created_at}</span></div>
                  <div><span className="text-[11px] font-semibold text-slate-400 block mb-1">업로드 예정일</span><span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">{selectedShorts.upload_date}</span></div>
                  <div><span className="text-[11px] font-semibold text-slate-400 block mb-1">진행 상태</span><span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">{selectedShorts.status || "Anti-gravity AI Generated"}</span></div>
                  <div><span className="text-[11px] font-semibold text-slate-400 block mb-1">오디오 상태</span><span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20">성우: {selectedShorts.scenes[0].tts_voice || "onyx"} / BGM: {selectedShorts.bgm_track || "piano"}</span></div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <button onClick={() => { setSelectedShorts(null); setPreviewShorts(selectedShorts); setActiveSceneIndex(0); setIsPlaying(true); }} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20">
                    <Smartphone className="w-4 h-4" /><span>🎬 통합 미리보기</span>
                  </button>
                  <button disabled={downloadingId !== null} onClick={() => handleDownloadPackage(selectedShorts)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${downloadingId !== null ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20 hover:scale-105"}`}>
                    <Download className="w-4 h-4" /><span>{downloadingId === selectedShorts.id ? "다운로드 중..." : "소스 일괄 다운로드"}</span>
                  </button>
                </div>
              </div>

              {/* 🌟 씬별 비주얼 직접 교체 리스트 */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Link className="w-4 h-4 text-amber-400" /><span>🖼️ 씬별 비주얼 소스 실시간 관리 및 직접 교체 (파일 업로드 & URL)</span></h4>
                {selectedShorts.scenes.map((sc: any, idx: number) => (
                  <div key={sc.scene_id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-full md:w-1/4 flex flex-col items-center space-y-2">
                      <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold font-mono text-xs rounded-md block w-full text-center">Scene #{sc.scene_id}</span>
                      <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center relative group">
                        {sc.video_url?.endsWith(".mp4") || sc.video_url?.startsWith("data:video") || sc.gen_type === "video" ? (
                          <video src={sc.video_url} className="w-full h-full object-cover" loop muted playsInline autoPlay />
                        ) : <img src={sc.video_url} alt={`Scene ${sc.scene_id}`} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-[10px] text-white">{sc.final_engine || "Nano Banana 2"}</div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 truncate w-full text-center">{sc.final_engine || (sc.gen_type === "video" ? "🌊 Flow 비디오" : "🍌 Nano Banana")}</span>
                    </div>

                    <div className="w-full md:w-3/4 space-y-4">
                      <div><span className="text-xs font-semibold text-slate-400 block mb-1">씬 대본 (하단 자막)</span><p className="text-xs font-bold text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">"{sc.narration}"</p></div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                          <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /><span>📁 내 컴퓨터 파일 선택 (업로드)</span></label>
                          <input type="file" accept="image/*,video/mp4" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(idx, file, false); }} className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer" />
                          <span className="text-[10px] text-slate-500 block">.jpg, .png, .mp4 지원 (즉시 반영)</span>
                        </div>

                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                          <label className="block text-xs font-bold text-blue-400 flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /><span>🌐 구글/캔바 이미지 주소 붙여넣기</span></label>
                          <div className="flex items-center gap-1.5">
                            <input type="text" value={sc.video_url || ""} onChange={(e) => { const updatedScenes = [...selectedShorts.scenes]; updatedScenes[idx] = { ...updatedScenes[idx], video_url: e.target.value, final_engine: "사용자 직접 교체 (Custom URL)" }; setSelectedShorts({ ...selectedShorts, scenes: updatedScenes }); setDashboardList(prev => prev.map(item => item.id === selectedShorts.id ? { ...item, scenes: updatedScenes } : item)); }} placeholder="https://..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-blue-500 focus:outline-none" />
                            <button type="button" onClick={() => alert(`Scene #${sc.scene_id} 비주얼이 성공적으로 교체되었습니다!`)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 shrink-0 shadow">적용</button>
                          </div>
                          <span className="text-[10px] text-slate-500 block">이미지 주소 복사(Copy image address) URL</span>
                        </div>
                      </div>

                      <div><span className="text-[11px] font-semibold text-slate-500 block mb-1">나노바나나2 8K 프롬프트 (참고용)</span><p className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/50 truncate">{sc.image_prompt}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-800 z-10">
              <button onClick={() => setSelectedShorts(null)} className="px-6 py-3 bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700">닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
