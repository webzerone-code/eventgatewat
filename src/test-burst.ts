import { createHmac } from 'crypto';
import axios from 'axios';

const HOST = process.env.SERVICE_HOST || 'localhost';
const TARGET_URL = `http://${HOST}:3000/gateway/dhl-webhook`;
const SECRET = 'DHL_HMAC_SECRET_KEY';
const TOTAL_REQUESTS = 1000;
async function runLoadTest() {
  console.log(`Starting Load Test: ${TOTAL_REQUESTS} Concurrent Requests...`);
  const startTime = Date.now();

  // 1. Create a "Batch" of Promises
  const tasks = Array.from({ length: TOTAL_REQUESTS }).map((_, i) => {
    const payload = JSON.stringify({
      event_id: `evt_load_${Date.now()}_${i}`,
      tracking_id: `TRK-LOAD-1000-${i}`,
      status: 'IN_TRANSIT',
      location: 'New York, US',
      timestamp: new Date().toISOString(),
    });

    const signature = createHmac('sha256', SECRET)
      .update(payload)
      .digest('hex');

    // 3. Fire the Request
    return axios
      .post(TARGET_URL, payload, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          DHL_Header: signature,
        },
      })
      .catch((err) => err.response);
  });

  const responses = await Promise.all(tasks);
  const endTime = Date.now();

  // 5. Analyze Results
  const successCount = responses.filter((r) => r?.status === 202).length;
  const totalTime = endTime - startTime;
  const avgLatency = totalTime / TOTAL_REQUESTS;

  console.log(`\n📊 --- TEST RESULTS ---`);
  console.log(` Total Time: ${totalTime}ms`);
  console.log(`Avg Ingestion Latency: ${avgLatency.toFixed(2)}ms`);
  console.log(` Successful Handshakes (202): ${successCount}`);
  console.log(
    `\n Note: Check your Docker logs to watch the Workers process the 2s delay.`,
  );
}

runLoadTest();
