import { generateVp, verifyVp } from './utils/wallet'

const REQUESTER_DID = __ENV.REQUESTER_DID;
const RESPONDER_DID = __ENV.RESPONDER_DID;

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 40 },
  ],
};

export default function () {
  // VRS Round Trip

  // 1. Generate a VP on the OCI compliant wallet endpoint
  const requesterVp = generateVp(REQUESTER_DID);

  // 2. Now the VP needs to get transferred via VRS to the responder system

  // 3. The Responder VRS system now verifies the VP with the OCI compliant wallet endpoint
  const requesterVpVerification = verifyVp(requesterVp, RESPONDER_DID);

  // 4. The Responder VRS system now creates the responder VP with the OCI compliant wallet endpoint
  const responderVp = generateVp(RESPONDER_DID);

  // 5. Now the VP needs to get transferred via VRS to the Requester system back

  // 6. The Requester VRS system now verifies the VP with the OCI compliant wallet endpoint
  const responderVpVerification = verifyVp(responderVp, RESPONDER_DID);

}

