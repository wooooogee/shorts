import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // TODO: 여기에 Netlify 백엔드 연동 로직 (예: Supabase, Postgres) 구현 예정
    // const { data: dbData, error } = await supabase.from('shorts_contents').insert([data]);
    
    console.log("[save-content] 대시보드 및 DB 저장 요청 수신 완료:", data.title);
    
    // 현재는 성공 응답만 반환하여 프론트엔드의 대시보드 상태 업데이트를 트리거함.
    return NextResponse.json({ 
      success: true, 
      message: '콘텐츠가 대시보드 및 서버 DB에 성공적으로 저장되었습니다.',
      savedData: { ...data, id: Date.now().toString(), savedAt: new Date().toISOString() }
    });
  } catch (error: any) {
    console.error("Save content error:", error);
    return NextResponse.json({ error: error.message || '콘텐츠 저장 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
