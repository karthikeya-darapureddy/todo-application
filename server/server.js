const app  = require('./app');
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║        TaskFlow API Server                   ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Running on  → http://localhost:${PORT}          ║`);
  console.log(`║  Health      → http://localhost:${PORT}/api/health║`);
  console.log(`║  Environment → ${process.env.NODE_ENV || 'development'}                    ║`);
  console.log('╚══════════════════════════════════════════════╝\n');
});

// Graceful shutdown
process.on('SIGTERM', () => { console.log('[Server] SIGTERM received. Shutting down...'); server.close(); });
process.on('SIGINT',  () => { console.log('[Server] SIGINT received. Shutting down...');  server.close(); process.exit(0); });
