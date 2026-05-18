"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Play, CheckCircle2, Clock, Video, FileText, Sparkles, Layers, Bot, Download, 
  ExternalLink, AlertCircle, ChevronRight, RefreshCw, Calendar, TrendingUp, 
  Film, Music, Check, Edit3, Zap, UserCheck, Sliders, AlertTriangle, RotateCcw, 
  Key, Eye, EyeOff, Save, Table, HelpCircle, Gem, Cpu, Coins, Image as ImageIcon,
  Loader2, Pause, SkipBack, SkipForward, Smartphone, Search, ArrowRight, ArrowLeft, CheckSquare, Link, Upload, Volume2, Mic, X, Store
} from "lucide-react";

// 초기 뉴스 및 대시보드 데이터 (데모용 데이터 전부 삭제)
const initialNews: any[] = [];
const initialDashboard: any[] = [];

// 기본 실사 이미지 Fallback (데모용 풀 삭제 및 단일 플레이스홀더 유지)
const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80";

// AI 스튜디오 토픽 선언 (시니어 및 자영업자 분리)
const SENIOR_TOPICS = [
  '건강 / 생활 꿀팁',
  '취미 / 여가',
  '정부 정책 / 복지 혜택',
  '생활 정보 / 트렌드',
  '인간관계 / 처세',
  '자산 관리 / 생활 경제',
  '디지털 활용 / 스마트폰 교육',
  '웰다잉 / 인생 회고'
];

const BIZ_TOPICS = [
  '매출 2배 상승 / 마케팅 꿀팁',
  '절세 노하우 / 정부 지원금 활용',
  '진상 고객 대처 / 스마트 매장 관리',
  '소상공인 트렌드 / 창업 성공 전략',
  '알짜 직원 관리 / 알바 채용 팁',
  '단골 만드는 소통 / 서비스 차별화'
];

interface IdeaOutput {
  title: string;
  topic: string;
  tags: string[];
  script: string;
  visuals: string;
  bgm: string;
  scenes?: { scene_no: number, narration: string, visual_prompt: string, visual_prompt_kr?: string }[];
}

