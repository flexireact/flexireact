import { URL } from 'url';

/**
 * Handles API route requests
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @param {Object} route - Matched route object
 */
export async function handleApiRoute(req, res, route) {
  try {
    // Import the API handler with cache busting for hot reload
    const modulePath = `file://${route.filePath.replace(/\\/g, '/')}?t=${Date.now()}`;
    const handler = await import(modulePath);

    // Parse request body for POST/PUT/PATCH
    const body = await parseBody(req);
    
    // Parse query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = Object.fromEntries(url.searchParams);

    // Create enhanced request object
    const enhancedReq = {
      ...req,
      body,
      query,
      params: route.params,
      method: req.method
    };

    // Create enhanced response object
    const enhancedRes = createEnhancedResponse(res);

    // Check for method-specific handlers
    const method = req.method.toLowerCase();
    
    if (handler[method]) {
      // Method-specific handler (get, post, put, delete, etc.)
      await handler[method](enhancedReq, enhancedRes);
    } else if (handler.default) {
      // Default handler
      await handler.default(enhancedReq, enhancedRes);
    } else {
      // No handler found
      enhancedRes.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      }));
    }
  }
}

/**
 * Parses the request body
 */
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        if (contentType.includes('application/json') && body) {
          resolve(JSON.parse(body));
        } else if (contentType.includes('application/x-www-form-urlencoded') && body) {
          resolve(Object.fromEntries(new URLSearchParams(body)));
        } else {
          resolve(body || null);
        }
      } catch (error) {
        resolve(body);
      }
    });

    req.on('error', reject);
  });
}

/**
 * Creates an enhanced response object with helper methods
 */
function createEnhancedResponse(res) {
  const enhanced = {
    _res: res,
    _statusCode: 200,
    _headers: {},

    status(code) {
      this._statusCode = code;
      return this;
    },

    setHeader(name, value) {
      this._headers[name] = value;
      return this;
    },

    json(data) {
      this._headers['Content-Type'] = 'application/json';
      this._sendResponse(JSON.stringify(data));
    },

    send(data) {
      if (typeof data === 'object') {
        this.json(data);
      } else {
        this._headers['Content-Type'] = this._headers['Content-Type'] || 'text/plain';
        this._sendResponse(String(data));
      }
    },

    html(data) {
      this._headers['Content-Type'] = 'text/html';
      this._sendResponse(data);
    },

    redirect(url, statusCode = 302) {
      this._statusCode = statusCode;
      this._headers['Location'] = url;
      this._sendResponse('');
    },

    _sendResponse(body) {
      if (!this._res.headersSent) {
        this._res.writeHead(this._statusCode, this._headers);
        this._res.end(body);
      }
    }
  };

  return enhanced;
}
