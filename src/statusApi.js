const REQUEST_TIMEOUT_MS = 10_000;

async function fetchServerStatus() {
  const response = await fetch('https://status.y64.org/status', {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Status API responded with ${response.status}`);
  }
  return response.json();
}

module.exports = { fetchServerStatus };