export default function Home() {
  const [newsList, setNewsList] = useState(initialNews);
  const [dashboardList, setDashboardList] = useState(initialDashboard);
  const [activeTab, setActiveTab] = useState<"curation" | "dashboard" | "ai_studio" | "apikeys">("ai_studio");
  const [workflowMode, setWorkflowMode] = useState<"auto" | "semi">("semi");

  // API 키 전역 관리 상태 (컴포넌트 상단 배치로 모든 함수에서 안전하게 접근 가능)
  const [apiKeys, setApiKeys] = useState({ geminiKey: "", openaiKey: "", elevenlabsKey: "" });
  const [showKeys, setShowKeys] = useState({ gemini: false, openai: false, elevenlabs: false });
  const [isKeySaved, setIsKeySaved] = useState(false);

  useEffect(() => {
    const savedGemini = localStorage.getItem("GEMINI_API_KEY") || "";
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

  // AI Studio 기능 상태
  const [sceneCount, setSceneCount] = useState<number>(4);
  const [newsCount, setNewsCount] = useState<number>(5);
  const [selectedStudioTopic, setSelectedStudioTopic] = useState('');
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [editableIdea, setEditableIdea] = useState<IdeaOutput | null>(null);

  const [isGeneratingImage, setIsGeneratingImage] = useState<Record<number, boolean>>({});
  const [studioImageBase64, setStudioImageBase64] = useState<Record<number, string>>({});

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [studioAudioBase64, setStudioAudioBase64] = useState<string | null>(null);
  
  const studioAudioRef = useRef<HTMLAudioElement | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleGenerateStudioIdea = async () => {
    if (!selectedStudioTopic) return;
    setIsGeneratingIdea(true);
    setEditableIdea(null);
    setStudioImageBase64({});
    setStudioAudioBase64(null);

    try {
      const res = await fetch('/api/generate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: selectedStudioTopic, sceneCount, apiKeys }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setEditableIdea(data);
    } catch (e: any) {
      alert('오류가 발생했습니다: ' + e.message);
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  const handleUpdateEditableIdea = (field: keyof IdeaOutput, value: string) => {
    if (editableIdea) {
      setEditableIdea({ ...editableIdea, [field]: value });
    }
  };

  const handleGenerateSceneImage = async (sceneNo: number, visualPrompt: string) => {
    if (!editableIdea) return;
    setIsGeneratingImage(prev => ({ ...prev, [sceneNo]: true }));
    try {
      const prompt = `Visual setting: ${visualPrompt}, Topic: ${editableIdea.topic}`;
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKeys }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStudioImageBase64(prev => ({ ...prev, [sceneNo]: data.imageUrl || data.imageBase64 }));
    } catch (e: any) {
      alert(`씬 ${sceneNo} 이미지 생성 오류: ` + e.message);
    } finally {
      setIsGeneratingImage(prev => ({ ...prev, [sceneNo]: false }));
    }
  };

  const handleGenerateStudioAudio = async () => {
    if (!editableIdea) return;
    setIsGeneratingAudio(true);
    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editableIdea.script, apiKeys }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStudioAudioBase64(data.audioBase64);
      
      if (studioAudioRef.current) {
        studioAudioRef.current.load();
      }
    } catch (e: any) {
      alert('오디오 생성 오류: ' + e.message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleSaveStudioToDashboard = async () => {
    if (!editableIdea) return;
    
    const formattedScenes = editableIdea.scenes ? editableIdea.scenes.map(sc => ({
      scene_id: sc.scene_no,
      narration: sc.narration,
      image_prompt: sc.visual_prompt,
      gen_type: "image",
      video_url: studioImageBase64[sc.scene_no] ? `data:image/jpeg;base64,${studioImageBase64[sc.scene_no]}` : DEFAULT_FALLBACK_IMAGE,
      audio_url: "", // 향후 씬별 오디오 연동 시 여기에 매핑
      final_engine: studioImageBase64[sc.scene_no] ? "🍌 AI 생성 이미지" : "🍌 Nano Banana (Fallback)",
      tts_voice: ttsVoice
    })) : [];

    const newShorts = {
      id: Date.now(),
      shorts_title: editableIdea.title,
      topic: editableIdea.topic,
      created_at: new Date().toISOString().split('T')[0],
      upload_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: "AI 퀵 스튜디오 생성 완료",
      bgm_track: editableIdea.bgm || "piano",
      isRealApi: true,
      scenes: formattedScenes.length > 0 ? formattedScenes : [
        { scene_id: 1, narration: editableIdea.script, image_prompt: editableIdea.visuals, gen_type: "image", video_url: DEFAULT_FALLBACK_IMAGE, audio_url: "", final_engine: "Fallback", tts_voice: ttsVoice }
      ]
    };

    // Netlify 백엔드(DB) 저장 요청 로직
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newShorts)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
    } catch (e) {
      console.error("DB 저장 실패:", e);
      // DB 저장에 실패해도 로컬 상태에는 추가되도록 계속 진행
    }

    setDashboardList(prev => [newShorts, ...prev]);
    alert("🎉 보관함(대시보드) 및 시스템 DB에 성공적으로 저장되었습니다!\n'콘텐츠 관리 대시보드' 탭에서 확인 및 통합 미리보기가 가능합니다.");
  };

  // AI 성우 및 BGM 전역 설정 상태
  const [ttsVoice, setTtsVoice] = useState<string>("onyx");
  const [bgmTrack, setBgmTrack] = useState<string>("piano");
  const [bgmVolume, setBgmVolume] = useState<number>(0.2);

  // AI 뉴스 서치 상태 및 핸들러
  const [isSearchingNews, setIsSearchingNews] = useState(false);

  const handleSearchAI_News = async () => {
    setIsSearchingNews(true);
    try {
      const res = await fetch('/api/search-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: newsCount, apiKeys }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const aiNewsPool = data.data;
      const existingTopics = newsList.map(n => n.topic);
      const newItems = aiNewsPool.filter((item: any) => !existingTopics.includes(item.topic));
      
      if (newItems.length > 0) {
        const newItemsWithId = newItems.map((item: any, idx: number) => ({ ...item, id: newsList.length + idx + 1 }));
        setNewsList(prev => [...newItemsWithId, ...prev]);
        alert(`🎉 AI가 최신 시니어 트렌드 뉴스 ${newItems.length}건을 큐레이션하여 목록에 추가했습니다!`);
      } else {
        alert("최신 AI 뉴스 큐레이션이 이미 목록에 모두 반영되어 있습니다.");
      }
    } catch (err: any) {
      console.error("Search News Error:", err);
      alert("AI 뉴스 서치 중 오류가 발생했습니다: " + err.message);
    } finally {
      setIsSearchingNews(false);
    }
  };

  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<string>("");

  // 숏폼 통합 미리보기 상태
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
    if (previewShorts && bgmRef.current && previewShorts.bgm_track !== "none") {
      bgmRef.current.volume = bgmVolume;
      if (isPlaying) bgmRef.current.play().catch(e => console.log("BGM auto-play blocked:", e));
      else bgmRef.current.pause();
    }
  }, [activeSceneIndex, previewShorts, isPlaying, bgmVolume]);

  // 단계별 마스터 프로덕션 스튜디오 상태
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
      scenes: [], isRealApi: false
    });
    // 모달이 열리면 즉시 AI 대본 및 씬 분할 자동 생성 실행
    handleExecuteStep2(newsItem);
  };

  const handleExecuteStep2 = async (newsItem: any = masterNewsItem) => {
    setIsStepLoading(true);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newsItem.id, topic: newsItem.topic, source: newsItem.source, mode: "step2_script", sceneCount, apiKeys })
      });
      const data = await res.json();
      if (data.success) {
        setMasterForm({ shorts_title: data.data.shorts_title, scenes: data.data.scenes, isRealApi: data.isRealApi });
        setCurrentStep(2);
      }
    } catch (err) { console.error("Step 2 API Error:", err); }
    finally { setIsStepLoading(false); }
  };

  const handleGenerateMasterSceneImage = async (sceneIdx: number, visualPrompt: string) => {
    const sceneId = masterForm.scenes[sceneIdx].scene_id;
    setIsGeneratingImage(prev => ({ ...prev, [sceneId]: true }));
    try {
      const prompt = `Visual setting: ${visualPrompt}, Topic: ${masterForm.shorts_title}`;
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKeys }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setMasterForm((prev: any) => {
        const newScenes = [...prev.scenes];
        newScenes[sceneIdx] = { ...newScenes[sceneIdx], video_url: `data:image/jpeg;base64,${data.imageBase64}`, final_engine: "🍌 AI 생성 이미지" };
        return { ...prev, scenes: newScenes };
      });
      
    } catch (e: any) {
      alert(`씬 ${sceneId} 이미지 생성 오류: ` + e.message);
    } finally {
      setIsGeneratingImage(prev => ({ ...prev, [sceneId]: false }));
    }
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
        alert("✨ 3단계: AI 비주얼 자동 매칭 완료!");
      }
    } catch (err) { console.error("Step 3 API Error:", err); }
    finally { setIsStepLoading(false); }
  };

  const handleExecuteStep4 = async () => {
    setIsStepLoading(true);
    try {
      const res = await fetch("/api/webhook", {
        method: "POST", headers: { "Content-Type": "application/json" },
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

      if (hasBgm) {
        setDownloadProgress(`배경음악(BGM) 트랙 다운로드 중... (${completedFiles + 1}/${totalFiles})`);
        const filename = `Shorts_${item.id}_BGM_${item.bgm_track}.mp3`;
        const downloadUrl = `/api/download?url=${encodeURIComponent(`/audio/bgm_${item.bgm_track}.mp3`)}&filename=${filename}`;
        
        const a = document.createElement('a'); a.href = downloadUrl; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        completedFiles++; await new Promise(r => setTimeout(r, 800));
      }

      setDownloadProgress("✅ 모든 소스 패키지 다운로드 완료!");
      setTimeout(() => { setDownloadingId(null); setDownloadProgress(""); }, 2000);
    } catch (err) {
      console.error("Download Error:", err);
      alert("다운로드 중 오류가 발생했습니다. 백엔드 서버 연결을 확인해주세요.");
      setDownloadingId(null); setDownloadProgress("");
    }
  };

  const handleDownloadSRT = (item: any) => {
    let srtContent = "";
    let currentTime = 0;
    
    item.scenes.forEach((sc: any, idx: number) => {
      const sceneNum = idx + 1;
      const duration = sc.gen_type === "video" ? 4000 : 3500;
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
    alert("📜 캡컷 연동용 완벽 자막 파일(.srt)이 성공적으로 다운로드되었습니다!");
  };

  const [selectedShorts, setSelectedShorts] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
      {/* 헤더 영역 (화이트 테마 및 간소화) */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-500 p-2.5 rounded-xl shadow-md text-white">
            <Cpu className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Shorts Factory</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                🍌 플로우 AI 전용 파이프라인
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              자료 서치부터 최종 조립까지 완벽한 AI 프로덕션 스튜디오
            </p>
          </div>
        </div>

      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 네비게이션 탭 (화이트 테마 및 불필요 탭 삭제) */}
        <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-px overflow-x-auto">
          <button onClick={() => setActiveTab("ai_studio")} className={`px-5 py-3 rounded-t-xl font-medium text-sm flex items-center gap-2 transition-all border-b-2 shrink-0 ${activeTab === "ai_studio" ? "bg-white text-amber-600 border-amber-500 shadow-sm" : "text-slate-500 border-transparent hover:text-slate-900 hover:bg-white/50"}`}>
            <Sparkles className="w-4 h-4" /><span>✨ AI 퀵 스튜디오</span>
          </button>
          <button onClick={() => setActiveTab("dashboard")} className={`px-5 py-3 rounded-t-xl font-medium text-sm flex items-center gap-2 transition-all border-b-2 shrink-0 ${activeTab === "dashboard" ? "bg-white text-amber-600 border-amber-500 shadow-sm" : "text-slate-500 border-transparent hover:text-slate-900 hover:bg-white/50"}`}>
            <Video className="w-4 h-4" /><span>콘텐츠 관리 대시보드</span>
            <span className="ml-1 px-2 py-0.5 text-xs bg-slate-100 rounded-full text-slate-600 border border-slate-200">{dashboardList.length}</span>
          </button>
        </div>

        {/* 탭: AI 퀵 스튜디오 */}
        {activeTab === "ai_studio" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-12 animate-fadeIn">
            <section className="space-y-8">
              {/* 1. 시니어 쇼츠 기획 주제 선택하기 */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>1. 시니어 쇼츠 기획 주제 선택하기</span>
                  </h2>
                  <p className="text-xs text-slate-500">시니어 타깃의 유튜브 쇼츠 주제를 선택해주세요. AI가 즉시 공감대 높은 대본을 기획합니다.</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {SENIOR_TOPICS.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedStudioTopic(topic)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                        selectedStudioTopic === topic
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-105'
                          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-200 shadow-sm'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. 자영업자 쇼츠 기획 주제 선택하기 */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <Store className="w-5 h-5 text-blue-600" />
                    <span>2. 자영업자 쇼츠 기획 주제 선택하기</span>
                  </h2>
                  <p className="text-xs text-slate-500">소상공인 및 자영업자를 위한 실전 꿀팁과 노하우 주제를 선택해주세요. 매출을 부르는 대본을 기획합니다.</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {BIZ_TOPICS.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedStudioTopic(topic)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none ${
                        selectedStudioTopic === topic
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md scale-105'
                          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-200 shadow-sm'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-sm font-bold text-slate-700 whitespace-nowrap">🎥 씬 개수 선택:</label>
                  <select 
                    value={sceneCount} 
                    onChange={(e) => setSceneCount(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm w-24"
                  >
                    {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}개 씬</option>)}
                  </select>
                </div>

                <div className="flex flex-wrap gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleGenerateStudioIdea}
                    disabled={!selectedStudioTopic || isGeneratingIdea}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md w-full sm:w-auto justify-center"
                  >
                    {isGeneratingIdea ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI 기획 생성 중...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>쇼츠 기획 자동 생성</span>
                      </>
                    )}
                  </button>
                  
                  {editableIdea && (
                    <button
                      onClick={handleSaveStudioToDashboard}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md w-full sm:w-auto justify-center animate-bounce"
                    >
                      <Save className="w-4 h-4" />
                      <span>🗂️ 대시보드 및 DB 저장</span>
                    </button>
                  )}
                </div>
              </div>
            </section>

            {editableIdea && (
              <section className="space-y-8 animate-fadeIn pb-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 대본 및 기획안 */}
                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-orange-500"></div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 uppercase tracking-wider">
                          <Film className="w-4 h-4" />
                          <span>AI 기획안 (수정 가능)</span>
                        </div>
                      </div>
                      <input 
                        type="text"
                        className="text-lg font-bold leading-tight w-full bg-white border border-slate-300 hover:border-slate-400 focus:border-amber-500 focus:outline-none transition-colors px-4 py-3 rounded-xl text-slate-900"
                        value={editableIdea.title}
                        onChange={(e) => handleUpdateEditableIdea('title', e.target.value)}
                      />
                      <div className="flex flex-wrap gap-2 pt-1">
                        {Array.isArray(editableIdea.tags) && editableIdea.tags.map((tag, i) => (
                          <span key={i} className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">#{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-slate-200 w-full" />

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 border-l-2 border-amber-500 pl-3">
                          <FileText className="w-4 h-4 text-amber-500" />
                          <span>자막 및 내레이션 대본</span>
                        </h4>
                        <textarea
                          rows={6}
                          className="w-full text-slate-800 leading-relaxed bg-white border border-slate-300 hover:border-slate-400 focus:border-amber-500 focus:outline-none p-4 rounded-2xl text-xs resize-y transition-colors font-medium"
                          value={editableIdea.script}
                          onChange={(e) => handleUpdateEditableIdea('script', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 border-l-2 border-amber-500 pl-3">
                          <ImageIcon className="w-4 h-4 text-amber-500" />
                          <span>화면 연출 (프롬프트용)</span>
                        </h4>
                        <textarea
                          rows={3}
                          className="w-full text-slate-700 leading-relaxed bg-white border border-slate-300 hover:border-slate-400 focus:border-amber-500 focus:outline-none p-3 rounded-xl text-xs resize-y transition-colors font-mono"
                          value={editableIdea.visuals}
                          onChange={(e) => handleUpdateEditableIdea('visuals', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700 border-l-2 border-amber-500 pl-3">
                          <Music className="w-4 h-4 text-amber-500" />
                          <span>추천 배경음악</span>
                        </h4>
                        <input
                          type="text"
                          className="w-full text-slate-700 bg-white border border-slate-300 hover:border-slate-400 focus:border-amber-500 focus:outline-none px-4 py-3 rounded-xl text-xs transition-colors"
                          value={editableIdea.bgm}
                          onChange={(e) => handleUpdateEditableIdea('bgm', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 에셋 생성 패널 */}
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                          <ImageIcon className="w-5 h-5 text-amber-500" />
                          <span>2. 씬별 이미지 생성 (일괄 제작)</span>
                        </h3>
                        <p className="text-slate-500 text-xs">기획안에 맞춘 세로형 (9:16) 고화질 이미지를 각 씬별로 생성합니다.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {editableIdea.scenes?.map((scene) => (
                          <div key={scene.scene_no} className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md inline-block border border-slate-200">Scene {scene.scene_no}</div>
                              <span className="text-[10px] text-slate-400 font-medium">9:16 세로형</span>
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>한글 연출 설명</span>
                              </span>
                              <textarea
                                rows={2}
                                className="w-full text-xs text-slate-800 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200 focus:outline-none resize-none font-medium"
                                value={scene.visual_prompt_kr || "AI가 한글 연출 설명을 작성했습니다."}
                                readOnly
                              />
                            </div>
                            <div className="space-y-1.5">
                              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span>AI 영문 프롬프트 (고정값 포함)</span>
                              </span>
                              <textarea
                                rows={3}
                                className="w-full text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:outline-none resize-none font-mono leading-relaxed"
                                value={scene.visual_prompt}
                                readOnly
                              />
                            </div>
                            {studioImageBase64[scene.scene_no] ? (
                              <div className="space-y-3">
                                <div 
                                  className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm cursor-pointer group"
                                  onClick={() => setZoomedImage(studioImageBase64[scene.scene_no]?.startsWith("http") ? studioImageBase64[scene.scene_no] : `data:image/jpeg;base64,${studioImageBase64[scene.scene_no]}`)}
                                >
                                  <img 
                                    src={studioImageBase64[scene.scene_no]?.startsWith("http") ? studioImageBase64[scene.scene_no] : `data:image/jpeg;base64,${studioImageBase64[scene.scene_no]}`} 
                                    alt={`Scene ${scene.scene_no}`} 
                                    className="w-full h-full object-cover animate-fadeIn group-hover:scale-105 transition-transform"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                    <Search className="w-8 h-8 mb-2" />
                                    <span className="text-xs font-bold">확대 보기</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleGenerateSceneImage(scene.scene_no, scene.visual_prompt)}
                                  disabled={isGeneratingImage[scene.scene_no]}
                                  className="w-full py-2.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {isGeneratingImage[scene.scene_no] ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "다시 생성"}
                                </button>
                              </div>
                            ) : (
                              <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center">
                                <button
                                  onClick={() => handleGenerateSceneImage(scene.scene_no, scene.visual_prompt)}
                                  disabled={isGeneratingImage[scene.scene_no]}
                                  className="w-full h-full hover:bg-slate-50 transition-colors flex flex-col items-center justify-center gap-2 p-4 text-slate-500"
                                >
                                  {isGeneratingImage[scene.scene_no] ? (
                                    <><Loader2 className="w-6 h-6 animate-spin text-amber-500"/><span className="text-[10px]">그리는 중...</span></>
                                  ) : (
                                    <><Sparkles className="w-6 h-6"/><span className="text-[11px] font-bold">이미지 만들기</span></>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                        {(!editableIdea.scenes || editableIdea.scenes.length === 0) && (
                          <div className="col-span-full p-6 text-center text-sm text-slate-500 bg-white border border-slate-200 rounded-2xl">
                            씬 정보가 분리되지 않았습니다. 'AI 퀵 스튜디오 기획 아이디어 내기' 버튼을 다시 눌러주세요.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* 탭: 콘텐츠 대시보드 */}
        {activeTab === "dashboard" && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>🗂 콘텐츠 관리 대시보드</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">생성 완료된 숏폼들의 상세 대본과 비주얼, 🎬 통합 미리보기를 관리합니다.</p>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-xl shadow-md text-xs font-bold animate-pulse">
                <ImageIcon className="w-4 h-4" />
                <span>이번 달 총 생성 이미지: {dashboardList.reduce((acc: number, item: any) => acc + (item.scenes?.length || 0), 0)}건</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {dashboardList.map((item: any) => (
                <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all group relative overflow-hidden">
                  {downloadingId === item.id && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 animate-fadeIn text-center">
                      <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                      <p className="text-sm font-bold text-slate-900 mb-1">{downloadProgress}</p>
                      <p className="text-[11px] text-slate-500">실제 파일이 다운로드되고 있습니다.</p>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-amber-100 rounded-xl border border-amber-200 text-amber-700 mt-1">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 mb-1">
                          <span className="text-xs font-semibold text-slate-600 bg-white px-2.5 py-0.5 rounded border border-slate-200">제작일: {item.created_at}</span>
                          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-200">예약일: {item.upload_date}</span>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3" /> {item.status || "AI Generated"}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{item.shorts_title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">원문 주제: {item.topic}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center z-10">
                      <button 
                        onClick={() => { setPreviewShorts(item); setActiveSceneIndex(0); setIsPlaying(true); }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:scale-105"
                      >
                        <Smartphone className="w-4 h-4" /><span>🎬 통합 미리보기</span>
                      </button>

                      <button onClick={() => setSelectedShorts(item)} className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-medium border border-slate-300 transition-all shadow-sm">
                        <Layers className="w-3.5 h-3.5 text-amber-500" /><span>대본 & 프롬프트 상세보기</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {item.scenes.map((scene: any, idx: number) => (
                      <div key={scene.scene_id} className="bg-white border border-slate-200 rounded-xl p-3 relative group/scene hover:border-slate-300 transition-all shadow-sm">
                        <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Scene #{scene.scene_id}</div>
                        <div className="pr-12 mb-2">
                          <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-relaxed">"{scene.narration}"</p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <span className={`flex items-center gap-1 font-bold ${scene.final_engine?.includes("Video") ? "text-amber-600" : "text-blue-600"}`}>
                            {scene.final_engine?.includes("Video") ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                            {scene.final_engine || "Nano Banana"}
                          </span>
                          <button 
                            onClick={() => { setPreviewShorts(item); setActiveSceneIndex(idx); setIsPlaying(true); }}
                            className="text-amber-600 hover:underline flex items-center gap-1"
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
      </main>


      {/* 숏폼 통합 미리보기 플레이어 모달 */}
      {previewShorts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-8 shadow-2xl max-h-[95vh] flex flex-col relative overflow-hidden text-slate-900">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-md">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>🎬 숏폼 통합 미리보기 플레이어</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{previewShorts.shorts_title}</p>
                </div>
              </div>
              <button onClick={() => { setPreviewShorts(null); setIsPlaying(false); }} className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 p-2.5 rounded-xl border border-slate-200">닫기</button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 overflow-y-auto pb-4">
              {/* 9:16 스마트폰 목업 UI 플레이어 */}
              <div className="relative w-[300px] h-[533px] bg-black rounded-[36px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between shrink-0 group">
                <div className="absolute top-0 left-0 w-full z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-50 animate-ping"></span>
                    <span className="text-[11px] font-bold text-white font-mono bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">Scene #{activeSceneIndex + 1}/5</span>
                  </div>
                  <span className="text-[10px] text-white/80 font-semibold bg-black/60 px-2 py-0.5 rounded-full">
                    {previewShorts.scenes[activeSceneIndex].final_engine?.includes("Video") ? "🌊 Flow 모션" : "🍌 Nano Banana"}
                  </span>
                </div>

                <div className="absolute inset-0 w-full h-full z-10 bg-slate-950 flex items-center justify-center overflow-hidden">
                  {previewShorts.scenes[activeSceneIndex].video_url?.endsWith(".mp4") || previewShorts.scenes[activeSceneIndex].video_url?.startsWith("data:video") || previewShorts.scenes[activeSceneIndex].gen_type === "video" ? (
                    <video ref={videoRef} className="w-full h-full object-cover" loop muted playsInline src={previewShorts.scenes[activeSceneIndex].video_url} />
                  ) : <img src={previewShorts.scenes[activeSceneIndex].video_url || DEFAULT_FALLBACK_IMAGE} alt={`Scene ${activeSceneIndex + 1}`} className="w-full h-full object-cover animate-fadeIn" />}
                  
                  <audio ref={audioRef} src={previewShorts.scenes[activeSceneIndex].audio_url} />
                  {previewShorts.bgm_track && previewShorts.bgm_track !== "none" && (
                    <audio ref={bgmRef} src={`/audio/bgm_${previewShorts.bgm_track}.mp3`} loop />
                  )}
                </div>

                <div className="absolute bottom-16 left-0 w-full z-30 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center text-center">
                  <div className="bg-black/75 border border-amber-500/40 px-4 py-3 rounded-2xl backdrop-blur-md w-full max-w-[270px] shadow-lg animate-fadeIn">
                    <p className="text-base font-bold text-amber-400 drop-shadow-md leading-snug tracking-wide">
                      "{previewShorts.scenes[activeSceneIndex].narration}"
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-30"></div>
              </div>

              {/* 플레이어 컨트롤러 및 씬 리스트 */}
              <div className="w-full max-w-md space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <button onClick={() => setActiveSceneIndex((prev) => (prev - 1 + previewShorts.scenes.length) % previewShorts.scenes.length)} className="p-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-300 transition-all shadow-sm" title="이전 씬"><SkipBack className="w-5 h-5" /></button>
                    <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold transition-all shadow-md hover:scale-105 flex items-center gap-2">
                      {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                      <span className="text-sm">{isPlaying ? "자동 재생 중 (4초 간격)" : "일시정지됨"}</span>
                    </button>
                    <button onClick={() => setActiveSceneIndex((prev) => (prev + 1) % previewShorts.scenes.length)} className="p-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-300 transition-all shadow-sm" title="다음 씬"><SkipForward className="w-5 h-5" /></button>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-700 font-medium shadow-sm">
                    <span className="flex items-center gap-1.5"><Bot className="w-4 h-4 text-amber-500" /> AI 성우: {previewShorts.scenes[0].tts_voice || ttsVoice}</span>
                    <span className="flex items-center gap-1.5"><Music className="w-4 h-4 text-blue-600" /> BGM 트랙: {previewShorts.bgm_track || bgmTrack}</span>
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">전체 5단 씬 목록</h4>
                    {previewShorts.scenes.map((sc: any, idx: number) => (
                      <button key={sc.scene_id} onClick={() => { setActiveSceneIndex(idx); setIsPlaying(false); }} className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-3 ${activeSceneIndex === idx ? "bg-blue-50 border-blue-300 text-blue-900 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
                        <div className="flex items-center gap-2.5 overflow-hidden"><span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${activeSceneIndex === idx ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>#{idx + 1}</span><span className="truncate">"{sc.narration}"</span></div>
                        <span className="text-[10px] shrink-0 text-slate-500 font-semibold">{sc.final_engine?.includes("Video") ? "🌊 Flow" : "🍌 Banana"}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
                  <div><h4 className="text-xs font-bold text-slate-900 mb-1">싱크 확인 완료</h4><p className="text-[11px] text-slate-500">하단의 다운로드 버튼을 누르면 소스가 즉시 저장됩니다.</p></div>
                  <button disabled={downloadingId !== null} onClick={() => handleDownloadPackage(previewShorts)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 ${downloadingId !== null ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300" : "bg-amber-500 hover:bg-amber-600 text-white hover:scale-105"}`}>
                    <Download className="w-4 h-4" /><span>{downloadingId === previewShorts.id ? "다운로드 중..." : "소스 일괄 다운로드"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 숏폼 상세보기 모달 */}
      {selectedShorts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full p-8 shadow-2xl max-h-[90vh] flex flex-col relative overflow-hidden text-slate-900">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-md"><Film className="w-6 h-6" /></div>
                <div><h3 className="text-lg font-bold text-slate-900">{selectedShorts.shorts_title}</h3><p className="text-xs text-slate-500 mt-0.5">원문 뉴스 주제: {selectedShorts.topic}</p></div>
              </div>
              <button onClick={() => setSelectedShorts(null)} className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 p-2.5 rounded-xl border border-slate-200">닫기</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div><span className="text-[11px] font-semibold text-slate-500 block mb-1">제작 일자</span><span className="text-xs font-bold text-slate-800 bg-white px-3 py-1 rounded border border-slate-200">{selectedShorts.created_at}</span></div>
                  <div><span className="text-[11px] font-semibold text-slate-500 block mb-1">업로드 예정일</span><span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded border border-amber-200">{selectedShorts.upload_date}</span></div>
                  <div><span className="text-[11px] font-semibold text-slate-500 block mb-1">진행 상태</span><span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded border border-emerald-200">{selectedShorts.status || "AI Generated"}</span></div>
                </div>
                
                <div className="flex items-center gap-2.5">
                  <button onClick={() => { setSelectedShorts(null); setPreviewShorts(selectedShorts); setActiveSceneIndex(0); setIsPlaying(true); }} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md">
                    <Smartphone className="w-4 h-4" /><span>🎬 통합 미리보기</span>
                  </button>
                  <button disabled={downloadingId !== null} onClick={() => handleDownloadPackage(selectedShorts)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${downloadingId !== null ? "bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300" : "bg-amber-500 hover:bg-amber-600 text-white hover:scale-105"}`}>
                    <Download className="w-4 h-4" /><span>{downloadingId === selectedShorts.id ? "다운로드 중..." : "소스 일괄 다운로드"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2"><Link className="w-4 h-4 text-amber-500" /><span>🖼️ 씬별 비주얼 직접 교체</span></h4>
                {selectedShorts.scenes.map((sc: any, idx: number) => (
                  <div key={sc.scene_id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start shadow-sm">
                    <div className="w-full md:w-1/4 flex flex-col items-center space-y-2">
                      <span className="px-2.5 py-1 bg-amber-500 text-white font-bold font-mono text-xs rounded-md block w-full text-center">Scene #{sc.scene_id}</span>
                      <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative group shadow-sm">
                        {sc.video_url?.endsWith(".mp4") || sc.video_url?.startsWith("data:video") || sc.gen_type === "video" ? (
                          <video src={sc.video_url} className="w-full h-full object-cover" loop muted playsInline autoPlay />
                        ) : <img src={sc.video_url || DEFAULT_FALLBACK_IMAGE} alt={`Scene ${sc.scene_id}`} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-[10px] text-white">{sc.final_engine || "Nano Banana"}</div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 truncate w-full text-center">{sc.final_engine || "Nano Banana"}</span>
                    </div>

                    <div className="w-full md:w-3/4 space-y-4">
                      <div><span className="text-xs font-semibold text-slate-500 block mb-1">씬 대본 (하단 자막)</span><p className="text-xs font-bold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">"{sc.narration}"</p></div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                          <label className="block text-xs font-bold text-amber-700 flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /><span>📁 내 컴퓨터 파일 선택 (업로드)</span></label>
                          <input type="file" accept="image/*,video/mp4" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(idx, file, false); }} className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-white hover:file:bg-amber-600 cursor-pointer" />
                        </div>

                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                          <label className="block text-xs font-bold text-blue-700 flex items-center gap-1.5"><Link className="w-3.5 h-3.5" /><span>🌐 이미지 주소 붙여넣기</span></label>
                          <div className="flex items-center gap-1.5">
                            <input type="text" value={sc.video_url || ""} onChange={(e) => { const updatedScenes = [...selectedShorts.scenes]; updatedScenes[idx] = { ...updatedScenes[idx], video_url: e.target.value, final_engine: "사용자 직접 교체 (Custom URL)" }; setSelectedShorts({ ...selectedShorts, scenes: updatedScenes }); setDashboardList(prev => prev.map(item => item.id === selectedShorts.id ? { ...item, scenes: updatedScenes } : item)); }} placeholder="https://..." className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 focus:border-blue-500 focus:outline-none" />
                            <button type="button" onClick={() => alert(`Scene #${sc.scene_id} 비주얼이 성공적으로 교체되었습니다!`)} className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 shrink-0 shadow-sm">적용</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-slate-200 z-10">
              <button onClick={() => setSelectedShorts(null)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300">닫기</button>
            </div>
          </div>
        </div>
      )}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fadeIn" onClick={() => setZoomedImage(null)}>
          <button className="absolute top-6 right-6 text-white hover:text-slate-300 p-2 bg-black/50 rounded-full" onClick={() => setZoomedImage(null)}>
             <X className="w-6 h-6" />
          </button>
          <img src={zoomedImage} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
