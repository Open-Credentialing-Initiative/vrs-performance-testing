# OCI VRS Performance Testing with k6

This repository contains k6 scripts for performance testing of the OCI VRS criteria between different providers.

## Introduction

[k6](https://k6.io/) is a modern load testing tool, building on Load Impact's years of experience in the load and performance testing industry. It provides a clean, approachable scripting API, local and cloud execution, and flexible configuration.

The script in this repository is specifically designed to test the OCI VRS criteria, ensuring that the system can handle the expected load and perform optimally under stress.

## VRS Flow

This repository contains the basic setup for testing out the VRS flow between different providers. The script will simulate the following flows:

```mermaid
sequenceDiagram
    participant Wallet Provider (Requester)
    participant VRS Provider 1
    participant VRS Provider 2
    participant Wallet Provider (Responder)
    VRS Provider 1->>Wallet Provider (Requester): Request ATP VP
    Wallet Provider (Requester)->>Wallet Provider (Requester): Fetch ATP VC and sign VP
    Wallet Provider (Requester)->>VRS Provider 1: Return ATP VP
    VRS Provider 1->>VRS Provider 1: Generate PI Verification Request Body
    VRS Provider 1->>VRS Provider 2: Transfer VP + PI Payload to responder VRS
    VRS Provider 2->>Wallet Provider (Responder): Send VP for verification
    Wallet Provider (Responder)->>Wallet Provider (Responder): Verify VP against OCI criteria
    Wallet Provider (Responder)->>VRS Provider 2: Return verification result
    VRS Provider 2->>VRS Provider 2: Verify PI Body
    VRS Provider 2->>Wallet Provider (Responder): Request Responder ATP VP
    Wallet Provider (Responder)->>Wallet Provider (Responder): Fetch ATP VC and sign VP
    Wallet Provider (Responder)->>VRS Provider 2: Return Responder ATP VP
    VRS Provider 2->>VRS Provider 2: Generate PI Verification Response Body
    VRS Provider 2->>VRS Provider 1: Transfer VP + PI Payload to requester VRS
    VRS Provider 1->>Wallet Provider (Requester): Send VP for verification
    Wallet Provider (Requester)->>Wallet Provider (Requester): Verify VP against OCI criteria
    Wallet Provider (Requester)->>VRS Provider 1: Return verification result
    VRS Provider 1->>VRS Provider 1: Verify PI Body
```

## Setup

To install k6 on your local machine, follow the instructions on the [k6 website](https://k6.io/docs/getting-started/installation/).

After installing k6 you need to adjust the code in the `vrs.js` file to match the correct URLs for the VRS providers. The following environment variables need to be set:

- `WALLET_HOST`: The URL wallet provider host
- `VP_GENERATE_ENDPOINT`: The path to the vp generation endpoint of the wallet host.
- `VP_VERIFY_ENDPOINT`: The path to the vp verification endpoint of the wallet host.
- `REQUESTER_DID`: The DID of the requester.
- `RESPONDER_DID`: The DID of the responder.

You can find the documented flow in the `vrs.js` file.

## Running the Tests

To run the tests, execute the following command:

```bash
k6 run vrs.js
```


## Load Testing Scenarios

When the k6 scripts are executed it will use the following specification to execute the tests:

- **VUs**: The number of virtual users that will be used to simulate the load on the system.
- **Duration**: The duration of the test in seconds.
- **Ramp-up time**: The time in seconds that will be used to ramp up the number of virtual users to the specified number.
- **Ramp-down time**: The time in seconds that will be used to ramp down the number of virtual users to 0.

The following stages are executed:

- **Stage 1**: 5 VUs for 30 seconds (ramp-up)
- **Stage 2**: 10 VUs for 30 seconds
- **Stage 3**: 20 VUs for 30 seconds
- **Stage 4**: 40 VUs for 30 seconds (ramp-down for 5 seconds)
