import { randomSeed } from 'k6';
import { getToken, generateVp, verifyVp } from '../utils/caro.js';

const VRS_CARO_1_CLIENT_ID = __ENV.VRS_1_CLIENT_ID;
const VRS_CARO_1_CLIENT_SECRET = __ENV.VRS_1_CLIENT_SECRET;
const TENANT_1_DID = __ENV.TENANT_1_DID;
const VRS_CARO_2_CLIENT_ID = __ENV.VRS_2_CLIENT_ID;
const VRS_CARO_2_CLIENT_SECRET = __ENV.VRS_2_CLIENT_SECRET;
const TENANT_2_DID = __ENV.TENANT_2_DID;
const VRS_CARO_3_CLIENT_ID = __ENV.VRS_3_CLIENT_ID;
const VRS_CARO_3_CLIENT_SECRET = __ENV.VRS_3_CLIENT_SECRET;
const TENANT_3_DID = __ENV.TENANT_3_DID;
const VRS_CARO_4_CLIENT_ID = __ENV.VRS_4_CLIENT_ID;
const VRS_CARO_4_CLIENT_SECRET = __ENV.VRS_4_CLIENT_SECRET;
const TENANT_4_DID = __ENV.TENANT_4_DID;
const VRS_CARO_5_CLIENT_ID = __ENV.VRS_5_CLIENT_ID;
const VRS_CARO_5_CLIENT_SECRET = __ENV.VRS_5_CLIENT_SECRET;
const TENANT_5_DID = __ENV.TENANT_5_DID;


export function vrsRoundTrip(authTokens) {
  randomSeed(1337);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
  generateVerifyRandomly(authTokens);
}

export function setup() {
  return [
    getToken(VRS_CARO_1_CLIENT_ID, VRS_CARO_1_CLIENT_SECRET),
    getToken(VRS_CARO_2_CLIENT_ID, VRS_CARO_2_CLIENT_SECRET),
    getToken(VRS_CARO_3_CLIENT_ID, VRS_CARO_3_CLIENT_SECRET),
    getToken(VRS_CARO_4_CLIENT_ID, VRS_CARO_4_CLIENT_SECRET),
    getToken(VRS_CARO_5_CLIENT_ID, VRS_CARO_5_CLIENT_SECRET),
  ]
}

function generateVerifyRandomly(authTokens) {
  const randomGenPair = spinBottle(authTokens);
  const verifiablePresentation = generateVp(randomGenPair.did, randomGenPair.token);
  let randomVerPair = spinBottle(authTokens);
  // make sure we don't verify with the same tenant
  while(randomVerPair.did === randomGenPair.did) {
    randomVerPair = spinBottle(authTokens);
  }
  verifyVp(verifiablePresentation, randomVerPair.did, randomVerPair.token);
}

function spinBottle(authTokens){
  const stop = Math.random();

  if (stop < 0.2) {
    return {
      did: TENANT_1_DID,
      token: authTokens[0],
    }
  } else if (stop < 0.4) {
    return {
      did: TENANT_2_DID,
      token: authTokens[1],
    }
  } else if (stop < 0.6) {
    return {
      did: TENANT_3_DID,
      token: authTokens[2],
    }
  } else if (stop < 0.8) {
    return {
      did: TENANT_4_DID,
      token: authTokens[3],
    }
  } else {
    return {
      did: TENANT_5_DID,
      token: authTokens[4],
    }
  }
}
