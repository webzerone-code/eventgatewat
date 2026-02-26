# Welcome to high concurrency gateway

-the project deals with high concurrency webhook and how u can handle multiple requests without blocking the event loop<br>
- also dealing with secure compunctions between the carrier and the data being processed throw the webhook<br>

#Installation<br>
rename .env.example to .env u will find the required data present<br>
the app assuming u dealing with multiple webhooks but what present is dhl carrier only u may need to change the value of "DHL" in the .env file to hold the secret u will use and also change it in test-burst.ts<br>
"DHL_HEADER" which the value caring the header key contain HMAC if changed please do change it in test-burst.ts<br>

- after making the file names run docker compose up -d --build<br>
- to check the dhl endpoint<br>
  {{url}}/gateway/dhl-webhook<br>
  the pay load example<br>

POST localhost:3000/gateway/dhl-webhook <br>
Accept: application/json<br>
Content-Type: application/json<br>
DHL_Header:b004142bae07a1f1b1e7e5542fac65b0d7551b4a0dbfdd98be65935c2a2ffe96<br>

{"event_id":"evt_dhl_1008","tracking_id":"JD01460000223357","status":"ARRIVED_AT_TRANSIT_FACILITY","location":"Dubai, AE","timestamp":"2024-03-20T14:30:00Z"}<br>

- testing the request i have done 2 tests one with 100 request and one with 1000 request to run the test at the root of the project run<br>
  npx ts-node src/test-burst.ts<br>
  the result for 1000 requests<br>
  --- TEST RESULTS ---<br>
  Total Time: 913ms<br>
  Avg Ingestion Latency: 0.91ms<br>
  Successful Handshakes (202): 1000<br>

- failed jobs<br>
  the jobs which is faild will be stored in redis for 24 h and can be checked from<br>
  run<br>
  docker exec -it fincart-redis redis-cli<br>
  inside the container run<br>
  SMEMBERS bull:event-orchestration:failed<br>

to retry the failed jobs run<br>
{{url}}/gateway/retry <br>

