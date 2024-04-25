import { setup as setupMovilitas, vrsRoundTrip as movilitasVrsRoundTrip } from './vrs-providers/movilitas.js';
import { setup as setupCaro, vrsRoundTrip as caroVrsRoundTrip } from './vrs-providers/caro.js';


export const options = {
  ext: {
    loadimpact: {
      projectID: 3644584,
    },
  },
  stages: [
    { duration: '30s', target: 5 },
    { duration: '30s', target: 10 },
    { duration: '30s', target: 20 },
    { duration: '30s', target: 40 },
  ],
};

export function setup() {
  switch(__ENV.TEST_SYSTEM) {
    case 'MOVILITAS':
      return setupMovilitas();
    case 'CARO':
      return setupCaro();
  }

}

export default function (setup) {
  switch(__ENV.TEST_SYSTEM) {
    case 'MOVILITAS':
      return movilitasVrsRoundTrip(setup);
    case 'CARO':
      return caroVrsRoundTrip(setup);
  }
}

