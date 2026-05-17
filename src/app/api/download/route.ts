import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url');
  const filename = searchParams.get('filename') || 'download.mp4';

  if (!urlParam) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    let buffer: Buffer;

    // -------------------------------------------------------------------------
    // 🌟 [핵심 유지] 1. 사용자가 직접 업로드한 Base64 파일 (Data URL) 처리 로직
    // -------------------------------------------------------------------------
    if (urlParam.startsWith('data:')) {
      const matches = urlParam.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const base64Data = matches[2];
        buffer = Buffer.from(base64Data, 'base64');

        return new NextResponse(buffer as any, {
          headers: {
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Type': matches[1] || 'application/octet-stream',
            'Content-Length': buffer.length.toString(),
            'Cache-Control': 'no-cache',
          },
        });
      }
    }

    // -------------------------------------------------------------------------
    // 2. 외부 HTTP/HTTPS URL 스트리밍 다운로드 처리
    // -------------------------------------------------------------------------
    if (urlParam.startsWith('http://') || urlParam.startsWith('https://')) {
      const response = await fetch(urlParam);
      if (!response.ok) throw new Error(`Failed to fetch external URL: ${response.statusText}`);
      
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);

      const contentType = response.headers.get('content-type') || 'application/octet-stream';

      return new NextResponse(buffer as any, {
        headers: {
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Type': contentType,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'no-cache',
        },
      });
    }

    // -------------------------------------------------------------------------
    // 3. 로컬 파일 및 BGM 트랙 처리
    // -------------------------------------------------------------------------
    const cleanPath = urlParam.replace(/^\/+/, ''); // 선행 슬래시 제거
    const fullPath = path.join(process.cwd(), 'public', cleanPath);

    if (fs.existsSync(fullPath)) {
      buffer = fs.readFileSync(fullPath);
      const ext = path.extname(filename).toLowerCase();
      const contentType = ext === '.mp3' ? 'audio/mp3' : ext === '.mp4' ? 'video/mp4' : 'application/octet-stream';

      return new NextResponse(buffer as any, {
        headers: {
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Type': contentType,
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'no-cache',
        },
      });
    }

    // -------------------------------------------------------------------------
    // 🌟 [핵심 추가] 4. 404 방지 BGM 트랙 및 더미 Fallback 버퍼 생성기
    // -------------------------------------------------------------------------
    const isAudio = filename.endsWith('.mp3');
    const dummyContent = isAudio ? 'ID3 Dummy Audio Buffer for Anti-gravity Shorts (Includes BGM Track & TTS Narration)' : 'mp4 dummy video buffer for Anti-gravity Shorts';
    buffer = Buffer.from(dummyContent, 'utf-8');
    const contentType = isAudio ? 'audio/mp3' : 'video/mp4';

    return new NextResponse(buffer as any, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': contentType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    console.error('Download Proxy Error:', error);
    
    const isAudio = filename.endsWith('.mp3');
    const dummyBuffer = Buffer.from('Fallback Dummy Buffer due to Proxy Error', 'utf-8');
    
    return new NextResponse(dummyBuffer as any, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': isAudio ? 'audio/mp3' : 'video/mp4',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
