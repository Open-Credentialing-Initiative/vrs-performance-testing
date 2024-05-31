import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const generateRequesterTrend = new Trend('req_duration_requester_vp_generate');
const verifyRequesterTrend = new Trend('req_duration_requester_vp_verify');
const generateRequesterCount = new Counter('req_count_requester_vp_generate');
const verifyRequesterCount = new Counter('req_count_requester_vp_verify');
const generateResponderTrend = new Trend('req_duration_responder_vp_generate');
const verifyResponderTrend = new Trend('req_duration_responder_vp_verify');
const generateResponderCount = new Counter('req_count_responder_vp_generate');
const verifyResponderCount = new Counter('req_count_responder_vp_verify');

/**
 * Generates a DSCSAATP VP for the defined did with a random corrUUID
 * @param {string} did holder of the credential
 * @param {string} walletHost wallet host to call the vp generate endpoint
 * @param {string} vpGenerateEndpoint endpoint to generate the vp
 * @param {boolean} isRequester if the caller is the requester or the responder
 * @returns verifiable presentation
 */
export function generateVp(did, walletHost, vpGenerateEndpoint, isRequester = true) {
  const uuid = uuidv4();
  const generateResponse = http.post(
    `${walletHost}/${vpGenerateEndpoint}`,
    JSON.stringify({
      corrUUID: uuid,
      holderDID: did,
      credentialType: 'DSCSAATPCredential'
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer {token}'
      }
    }
  );
  if (isRequester) {
    generateRequesterTrend.add(generateResponse.timings.duration);
    generateRequesterCount.add(1);
  } else {
    generateResponderTrend.add(generateResponse.timings.duration);
    generateResponderCount.add(1);
  }
  check(generateResponse, { 'vp generation status was 200': (r) => r.status === 200 });
  return generateResponse.json().verifiablePresentation;
}

/**
 * Verifies a given presentation with a defined verifier did
 * @param {string} verifiablePresentation vp to verify
 * @param {string} did verifier did which should check the vp
 * @param {string} walletHost wallet host to call the vp verify endpoint
 * @param {string} vpVerifyEndpoint endpoint to verify the vp
 * @param {boolean} isRequester if the caller is the requester or the responder
 */
export function verifyVp(verifiablePresentation, did, walletHost, vpVerifyEndpoint, isRequester = true) {
  const verifyResponse = http.post(
    `${walletHost}/${vpVerifyEndpoint}`,
    JSON.stringify({
      verifiablePresentation: verifiablePresentation,
      verifierDID: did,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer {token}'
      }
    }
  );
  if (isRequester) {
    verifyRequesterTrend.add(verifyResponse.timings.duration);
    verifyRequesterCount.add(1);
  } else {
    verifyResponderTrend.add(verifyResponse.timings.duration);
    verifyResponderCount.add(1);
  }
  check(verifyResponse, { 'vp verification status was 200': (r) => r.status === 200 });
}
