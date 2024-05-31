import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { generateVp, verifyVp } from './utils/wallet.js'
import { Trend, Counter } from 'k6/metrics';

const REQUESTER_DID = __ENV.REQUESTER_DID;
const RESPONDER_DID = __ENV.RESPONDER_DID;
const REQUESTER_WALLET_HOST = __ENV.REQUESTER_WALLET_HOST;
const REQUESTER_VP_GENERATE_ENDPOINT = __ENV.REQUESTER_VP_GENERATE_ENDPOINT;
const REQUESTER_VP_VERIFY_ENDPOINT = __ENV.REQUESTER_VP_VERIFY_ENDPOINT;
const RESPONDER_WALLET_HOST = __ENV.RESPONDER_WALLET_HOST;
const RESPONDER_VP_GENERATE_ENDPOINT = __ENV.RESPONDER_VP_GENERATE_ENDPOINT;
const RESPONDER_VP_VERIFY_ENDPOINT = __ENV.RESPONDER_VP_VERIFY_ENDPOINT;

const roundtripDuration = new Trend('roundtrip_duration');
const requesterVrsDuration = new Trend('req_duration_requester_pi_verify');
const requesterVrsCount = new Counter('req_count_requester_pi_verify');
const responderVrsDuration = new Trend('req_duration_responder_pi_verify');
const responderVrsCount = new Counter('req_count_responder_pi_verify');
const roundtripCount = new Counter('roundtrip_count');

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 40 },
  ],
};

/**
 * Executes the Requester VRS endpoint
 * @param {*} vp The verifiable presentation to be sent to the Requester VRS endpoint
 */
function executeRequesterVRSEndpoint(vp) {
  // Here the Requester VRS Provider needs to implement the logic to do the PI exchange

  // you can use the following code to call the Requester VRS endpoint - replace the URL with the actual Requester VRS endpoint
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
  // requesterVrsDuration.add(vrsResponse.timings.duration);
  // requesterVrsCount.add(1);
  // check(vrsResponse, { 'requester vrs status was 200': (r) => r.status === 200 });
}

/**
 * Executes the Responder VRS endpoint
 * @param {*} vp The verifiable presentation to be sent to the Responder VRS endpoint
 */
function executeResponderVRSEndpoint(vp) {
  // Here the Responder VRS Provider needs to implement the logic to do the PI exchange

  // you can use the following code to call the Responder VRS endpoint - replace the URL with the actual Responder VRS endpoint
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
  // responderVrsDuration.add(vrsResponse.timings.duration);
  // responderVrsCount.add(1);
  // check(vrsResponse, { 'responder vrs status was 200': (r) => r.status === 200 });
}

export default function () {
  // VRS Round Trip
  const start = new Date().getTime();
  // 1. Generate a VP on the OCI compliant wallet endpoint
  const requesterVp = generateVp(REQUESTER_DID, REQUESTER_WALLET_HOST, REQUESTER_VP_GENERATE_ENDPOINT);

  // 2. Now the VP needs to get transferred via VRS to the responder system
  executeRequesterVRSEndpoint(requesterVp)

  // 3. The Responder VRS system now verifies the VP with the OCI compliant wallet endpoint
  const requesterVpVerification = verifyVp(requesterVp, RESPONDER_DID, REQUESTER_WALLET_HOST, REQUESTER_VP_VERIFY_ENDPOINT);

  // 4. The Responder VRS system now creates the responder VP with the OCI compliant wallet endpoint
  const responderVp = generateVp(RESPONDER_DID, RESPONDER_WALLET_HOST, RESPONDER_VP_GENERATE_ENDPOINT, false);

  // 5. Now the VP needs to get transferred via VRS to the Requester system back
  executeResponderVRSEndpoint(responderVp)

  // 6. The Requester VRS system now verifies the VP with the OCI compliant wallet endpoint
  const responderVpVerification = verifyVp(responderVp, RESPONDER_DID, RESPONDER_WALLET_HOST, RESPONDER_VP_VERIFY_ENDPOINT, false);

  const end = new Date().getTime();
  roundtripCount.add(1);
  roundtripDuration.add(end - start);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
  };
}

