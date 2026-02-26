# Welcome to high concurrency gateway

-the project deals with high concurrency webhook and how u can handle multiple requests without blocking the event loop
- also dealing with secure compunctions between the carrier and the data being processed throw the webhook

#Installation
rename .env.example to .env u will find the required data present
the app assuming u dealing with multiple webhooks but what present is dhl carrier only u may need to change the value of "DHL" in the .env file to hold the secret u will use and also change it in test-burst.ts
"DHL_HEADER" which the value caring the header key contain HMAC if changed please do change it in test-burst.ts

- after making the file names run docker compose up -d --build
- to check the dhl endpoint
  {{url}}/gateway/dhl-webhook
  the pay load example

POST localhost:3000/gateway/dhl-webhook
Accept: application/json
Content-Type: application/json
DHL_Header:b004142bae07a1f1b1e7e5542fac65b0d7551b4a0dbfdd98be65935c2a2ffe96

{"event_id":"evt_dhl_1008","tracking_id":"JD01460000223357","status":"ARRIVED_AT_TRANSIT_FACILITY","location":"Dubai, AE","timestamp":"2024-03-20T14:30:00Z"}

- testing the request i have done 2 tests one with 100 request and one with 1000 request to run the test at the root of the project run
  npx ts-node src/test-burst.ts
  the result for 1000 requests
  --- TEST RESULTS ---
  Total Time: 913ms
  Avg Ingestion Latency: 0.91ms
  Successful Handshakes (202): 1000

- failed jobs
  the jobs which is faild will be stored in redis for 24 h and can be checked from
  run
  docker exec -it fincart-redis redis-cli
  inside the container run
  SMEMBERS bull:event-orchestration:failed

to retry the failed jobs run
{{url}}/gateway/retry 

