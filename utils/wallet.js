import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const WALLET_HOST = __ENV.WALLET_HOST;
const VP_GENERATE_ENDPOINT = __ENV.VP_GENERATE_ENDPOINT;
const VP_VERIFY_ENDPOINT = __ENV.VP_VERIFY_ENDPOINT;

/**
 * Generates a DSCSAATP VP for the defined did with a random corrUUID
 * @param {string} did holder of the credential
 * @returns verifiable presentation
 */
export function generateVp(did, authToken) {
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
        'Content-Type': 'application/json',
      }
    }
  );
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
        'Content-Type': 'application/json',
      }
    }
  );
  check(verifyResponse, { 'vp verification status was 200': (r) => r.status === 200 });
}
