import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Agar dashboard pe jaane ki koshish hai, toh client-side check pe depend karo
  // Middleware mein session check nahi karenge
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};