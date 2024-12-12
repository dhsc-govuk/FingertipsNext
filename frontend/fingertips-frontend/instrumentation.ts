export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.MOCK_SERVER === 'true'
  ) {
    const { server } = await import('./mock/server/node');
    server.listen();
  }
}
