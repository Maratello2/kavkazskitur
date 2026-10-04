import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { requireAdmin } from '@/lib/requireAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
  }
  return NextResponse.json({ success: true, message: 'Upload service active' });
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const formData = await request.formData();
    let fileEntries = formData.getAll('files');
    if (!fileEntries || fileEntries.length === 0) {
      fileEntries = formData.getAll('file');
    }
    if (!fileEntries || fileEntries.length === 0) {
      for (const [_, val] of formData.entries()) {
        if (typeof val === 'object' && val !== null && 'arrayBuffer' in val) {
          fileEntries.push(val);
        }
      }
    }

    if (!fileEntries || fileEntries.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'tours');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const urls: string[] = [];

    for (const entry of fileEntries) {
      if (typeof entry === 'string') continue;
      const file = entry as unknown as File;

      // Basic mime type check
      if (file.type && !file.type.startsWith('image/')) {
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Generate unique WebP filename: tour_{timestamp}_{random}.webp
      const rand = Math.random().toString(36).substring(2, 9);
      const filename = `tour_${Date.now()}_${rand}.webp`;
      const filePath = path.join(uploadDir, filename);

      await sharp(buffer)
        .rotate()
        .resize({
          width: 1920,
          height: 1280,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
          effort: 6,
        })
        .toFile(filePath);

      urls.push(`/uploads/tours/${filename}`);
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: 'No valid image files were processed' }, { status: 400 });
    }

    return NextResponse.json({ urls });
  } catch (err: any) {
    console.error('[Upload API] Processing error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while processing images' },
      { status: 500 }
    );
  }
}
