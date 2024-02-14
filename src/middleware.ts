import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// export const config = {
//   matcher: '/'
// };

const ipCache = new Map<string, number>();

const ratelimit = {
  gnosis: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    ephemeralCache: ipCache,
  }),
  vision: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '30 m'),
    ephemeralCache: ipCache,
  }),
  default: new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(10, '60 m'),
    ephemeralCache: ipCache,
  }),
};

const checkAccessCode = (req: NextRequest) => {
  const accessCode = req.headers.get('Access-Code') || '';
  const validAccessCodes = (process.env.AKASHA_ACCESS_CODES?.split(',') || []).concat("akasha-web-client");
  return validAccessCodes.includes(accessCode) ? accessCode.split('-')[0] : '';
}

const checkIPRateLimit = async (req: NextRequest, tier: string) => {
  const ip = req.ip ?? '127.0.0.1';
  if (tier === 'gnosis') {
    const { success } = await ratelimit.gnosis.limit(ip);
    return success;
  } else if (tier === 'vision') {
    const { success, limit, remaining } = await ratelimit.vision.limit(ip);
    return success;
  } else if (tier === 'akasha') {
    const { success, limit, remaining } = await ratelimit.default.limit(ip);
    return success;
  }
  return false;
}

const middleware = async (req: NextRequest) => {

  if (req.nextUrl.pathname.startsWith('/mock') && process.env["CURR_ENV"] === 'PROD') {
    return new NextResponse(JSON.stringify({ type: 'error', data: 'ERROR' }), {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  if (req.nextUrl.pathname.startsWith('/api') && process.env["CURR_ENV"] === 'PROD') {
    // Check for access code
    const tier = checkAccessCode(req);
    if (!tier) {
      return new NextResponse(JSON.stringify({ type: 'error', data: 'Please provide a valid access code.' }), {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }

    // Check for rate limit, or pass if celesia tier
    const passed = tier === 'celestia' ? true : await checkIPRateLimit(req, tier);
    if (!passed) {
      return new NextResponse(JSON.stringify({ type: 'error', data: 'Rate limit exceeded. Please try again later!' }), {
        headers: { 'Content-Type': 'text/event-stream' },
      });
    }
  }

  return NextResponse.next();
};

export default middleware;
