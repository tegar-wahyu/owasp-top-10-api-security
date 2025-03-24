# 🛡️ OWASP Top 10 API Security Hands-On Tutorial

A practical, hands-on tutorial for mastering the OWASP Top 10 API Security vulnerabilities using Node.js. This repository contains simple real-world examples with both vulnerable code and secure solutions for each of the critical API security risks identified by OWASP.

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [OWASP Top 10 API Security Risks](#owasp-top-10-api-security-risks)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Prerequisites](#prerequisites)

## Overview

API security is crucial in today's interconnected digital landscape. This repository provides a hands-on approach to learning about the OWASP Top 10 API Security risks through practical Node.js examples. Each risk includes both problematic code demonstrating the vulnerability and solution code showing the proper implementation of security controls.

## Repository Structure

The repository is organized into two main parts:

```
/
├── Part-1/
│   ├── Risk-1-BOLA/
│   │   ├── problem.js    # Vulnerable implementation
│   │   └── solution.js   # Secure implementation
│   ├── Risk-2-BUA/
│   ├── Risk-3-BOPLA/
│   ├── Risk-4-URC/
│   ├── Risk-5-BFLA/
│   ├── owasp-top-10-api-security-part-1.postman_collection.json
│   ├── package.json
│   └── package-lock.json
└── Part-2/
```

Each risk folder contains:
- `problem.js`: An intentionally vulnerable implementation demonstrating the security risk
- `solution.js`: A secure implementation showing how to properly mitigate the risk

## OWASP Top 10 API Security Risks

### 1. Broken Object Level Authorization (BOLA)
**Risk-1-BOLA**: Occurs when an API fails to properly validate that the requesting user has permission to access or modify a specific resource. This allows attackers to access unauthorized resources by simply changing resource IDs in API requests.

### 2. Broken User Authentication (BUA)
**Risk-2-BUA**: Issues with authentication mechanisms that might allow attackers to impersonate legitimate users by exploiting weak implementation of authentication tokens, password recovery, or session management.

### 3. Broken Object Property Level Authorization (BOPLA)
**Risk-3-BOPLA**: Similar to BOLA, but at a more granular level. This occurs when users can access or modify object properties they shouldn't have permission to interact with.

### 4. Unrestricted Resource Consumption (URC)
**Risk-4-URC**: Lack of proper rate limiting and resource constraints, allowing attackers to overwhelm the API with numerous requests, potentially causing denial of service.

### 5. Broken Function Level Authorization (BFLA)
**Risk-5-BFLA**: Occurs when an API fails to restrict access to certain functionality that a user shouldn't have permission to use, typically related to administrative functions.

### 6. Unrestricted Access to Sensitive Business Flows
**API6:2023**: Occurs when APIs expose sensitive business processes without proper access controls, allowing attackers to manipulate or misuse critical workflows.

### 7. Server-Side Request Forgery (SSRF)
**API7:2023**: Happens when an API allows attackers to make unauthorized requests to internal or external systems by exploiting server-side request handling.

### 8. Security Misconfiguration
**API8:2023**: Involves improper configuration of API components, such as unnecessary HTTP methods, overly permissive CORS policies, or default credentials, leading to security vulnerabilities.

### 9. Improper Inventory Management
**API9:2023**: Occurs when APIs lack proper documentation or versioning, making it difficult to track and secure all endpoints, leading to exposure of deprecated or unprotected APIs.

### 10. Unsafe API Consumptions
**API10:2023**: Happens when APIs consume data from untrusted sources without proper validation or sanitization, leading to injection attacks or data leakage.

## Getting Started

To start working with this tutorial, clone the repository and install the dependencies:

```bash
git clone https://github.com/tegar-wahyu/owasp-top-10-api-security.git
cd owasp-top-10-api-security
npm install
```

## Usage

The project includes npm scripts to run each example:

```bash
# Run the vulnerable implementation for Risk 1 (BOLA)
npm run start:risk1

# Run the secure solution for Risk 1
npm run start:risk1-solution

# Similarly for other risks
npm run start:risk2
npm run start:risk2-solution
# ...and so on
```

For each risk:
1. First run the problem script to see how the vulnerability works:
   - Execute the vulnerable implementation (e.g., `npm run start:risk1`) to start the Node.js server with the insecure code.
   - This will launch an Express.js server on `http://localhost:3000` exposing the vulnerable API endpoint.
2. Test the vulnerability using the Postman collection:
   - Import the provided Postman collection (`owasp-top-10-api-security-part-1`) in Postman.
   - Select the relevant risk folder (e.g., `Risk-1-BOLA`) and send requests to the corresponding endpoint (e.g., `GET http://localhost:3000/records/2`).
   - Observe the "Vulnerable" response (e.g., HTTP 200 with unauthorized data access) to understand the security flaw.
3. Attempt to secure the endpoint yourself:
   - Based on your observations, modify the `problem.js` file in the respective risk folder (e.g., `Risk-1-BOLA/problem.js`) to implement a fix.
   - Restart the server (Ctrl+C, then `npm run start:risk1`) and re-run the Postman request.
   - Aim to achieve the "Safe" response (e.g., HTTP 403 Forbidden) as shown in the Postman collection, indicating the vulnerability is mitigated.
4. Verify your solution against the secure implementation:
   - Stop the server and run the provided secure version (e.g., `npm run start:risk1-solution`).
   - This will launch the server with the official secure implementation from `solution.js`.
   - Re-run the same Postman request and compare the response to your attempt. Check if your solution matches the "Safe" response (e.g., HTTP 403 Forbidden) and review `solution.js` to understand the recommended security controls.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Basic understanding of API concepts and Express.js
- Familiarity with web security fundamentals

---

&copy; 2025 GitHub &bull; [ISC License](https://opensource.org/license/isc-license-txt)