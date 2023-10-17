import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

export const config = {
  matcher: '/api/:path*',
};

const ipCache = new Map<string, number>();

const ratelimit = {
  gnosis: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    ephemeralCache: ipCache,
  }),
  vision: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '120 m'),
    ephemeralCache: ipCache,
  }),
};

const checkAccessCode = (req: NextRequest) => {
  const accessCode = req.headers.get('Access-Code') || '';
  const validAccessCodes = process.env.AKASHA_ACCESS_CODES?.split(',') || [];
  return validAccessCodes.includes(accessCode) ? accessCode.split('-')[0] : '';
}

const checkIPRateLimit = async (req: NextRequest, tier: string) => {
  const ip = req.ip ?? '127.0.0.1';
  console.log(`IP: ${ip} | Tier: ${tier}`);
  if (tier === 'gnosis') {
    const { success } = await ratelimit.gnosis.limit(ip);
    return success;
  } else if (tier === 'vision') {
    const { success, limit, remaining } = await ratelimit.vision.limit(ip);
    console.log(`Success: ${success} | Limit: ${limit} | Remaining: ${remaining}`);
    return success;
  }
  return false;
}

const middleware = async (req: NextRequest) => {
  // Check for access code
  const tier = checkAccessCode(req);
  if (!tier) {
    console.log('Error: Invalid or missing access code.');
    return new NextResponse(JSON.stringify({ type: 'error', data: 'Please provide a valid access code.' }), {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  // Check for rate limit, or pass if celesia tier
  const passed = tier === 'celestia' ? true : await checkIPRateLimit(req, tier);
  if (!passed) {
    console.log('Error: Too many requests from this IP.');
    return new NextResponse(JSON.stringify({ type: 'error', data: 'Rate limit exceeded. Please try again later!' }), {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  return NextResponse.next();
};

export default middleware;
