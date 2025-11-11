import { NextResponse } from 'next/server';
import { generatePlan, type AgentInput } from '@/lib/agent';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AgentInput;
    if (!body.brandName || !body.brandDescription || !body.audience || !body.platforms?.length || !body.goals?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const plan = generatePlan(body);
    return NextResponse.json(plan);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
