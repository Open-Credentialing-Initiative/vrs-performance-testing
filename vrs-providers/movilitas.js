import { generateVp, getToken, verifyVp } from "../utils/caro.js";
import http from 'k6/http';
import { check } from 'k6';

const MOVILITAS_VRS_CARO_CLIENT_ID = __ENV.MOVILITAS_VRS_CARO_CLIENT_ID;
const MOVILITAS_VRS_CARO_CLIENT_SECRET = __ENV.MOVILITAS_VRS_CARO_CLIENT_SECRET;
const MOVILITAS_ACCESS_TOKEN = __ENV.MOVILITAS_ACCESS_TOKEN;
const MOVILITAS_CHANNEL_KEY = __ENV.MOVILITAS_CHANNEL_KEY;
const MOVILITAS_CARO_TENANT_DID = __ENV.MOVILITAS_CARO_TENANT_DID;

function vrsWithMovilitas(verifiablePresentation) {
  const movilitasPayload = {
    atp_verifiable_presentation: verifiablePresentation,
    gln: "2996133448224",
    serial: "MVCSN3048",
    gtin: "00338300212169",
    batch: "MVC001",
    expiry_date: "260531",
    verification_request_contact_info: {
        email: "admin@movilitas.cloud",
        telephone: "+3221234567"
    },
    context: "dscsaSaleableReturn",
    control_possess_attribute: true,
    GS1US_version_value: "1.3.0"
  }
  const vrsResponse = http.post('https://api-staging.movilitas.cloud/v1/product_verification_dscsa/api/verify',
    JSON.stringify(movilitasPayload),
    {
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': MOVILITAS_ACCESS_TOKEN,
        'x-channel-key': MOVILITAS_CHANNEL_KEY,
      }
    }
  )
  check(vrsResponse, { 'movilitas call status was 200': (r) => r.status === 200 });
  return vrsResponse.json();
}

// set up auth tokens for the wallet api for Movilitas test
export function setup() {
  return getToken(MOVILITAS_VRS_CARO_CLIENT_ID, MOVILITAS_VRS_CARO_CLIENT_SECRET);
}

export function vrsRoundTrip(caroAuthToken) {
  // Movilitas Round trip is
  // 1. Generate a VP on CARO
  // 2. Send the VP to movilitas api
  // 2.1 Movilitas verifies the VP against CARO
  // 2.2 Movilitas does the routing and PI check
  // 2.3 Movilitas generates a VP of the responder on CARO
  // 3. Verify the returned VP from Movilitas responder on CARO

  // 1.
  const vp = generateVp(MOVILITAS_CARO_TENANT_DID, caroAuthToken);

  // 2.
  const responderVp = vrsWithMovilitas(vp);

  // 3.
  verifyVp(responderVp.data.responder_atp_verifiable_presentation, MOVILITAS_CARO_TENANT_DID, caroAuthToken)

}
