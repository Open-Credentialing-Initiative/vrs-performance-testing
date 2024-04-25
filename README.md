# OCI VRS Performance Testing with k6

This repository contains k6 scripts for performance testing of the OCI VRS criteria between different providers.

## Introduction

[k6](https://k6.io/) is a modern load testing tool, building on Load Impact's years of experience in the load and performance testing industry. It provides a clean, approachable scripting API, local and cloud execution, and flexible configuration.

The script in this repository is specifically designed to test the OCI VRS criteria, ensuring that the system can handle the expected load and perform optimally under stress.


## Suppported VRS Flows with k6

This repository contains the flows for the following VRS provider flows:

### CARO standalone

This flow is used to test the CARO standalone provider flow. The script will simulate the following flows:

It mimics the exchange between a Tenant (Wholesaler/Dispenser) via 2 service providers which acting as the VRS system. The first service provider creates an ATP VP and transfers it to the second service provider. The second service provider then verifies the ATP VP and creates a new ATP VP, which is then transferred back to the first service provider for verification.

It checks the basic functionality of the CARO wallets and the VP verification process.

```mermaid
sequenceDiagram
    participant CARO (Tenant 1)
    participant CARO (VRS Service Provider 1)
    participant CARO (VRS Service Provider 2)
    participant CARO (Tenant 2)
    CARO (VRS Service Provider 1)->>CARO (Tenant 1): Create ATP VP
    CARO (VRS Service Provider 1)-->>CARO (VRS Service Provider 2): Transfer VP
    CARO (VRS Service Provider 2)->>CARO (Tenant 2): Verify ATP VP
    CARO (VRS Service Provider 2)->>CARO (Tenant 2): Create ATP VP
    CARO (VRS Service Provider 2)-->>CARO (VRS Service Provider 1): Transfer VP
    CARO (VRS Service Provider 1)->>CARO (Tenant 1): Verify ATP VP
```mermaid


### MOVILITAS

This flow uses the MOVILITAS VRS system to test the whole process of creating and verifying ATP VPs. The script will simulate the following flows:

```mermaid
sequenceDiagram
    participant CARO (VRS Service Provider 1)
    participant MOVILITAS
    participant CARO (VRS Service Provider 2)
    CARO (VRS Service Provider 1)->>CARO (VRS Service Provider 1): Create Requester ATP VP
    CARO (VRS Service Provider 1)-->>MOVILITAS: Transfer Requester VP
    MOVILITAS->>CARO (VRS Service Provider 2): Verify Requester VP
    MOVILITAS->>MOVILITAS: Verify PI and transfer request to responder
    MOVILITAS->>CARO (VRS Service Provider 2): Create Responder VP
    MOVILITAS-->>CARO (VRS Service Provider 1): Transfer Responder VP
    CARO (VRS Service Provider 1)->>CARO (VRS Service Provider 1): Verify Responder ATP VP
```mermaid


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
