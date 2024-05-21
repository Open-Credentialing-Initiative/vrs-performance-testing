import http from 'k6/http';
import { Trend, Counter } from 'k6/metrics';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const generateTrend = new Trend('req_duration_vp_generate');
const verifyTrend = new Trend('req_duration_vp_verify');
const generateCount = new Counter('req_count_vp_generate');
const verifyCount = new Counter('req_count_vp_verify');

const WALLET_HOST = __ENV.WALLET_HOST;
const VP_GENERATE_ENDPOINT = __ENV.VP_GENERATE_ENDPOINT;
const VP_VERIFY_ENDPOINT = __ENV.VP_VERIFY_ENDPOINT;

/**
 * Generates a DSCSAATP VP for the defined did with a random corrUUID
 * @param {string} did holder of the credential
 * @returns verifiable presentation
 */
export function generateVp(did) {
  const uuid = uuidv4();
  const generateResponse = http.post(
    `${WALLET_HOST}/${VP_GENERATE_ENDPOINT}`,
    JSON.stringify({
      corrUUID: uuid,
      holderDID: did,
      credentialType: 'DSCSAATPCredential'
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  generateTrend.add(generateResponse.timings.duration);
  generateCount.add(1);
  check(generateResponse, { 'vp generation status was 200': (r) => r.status === 200 });
  return generateResponse.json().verifiablePresentation;
}

/**
 * Verifies a given presentation with a defined verifier did
 * @param {string} verifiablePresentation vp to verify
 * @param {string} did verifier did which should check the vp
 */
export function verifyVp(verifiablePresentation, did) {
  const verifyResponse = http.post(
    `${WALLET_HOST}/${VP_VERIFY_ENDPOINT}`,
    JSON.stringify({
      verifiablePresentation: verifiablePresentation,
      verifierDID: did,
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  verifyTrend.add(verifyResponse.timings.duration);
  verifyCount.add(1);
  check(verifyResponse, { 'vp verification status was 200': (r) => r.status === 200 });
}
