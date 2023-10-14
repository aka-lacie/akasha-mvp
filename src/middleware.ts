import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: '/api/:path*',
};

const middleware = async (req: NextRequest) => {
  const accessCode = req.headers.get('x-access-code') || '';
  const validAccessCodes = ['1234'];
  // process.env.VALID_ACCESS_CODES.split(',');

  if (!validAccessCodes.includes(accessCode)) {
    console.log('Error: Invalid or missing access code.');
    return new NextResponse(`data: ${JSON.stringify({ type: 'error', data: 'Please provide a valid access code.' })}\n\n`, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  return NextResponse.next();
};

export default middleware;
