import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const CARO_AUTH_HOST = __ENV.AUTH_HOST;
const CARO_HOST = __ENV.CARO_HOST || 'https://api.caro.vc';

/**
 * Generates a DSCSAATP VP on CARO for the defined did with a random corrUUID
 * @param {string} did holder of the credential
 * @param {string} authToken auth token for CARO
 * @returns verifiable presentation
 */
export function generateVp(did, authToken) {
  const uuid = uuidv4();
  const generateResponse = http.post(
    `${CARO_HOST}/api/v1/verifiablePresentations/generate`,
    JSON.stringify({
      corrUUID: uuid,
      holderDID: did,
      credentialType: 'DSCSAATPCredential'
    }),
    {
      headers: {
        'Authorization': 'Bearer ' + authToken,
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
 * @param {string} authToken auth token for CARO
 */
export function verifyVp(verifiablePresentation, did, authToken) {
  const verifyResponse = http.post(
    `${CARO_HOST}/api/v1/verifiablePresentations/verify`,
    JSON.stringify({
      verifiablePresentation: verifiablePresentation,
      verifierDID: did,
    }),
    {
      headers: {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json',
      }
    }
  );
  check(verifyResponse, { 'vp verification status was 200': (r) => r.status === 200 });
}

/**
 * Obtains an auth token for a given service provider tenant on CARO
 * @param {string} vrsClientId
 * @param {string} vrsClientSecret
 * @returns obtained auth token for CARO
 */
export function getToken(vrsClientId, vrsClientSecret) {
  const tokenResponse = http.post(
    `https://${CARO_AUTH_HOST}/oauth/token`,
    JSON.stringify({
      grant_type: "client_credentials",
      client_id: vrsClientId,
      client_secret: vrsClientSecret
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  check(tokenResponse, { 'token status was 200': (r) => r.status === 200 });
  const response = tokenResponse.json();
  return response.access_token;
}
