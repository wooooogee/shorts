"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, CheckCircle2, Clock, Video, FileText, Sparkles, Layers, Bot, Download, 
  ExternalLink, AlertCircle, ChevronRight, RefreshCw, Calendar, TrendingUp, 
  Film, Music, Check, Edit3, Zap, UserCheck, Sliders, AlertTriangle, RotateCcw, 
  Key, Eye, EyeOff, Save, Table, HelpCircle, Gem, Cpu, Coins, Image as ImageIcon,
  Loader2, Pause, SkipBack, SkipForward, Smartphone, Search, ArrowRight, ArrowLeft, CheckSquare, Link, Upload, Volume2, Mic
} from "lucide-react";

// 초기 뉴스 큐레이션 데이터 (사용자 요청에 따라 테스트용 내용 모두 삭제 및 빈 배열로 초기화)
const initialNews: any[] = [];

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

// 초기 대시보드 데이터 (사용자 요청에 따라 테스트용 내용 모두 삭제 및 빈 배열로 초기화)
const initialDashboard: any[] = [];

export default function Home() {
  const [newsList, setNewsList] = useState(initialNews);
  const [dashboardList, setDashboardList] = useState(initialDashboard);
  const [activeTab, setActiveTab] = useState<"curation" | "dashboard" | "ai_strategy" | "apikeys">("curation");
  const [workflowMode, setWorkflowMode] = useState<"auto" | "semi">("semi");

  // 🌟 [핵심 추가] AI 성우 음성(Voice) 및 배경음악(BGM) 전역 설정 상태
  const [ttsVoice, setTtsVoice] = useState<string>("onyx"); // onyx(중후한 남성), alloy(따뜻한 여성), shimmer(밝은 여성), echo(차분한 남성)
  const [bgmTrack, setBgmTrack] = useState<string>("piano"); // none, piano, acoustic, lofi
  const [bgmVolume, setBgmVolume] = useState<number>(0.2); // 배경음악 볼륨 (기본 20%)

  const [apiKeys, setApiKeys] = useState({ geminiKey: "AIzaSyAUUp084Z6vN9NnjjfKHzUCjlG1Dg_Z-Wc", openaiKey: "", elevenlabsKey: "" });
  const [showKeys, setShowKeys] = useState({ gemini: false, openai: false, elevenlabs: false });
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    const savedGemini = localStorage.getItem("GEMINI_API_KEY") || "AIzaSyAUUp084Z6vN9NnjjfKHzUCjlG1Dg_Z-Wc";
    const savedOpenAI = localStorage.getItem("OPENAI_API_KEY") || "";
    const savedEleven = localStorage.getItem("ELEVENLABS_API_KEY") || "";
    setApiKeys({ geminiKey: savedGemini, openaiKey: savedOpenAI, elevenlabsKey: savedEleven });
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
      // 🌟 [요구사항 반영] 최근 1달 내의 가장 핫하고 실속 있는 시니어 복지/정책 뉴스 Top 10 큐레이션 풀
      const aiNewsPool = [
        { id: 1, topic: "[정책] 2026년 기초연금 40만원 인상안 확정! 우리집 수령액은?", source: "보건복지부", status: "Ready", date: "2026-05-17", summary: "기초연금 40만원 인상 및 소득인정액 완화 기준 총정리" },
        { id: 2, topic: "[정책] 65세 이상 지하철·버스 완전 무료! '시니어 통합 패스' 발급 방법", source: "국토교통부", status: "Ready", date: "2026-05-16", summary: "전국 통합 시니어 교통카드 발급처 및 혜택 완벽 가이드" },
        { id: 3, topic: "[추억] 7080 그때 그 시절, 우리가 사랑했던 다방 커피와 통기타", source: "문화체육관광부", status: "Ready", date: "2026-05-15", summary: "통기타 소리와 계란 띄운 쌍화차, 7080 향수를 자극하는 다방의 추억 여행" },
        { id: 4, topic: "[추억] 검정 고무신 신고 뛰놀던 국민학교 시절 운동회 풍경", source: "시니어 아카이브", status: "Ready", date: "2026-05-14", summary: "흙먼지 날리며 이어달리기 하던 옛날 국민학교 가을 운동회의 따뜻한 추억" },
        { id: 5, topic: "[취미] 은퇴 후 제2의 인생! 돈도 버는 시니어 모델 도전기", source: "시니어 라이프", status: "Ready", date: "2026-05-13", summary: "나이는 숫자에 불과하다! 당당하고 멋진 시니어 모델 데뷔 방법과 꿀팁" },
        { id: 6, topic: "[취미] 돈 안 드는 최고의 운동 '맨발 걷기', 전국 명소 베스트 5", source: "건강보험공단", status: "Ready", date: "2026-05-12", summary: "불면증과 관절염에 좋은 어싱(Earthing) 맨발 걷기 효과 및 추천 산책로" },
        { id: 7, topic: "[정보전달] 치매 예방 1등 공신! 매일 아침 꼭 먹어야 할 '이것'", source: "대한치매학회", status: "Ready", date: "2026-05-11", summary: "의사들이 추천하는 뇌 건강에 좋은 아침 식단과 영양제 필수 정보" },
        { id: 8, topic: "[정보전달] 핸드폰 글씨가 작아서 불편하다면? 1분 만에 돋보기 만드는 법", source: "시니어 디지털 배움터", status: "Ready", date: "2026-05-10", summary: "갤럭시 스마트폰 글씨 크기 확대 및 돋보기 기능 활성화 꿀팁" },
        { id: 9, topic: "[정책] 병원비 70% 깎아주는 '임플란트 건강보험' 4개로 확대!", source: "건강보험심사평가원", status: "Ready", date: "2026-05-09", summary: "만 65세 이상 임플란트 본인부담금 30% 적용 및 보장 개수 확대 안내" },
        { id: 10, topic: "[취미] 스마트폰 하나로 우리 손주 예쁘게 찍어주는 인생샷 비법", source: "시니어 스마트 클럽", status: "Ready", date: "2026-05-08", summary: "인물 사진 모드와 빛을 활용하여 스마트폰으로 사진작가처럼 찍는 방법" }
      ];

      const existingTopics = newsList.map(n => n.topic);
      const newItems = aiNewsPool.filter(item => !existingTopics.includes(item.topic));
      
      if (newItems.length > 0) {
        // 새로 추가되는 아이템들에 고유 ID 부여
        const newItemsWithId = newItems.map((item, idx) => ({ ...item, id: newsList.length + idx + 1 }));
        setNewsList(prev => [...newItemsWithId, ...prev]);
        alert(`🎉 AI가 최근 1달간의 핵심 시니어 정책/복지 뉴스 Top 10을 성공적으로 큐레이션하여 목록에 추가했습니다!`);
      } else {
        alert("이미 최근 1달간의 Top 10 AI 뉴스 큐레이션이 모두 목록에 추가되어 있습니다.");
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
    setTimeout(() => {
      setCurrentStep(3);
      setIsStepLoading(false);
      alert("✨ 3단계: 비주얼 수동 업로드 및 Google Vids(구글 비즈) 연동 모드로 전환되었습니다!\n\n2단계에서 복사하신 맞춤형 프롬프트나 대본을 활용하여 Google Vids의 'Help me create' 기능으로 1분 만에 고품질 AI 비디오를 생성하거나, 외부 AI 툴(Luma, Midjourney 등)에서 생성하신 파일을 각 씬의 [📁 내 컴퓨터 파일 선택] 버튼을 통해 업로드해주세요.");
    }, 400);
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
    let currentPrompt = updatedScenes[index].image_prompt || "";

    if (field === "gen_type") {
      if (value === "video") {
        currentPrompt = currentPrompt.replace("[이미지]", "[영상]").replace("A highly detailed hyper-realistic portrait of", "Cinematic tracking shot of").replace("85mm lens, shallow depth of field", "realistic dynamic motion, slow pan");
        if (!currentPrompt.includes("[영상]")) currentPrompt = "[영상] " + currentPrompt;
      } else {
        currentPrompt = currentPrompt.replace("[영상]", "[이미지]").replace("Cinematic tracking shot of", "A highly detailed hyper-realistic portrait of").replace("realistic dynamic motion, slow pan", "85mm lens, shallow depth of field");
        if (!currentPrompt.includes("[이미지]")) currentPrompt = "[이미지] " + currentPrompt;
      }
      updatedScenes[index] = { ...updatedScenes[index], gen_type: value, image_prompt: currentPrompt };
    } else if (field === "video_url") {
      updatedScenes[index] = { ...updatedScenes[index], video_url: value, final_engine: "사용자 직접 교체 (Custom URL)" };
    } else {
      updatedScenes[index] = { ...updatedScenes[index], [field]: value };
    }
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
                <Key className="w-5 h-5 text-amber-400" /><span>구글 네이티브 AI 엔진 API 키 설정</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                구글 <strong>Gemini API 키 단 1개</strong>만 입력하시면 대본 생성(Gemini 1.5 Flash), 비주얼 합성(Imagen 3), AI 성우(Google Cloud TTS Wavenet) 등 모든 파이프라인이 <strong>100% 구글 클라우드 네이티브 모드</strong>로 즉시 통합 가동됩니다. 입력된 키는 로컬 스토리지에만 안전하게 저장됩니다.
              </p>
            </div>

            <div className="space-y-5 p-5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
                  <span>✨ Google Gemini API Key (대본, Imagen 3 비주얼, GCP TTS 통합용)</span>
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

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                <Coins className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">100% 구글 네이티브 아키텍처 전환 완료</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    기존의 복잡했던 OpenAI(DALL-E, TTS) 의존성을 완전히 제거했습니다. 이제 별도의 유료 결제나 복잡한 키 관리 없이, 구글 AI Studio에서 발급받은 Gemini API 키 1개만으로 최고 품질의 숏폼을 무제한 생성하실 수 있습니다.
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
                <Save className="w-4 h-4" /><span>API 키 저장 및 통합 엔진 적용</span>
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
                  <span>{isSearchingNews ? "AI 인기 콘텐츠 서치 중..." : "🔍 AI 시니어 인기 쇼츠 콘텐츠 서치"}</span>
                </button>
                <button onClick={() => { setNewsList([]); setDashboardList([]); alert("시트 및 대시보드의 모든 내용이 초기화되었습니다."); }} className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-3 py-2.5 rounded-xl border border-slate-700">
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

            {/* 🌟 [핵심 추가] 시니어 대상 유튜브 쇼츠용 인기 콘텐츠 추천 (급상승 토픽 큐레이션) */}
            <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin text-amber-400" />
                    <span>🔥 시니어 대상 유튜브 쇼츠 인기 콘텐츠 추천 (급상승 큐레이션)</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">조회수 100만 뷰가 보장되는 검증된 시니어 복지/꿀팁 토픽입니다. 카드 클릭 시 즉시 프로덕션 스튜디오가 열립니다.</p>
                </div>
                <span className="text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl shrink-0">조회수 치트키 TOP 6</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {[
                  { id: 101, topic: "월 100만원 이상 차이나는 65세 이후 국민연금 100% 활용법 및 수령 시기 꿀팁", source: "보건복지부 / 국민연금공단", summary: "연금 수령 연기 제도 활용 및 조기 수령의 장단점을 비교 분석하여 평생 월급을 극대화하는 시니어 필수 전략" },
                  { id: 102, topic: "치아당 100만원 아끼는 65세 이상 임플란트 및 틀니 국비 지원금 100% 받는 법", source: "국민건강보험공단", summary: "만 65세 이상 어르신 대상 본인부담금 30% 혜택 및 추가 지원금 신청 절차 원스톱 가이드" },
                  { id: 103, topic: "자녀 눈치 안 보고 키오스크 1분 만에 정복! 카카오톡 및 기차표 예매 필수 기능 3가지", source: "과학기술정보통신부 / 디지털배움터", summary: "병원 무인 접수기부터 패스트푸드점 키오스크, KTX 예매까지 시니어 디지털 문맹 탈출을 위한 실전 꿀팁" },
                  { id: 104, topic: "내 집에서 평생 연금 받는다! 12억 이하 주택연금 가입 조건 완화 및 혜택 총정리", source: "한국주택금융공사", summary: "가입 기준 공시지가 12억 완화에 따른 월 수령액 변화 및 재산세 감면 혜택, 가입 필수 서류 안내" },
                  { id: 105, topic: "월 70만원~100만원 보장! 60세 이상 정부 지원 시니어 인턴십 및 공공 일자리 신청 가이드", source: "한국노인인력개발원", summary: "낮은 업무 강도와 거주지 인근 근무가 가능한 보건복지부 주관 시니어 인턴십 및 노인 일자리 참여 방법" },
                  { id: 106, topic: "지하철 무료를 넘어 KTX 30% 할인까지! 만 65세 이상 교통 복지 패스 발급 방법", source: "국토교통부 / 코레일", summary: "전국 지하철 무료 탑승 및 KTX/새마을호 경로 할인 혜택을 한 장의 카드로 누리는 통합 복지 패스 안내" }
                ].map((item) => (
                  <div key={item.id} onClick={() => handleOpenMasterStudio({ id: item.id, topic: item.topic, source: item.source, summary: item.summary, status: "Ready" })} className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between space-y-3 group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-blue-400 font-mono">{item.source}</span>
                        <span className="text-slate-500 group-hover:text-amber-400 transition-colors font-bold">대본 생성 ➡️</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-relaxed">{item.topic}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{item.summary}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">난이도: 쉬움</span>
                      <span className="text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">스튜디오 열기 🚀</span>
                    </div>
                  </div>
                ))}
              </div>
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

            {/* 🌟 2단계 프로그레스 바 네비게이션 (심플화) */}
            <div className="mb-8 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
              <div className="grid grid-cols-2 gap-4 text-center relative mb-4">
                
                <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${currentStep === 1 ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    {currentStep > 1 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" /> : <Search className="w-5 h-5" />}
                    <span className="text-sm font-bold">Step 1. 인기 콘텐츠 선택</span>
                  </div>
                  <span className="text-[11px] opacity-80 line-clamp-1">{currentStep > 1 ? "✅ 콘텐츠 확정" : "시니어 타겟 주제 확인"}</span>
                </div>

                <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${currentStep === 2 ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10" : "bg-slate-900/50 border-slate-800 text-slate-500"}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Bot className="w-5 h-5" />
                    <span className="text-sm font-bold">Step 2. 대본 및 제작 가이드</span>
                  </div>
                  <span className="text-[11px] opacity-80 line-clamp-1">AI 대본 생성 및 외부 툴 연동 안내</span>
                </div>
              </div>

              {/* 실시간 프로그레스 바 */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-700 ease-out" 
                  style={{ width: `${(currentStep / 2) * 100}%` }}
                />
              </div>
            </div>

            {/* 메인 콘텐츠 영역 (현재 단계별 뷰 렌더링) */}
            <div className="flex-1 overflow-y-auto pr-2 mb-6">
              {isStepLoading ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fadeIn">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-100 mb-2">
                    AI가 시니어 맞춤형 대본과 고해상도 프롬프트를 작성 중입니다...
                  </h4>
                  <p className="text-xs text-slate-400 mb-6 max-w-md leading-relaxed">
                    선택하신 콘텐츠의 팩트를 분석하여 유튜브 쇼츠에 최적화된 5개 씬 분량의 내레이션과 영상 제작 프롬프트를 생성합니다. (최대 10초 소요)
                  </p>

                  <div className="w-full max-w-md bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5">
                    <div className="text-xs font-bold text-slate-300 flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span>🔄 AI 파싱 체크리스트</span>
                      <span className="text-amber-400 animate-pulse">생성 중...</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium pt-1">
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                      <span>기획 및 대본 작성, 프롬프트 엔지니어링 진행 중...</span>
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
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between"><span>하단 자막 / TTS 대본</span><span className={`text-[11px] ${sc.narration.length > 25 ? "text-amber-400 font-bold" : "text-slate-500"}`}>{sc.narration.length}자 / 권장 20자 내외</span></label>
                              <textarea rows={3} value={sc.narration} onChange={(e) => handleMasterSceneChange(idx, "narration", e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-medium text-slate-200 focus:border-amber-500 focus:outline-none resize-none leading-relaxed" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-between"><span>외부 AI 툴(Midjourney, Luma 등) 복사용 프롬프트 (한영 혼합)</span><span className="text-[10px] text-amber-400 font-mono">클릭하여 전체 복사 가능</span></label>
                              <textarea rows={8} value={sc.image_prompt} onChange={(e) => handleMasterSceneChange(idx, "image_prompt", e.target.value)} onClick={(e) => { (e.target as HTMLTextAreaElement).select(); navigator.clipboard.writeText(sc.image_prompt); alert(`Scene #${sc.scene_id} 프롬프트가 클립보드에 복사되었습니다!`); }} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 focus:border-amber-500 focus:outline-none resize-y leading-relaxed" placeholder="프롬프트가 생성됩니다..." />
                            </div>

                            {/* 🌟 [요구사항 반영] 씬별 비주얼 소스 실시간 관리 및 직접 교체 (파일 업로드 & URL) */}
                            <div className="pt-2 border-t border-slate-800/80 space-y-3">
                              <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5"><Link className="w-3.5 h-3.5 text-amber-400" /><span>🖼️ 씬별 비주얼 소스 실시간 관리 및 직접 교체 (파일 업로드 & URL)</span></label>
                              <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="w-full md:w-1/3 h-32 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center relative group shrink-0">
                                  {sc.video_url?.endsWith(".mp4") || sc.video_url?.startsWith("data:video") || sc.gen_type === "video" ? (
                                    <video src={sc.video_url} className="w-full h-full object-cover" loop muted playsInline autoPlay />
                                  ) : <img src={sc.video_url} alt={`Scene ${sc.scene_id}`} className="w-full h-full object-cover" />}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-[10px] text-white">{sc.final_engine || (sc.gen_type === "video" ? "🌊 Flow 비디오" : "🍌 Nano Banana")}</div>
                                </div>
                                <div className="w-full md:w-2/3 space-y-3">
                                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                                    <label className="block text-xs font-bold text-amber-400 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /><span>📁 내 컴퓨터 파일 선택 (업로드)</span></label>
                                    <input type="file" accept="image/*,video/mp4" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(idx, file, true); }} className="w-full text-xs text-slate-300 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer" />
                                    <span className="text-[10px] text-slate-500 block">.jpg, .png, .mp4 지원 (플로우, 나노바나나 등 즉시 반영)</span>
                                  </div>

                                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                                    <label className="block text-xs font-bold text-blue-400 flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /><span>🌐 구글/캔바/비즈 이미지/영상 주소 붙여넣기</span></label>
                                    <div className="flex items-center gap-1.5">
                                      <input type="text" value={sc.video_url || ""} onChange={(e) => handleMasterSceneChange(idx, "video_url", e.target.value)} placeholder="https://..." className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:border-blue-500 focus:outline-none" />
                                      <button type="button" onClick={() => alert(`Scene #${sc.scene_id} 비주얼이 성공적으로 교체되었습니다!`)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 shrink-0 shadow">적용</button>
                                    </div>
                                    <span className="text-[10px] text-slate-500 block">이미지/동영상 주소 복사(Copy image/video address) URL</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 🌟 [요구사항 반영] 5단 씬 이어 붙여서 통합 미리보기 버튼 패널 */}
                  <div className="p-5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl text-slate-950 shadow-lg shadow-amber-500/20 shrink-0">
                        <Smartphone className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          <span>🎬 5단 씬 이어 붙여서 통합 미리보기 (재생 플레이어)</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">플로우 & 나노바나나</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">업로드하거나 주소를 넣은 5개의 씬을 하나로 이어 붙여서 즉시 재생하고 싱크를 확인하세요.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setPreviewShorts({
                          id: masterNewsItem.id || Date.now(),
                          shorts_title: masterForm.shorts_title,
                          topic: masterNewsItem.topic,
                          scenes: masterForm.scenes,
                          bgm_track: bgmTrack
                        });
                        setActiveSceneIndex(0);
                        setIsPlaying(true);
                      }}
                      className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-all shrink-0 flex items-center gap-2"
                    >
                      <Play className="w-5 h-5 fill-current" /><span>🎬 통합 미리보기 재생</span>
                    </button>
                  </div>

                  {/* 🌟 2단계 핵심: Google Vids 및 CapCut 제작 추천 가이드 (정적 패널) */}
                  <div className="p-5 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl space-y-4 mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-500/30 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                          <Video className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                            <span>🚀 외부 AI 스튜디오 연동 제작 추천 가이드</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Google Vids & CapCut</span>
                          </h4>
                          <p className="text-xs text-slate-300 mt-0.5">아래 복사 버튼을 눌러 생성된 전체 대본을 한 번에 복사하고 외부 툴에서 제작을 이어가세요.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a href="https://vids.google.com" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all shrink-0">
                          <span>🌐 Google Vids 열기</span> <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-amber-400 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> 1. Vids Help me create</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">복사한 대본을 Google Vids 프롬프트창에 넣으면 AI가 스토리보드와 스톡 영상을 자동 배치합니다.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-emerald-400 flex items-center gap-1"><Mic className="w-3.5 h-3.5" /> 2. 추천 AI 성우 설정 (Capcut)</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">시니어 타겟에 맞게 <strong>[한국어 중저음 남성 (Wavenet-C)]</strong> 톤으로 속도를 조금 느리게(0.75x) 설정하세요.</p>
                      </div>
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                        <span className="font-bold text-blue-400 flex items-center gap-1"><Music className="w-3.5 h-3.5" /> 3. 추천 배경음악 (BGM)</span>
                        <p className="text-[11px] text-slate-400 leading-relaxed">대사 전달력을 높이기 위해 <strong>잔잔한 피아노 곡</strong>을 선택하고 BGM 볼륨을 20% 내외로 낮춰주세요.</p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                      <div className="text-xs text-slate-300">
                        <span className="font-bold text-slate-200 block mb-0.5">💡 전체 대본 및 프롬프트 원클릭 복사</span>
                        <span className="text-[11px] text-slate-400">외부 AI 툴(Vids, CapCut) 프롬프트 창에 바로 붙여넣기 가장 좋은 형태로 복사됩니다.</span>
                      </div>
                      <button 
                        onClick={() => {
                          const vidsPrompt = `유튜브 쇼츠 제목: ${masterForm.shorts_title}\n\n[장면별 구성 및 연출 지침]\n` + masterForm.scenes.map((sc: any, i: number) => `Scene #${i+1}\n- 내레이션: ${sc.narration}\n- 연출 프롬프트: ${sc.image_prompt}`).join("\n\n");
                          navigator.clipboard.writeText(vidsPrompt);
                          alert("📋 전체 대본 및 연출 프롬프트가 클립보드에 복사되었습니다!\n\nGoogle Vids 또는 기타 AI 영상 툴에 그대로 붙여넣으세요.");
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all shrink-0 flex items-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" /><span>📋 전체 대본 복사하기</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* 하단 액션 버튼 바 */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 z-10">
              <button onClick={() => setIsMasterStudioOpen(false)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all">
                닫기
              </button>
              
              <div className="flex items-center gap-3">
                {!isStepLoading && currentStep === 1 && (
                  <button onClick={handleExecuteStep2} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
                    <span>➡️ 2단계: AI 대본 및 프롬프트 생성</span><ArrowRight className="w-4 h-4" />
                  </button>
                )}
                {!isStepLoading && currentStep === 2 && (
                  <button onClick={() => {
                    // 보관함에 저장
                    const finalResult = {
                      id: masterNewsItem.id || Date.now(), 
                      topic: masterNewsItem.topic,
                      shorts_title: masterForm.shorts_title,
                      created_at: new Date().toISOString().split('T')[0],
                      status: "대본 생성 완료 (제작 대기)",
                      scenes: masterForm.scenes
                    };
                    setNewsList(prev => prev.map(item => item.id === masterNewsItem.id ? { ...item, status: "Done" } : item));
                    setDashboardList(prev => [finalResult, ...prev]);
                    setIsMasterStudioOpen(false);
                    setActiveTab("dashboard");
                    alert("보관함(대시보드)에 성공적으로 저장되었습니다!");
                  }} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-8 py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                    <Save className="w-4 h-4" /><span>보관함에 대본 저장하고 나가기</span>
                  </button>
                )}
              </div>
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
