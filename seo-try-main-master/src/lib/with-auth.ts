import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { requireAuth } from '@/lib/auth';

export function withAuth(handler: (req: NextRequest, userId: string) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const user = await requireAuth();
      return await handler(req, user.id);
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized: Please sign in') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      console.error('Auth error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  };
}
