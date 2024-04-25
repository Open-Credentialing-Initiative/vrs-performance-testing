# OCI VRS Performance Testing with k6

This repository contains k6 scripts for performance testing of the OCI VRS criteria between different providers.

## Introduction

[k6](https://k6.io/) is a modern load testing tool, building on Load Impact's years of experience in the load and performance testing industry. It provides a clean, approachable scripting API, local and cloud execution, and flexible configuration.

The script in this repository is specifically designed to test the OCI VRS criteria, ensuring that the system can handle the expected load and perform optimally under stress.

## Getting Started

1. Install k6 on your machine. Follow the instructions on the [official k6 installation guide](https://k6.io/docs/getting-started/installation/).

2. Clone this repository to your local machine.

3. Navigate to the directory containing the k6 script.

4. Run the script using the following command:

```bash
k6 run script.js
```

## Understanding the Results

The results of the k6 tests will provide valuable insights into how the OCI VRS criteria performs under different loads. You will be able to see the number of virtual users, the duration of the test, and various performance metrics such as response times, throughput, and error rates.