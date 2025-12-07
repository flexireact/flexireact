/**
 * API Route: /api/hello
 * 
 * Example API endpoint demonstrating FlexiReact's API routes.
 */

interface ApiRequest {
  method: string;
  body?: Record<string, unknown>;
  query: Record<string, string>;
  params: Record<string, string>;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
}

export function get(req: ApiRequest, res: ApiResponse) {
  res.json({
    message: 'Hello from FlexiReact API! 🚀',
    timestamp: new Date().toISOString(),
    framework: 'FlexiReact v2.1',
    features: [
      'TypeScript',
      'Tailwind CSS',
      'SSR',
      'SSG',
      'Islands Architecture',
      'File-based Routing'
    ]
  });
}

export function post(req: ApiRequest, res: ApiResponse) {
  const { name } = (req.body || {}) as { name?: string };
  
  res.json({
    message: `Hello, ${name || 'World'}!`,
    timestamp: new Date().toISOString(),
    received: req.body
  });
}

export default function handler(req: ApiRequest, res: ApiResponse) {
  res.status(405).json({ 
    error: 'Method not allowed',
    allowedMethods: ['GET', 'POST']
  });
}
