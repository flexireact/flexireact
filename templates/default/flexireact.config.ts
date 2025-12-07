export default {
  server: {
    port: 3000,
    host: 'localhost'
  },
  build: {
    target: 'es2022',
    minify: true,
    sourcemap: true
  },
  islands: {
    enabled: true
  },
  rsc: {
    enabled: true
  }
};
