import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/api/:path*',
};

const middleware = async (req: NextRequest) => {
  const accessCode = req.headers.get('Access-Code') || '';
  const validAccessCodes = ['laciehello'];

  if (!validAccessCodes.includes(accessCode)) {
    console.log('Error: Invalid or missing access code.');
    return new NextResponse(JSON.stringify({ type: 'error', data: 'Please provide a valid access code.' }), {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  return NextResponse.next();
};

export default middleware;
