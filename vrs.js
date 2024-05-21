import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { generateVp, verifyVp } from './utils/wallet.js'
import { Trend, Counter } from 'k6/metrics';

const REQUESTER_DID = __ENV.REQUESTER_DID;
const RESPONDER_DID = __ENV.RESPONDER_DID;

const roundtripDuration = new Trend('roundtrip_duration');
const vrsDuration = new Trend('req_duration_pi_verify');
const vrsCount = new Counter('req_count_pi_verify');
const roundtripCount = new Counter('roundtrip_count');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 40 },
  ],
};

function executeVRSEndpoint(vp) {
  // Here the VRS Provider needs to implement the logic to do the PI exchange

  // you can use the following code to call the VRS endpoint - replace the URL with the actual VRS endpoint
  // and adjust the body and headers accordingly

  // const vrsResponse = http.post(
  //   `${VRS_ENDPOINT}`,
  //   JSON.stringify({
  //     verifiablePresentation: vp,
  //   }),
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     }
  //   }
  // );
  // vrsDuration.add(vrsResponse.timings.duration);
  // vrsCount.add(1);
  // check(vrsResponse, { 'vrs status was 200': (r) => r.status === 200 });
}

export default function () {
  // VRS Round Trip
  const start = new Date().getTime();
  // 1. Generate a VP on the OCI compliant wallet endpoint
  const requesterVp = generateVp(REQUESTER_DID);

  // 2. Now the VP needs to get transferred via VRS to the responder system
  executeVRSEndpoint(requesterVp)

  // 3. The Responder VRS system now verifies the VP with the OCI compliant wallet endpoint
  const requesterVpVerification = verifyVp(requesterVp, RESPONDER_DID);

  // 4. The Responder VRS system now creates the responder VP with the OCI compliant wallet endpoint
  const responderVp = generateVp(RESPONDER_DID);

  // 5. Now the VP needs to get transferred via VRS to the Requester system back
  executeVRSEndpoint(responderVp)

  // 6. The Requester VRS system now verifies the VP with the OCI compliant wallet endpoint
  const responderVpVerification = verifyVp(responderVp, RESPONDER_DID);

  const end = new Date().getTime();
  roundtripCount.add(1);
  roundtripDuration.add(end - start);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

