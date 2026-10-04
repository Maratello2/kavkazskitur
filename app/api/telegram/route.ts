import { NextResponse } from 'next/server';
import { getTelegramPosts } from '@/lib/data';

export const revalidate = 3600; // 1 hour edge cache

export async function GET() {
  try {
    const posts = await getTelegramPosts();
    return NextResponse.json(
      { success: true, posts },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error in /api/telegram:', error);
    return NextResponse.json({ success: false, posts: [] }, { status: 500 });
  }
}
