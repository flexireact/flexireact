export function get(req, res) {
  res.json({
    message: 'Hello from FlexiReact!',
    timestamp: new Date().toISOString()
  });
}
