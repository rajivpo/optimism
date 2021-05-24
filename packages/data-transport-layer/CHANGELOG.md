# data transport layer

## 0.4.0

### Minor Changes

- 07427ae: Update AddressSet event to speed search up a bit. Breaks AddressSet API.

### Patch Changes

- Updated dependencies [d2c7489]
- Updated dependencies [45032d2]
- Updated dependencies [7dc15c8]
- Updated dependencies [07427ae]
- Updated dependencies [138063b]
- Updated dependencies [8d477be]
- Updated dependencies [b496ff7]
- Updated dependencies [b9c5e81]
- Updated dependencies [5e5d4a1]
  - @eth-optimism/contracts@0.4.0

## 0.3.2

### Patch Changes

- f5185bb: Fix bug with replica syncing where contract creations would fail in replicas but pass in the sequencer. This was due to the change from a custom batched tx serialization to the batch serialzation for txs being regular RLP encoding
- Updated dependencies [7dd2f72]
  - @eth-optimism/contracts@0.3.2

## 0.3.1

### Patch Changes

- e28cec7: Fixes a bug where L2 synced transactions were not RLP encoded
- 96a586e: Migrate bcfg interface to core-utils
- fa4898a: Explicitly log error messages so that they do not show as empty objects
- Updated dependencies [96a586e]
- Updated dependencies [0c16805]
- Updated dependencies [775118a]
  - @eth-optimism/core-utils@0.4.3
  - @eth-optimism/common-ts@0.1.2
  - @eth-optimism/contracts@0.3.1

## 0.3.0

### Minor Changes

- b799caa: Updates to use RLP encoded transactions in batches for the `v0.3.0` release

### Patch Changes

- b799caa: Parse and index the value field in the data transport layer
- b799caa: Account for the off by one with regards to the l2geth block number and the CTC index
- b799caa: Remove legacy transaction deserialization to support RLP batch encoding
- b799caa: Prevent access of null value in L1 transaction deserialization
- Updated dependencies [b799caa]
- Updated dependencies [6132e7a]
- Updated dependencies [b799caa]
- Updated dependencies [b799caa]
- Updated dependencies [b799caa]
- Updated dependencies [20747fd]
- Updated dependencies [b799caa]
- Updated dependencies [b799caa]
  - @eth-optimism/contracts@0.3.0
  - @eth-optimism/core-utils@0.4.2

## 0.2.5

### Patch Changes

- 1d40586: Removed various unused dependencies
- ce7fa52: Add an additional enum for EthSign transactions as they now are batch submitted with 2 different enum values
- 575bcf6: add environment and network to dtl, move metric init to app from base-service
- Updated dependencies [1d40586]
- Updated dependencies [ce7fa52]
- Updated dependencies [575bcf6]
- Updated dependencies [6dc1877]
  - @eth-optimism/common-ts@0.1.1
  - @eth-optimism/contracts@0.2.10
  - @eth-optimism/core-utils@0.4.1

## 0.2.4

### Patch Changes

- 47e40a2: Update the config parsing so that it gives a better error message
- a0a0052: Parse and index the value field in the data transport layer
- 34ab776: Better error logging in the DTL
- e6350e2: add metrics to measure http endpoint latency
- 28dc442: move metrics, logger, and base-service to new common-ts package
- a0a0052: Prevent access of null value in L1 transaction deserialization
- Updated dependencies [28dc442]
- Updated dependencies [d2091d4]
- Updated dependencies [a0a0052]
- Updated dependencies [0ef3069]
  - @eth-optimism/common-ts@0.1.0
  - @eth-optimism/core-utils@0.4.0
  - @eth-optimism/contracts@0.2.9

## 0.2.3

### Patch Changes

- 6daa408: update hardhat versions so that solc is resolved correctly
- 01a2e7d: Clean up config parsing to match CLI argument configuration
- Updated dependencies [6daa408]
- Updated dependencies [ea4041b]
- Updated dependencies [f1f5bf2]
- Updated dependencies [dee74ef]
- Updated dependencies [9ec3ec0]
- Updated dependencies [d64b66d]
- Updated dependencies [5f376ee]
- Updated dependencies [eef1df4]
- Updated dependencies [a76cde5]
- Updated dependencies [e713cd0]
- Updated dependencies [572dcbc]
- Updated dependencies [6014ec0]
  - @eth-optimism/contracts@0.2.8
  - @eth-optimism/core-utils@0.3.2

## 0.2.2

### Patch Changes

- 6d31324: Update release tag for Sentry compatability

## 0.2.1

### Patch Changes

- a3dc553: Adds a release version to batch-submitter and data-transport-layer usage of Sentry
- 27f32ca: Allow the DTL to provide data from either L1 or L2, configurable via a query param sent by the client.
  The config option `default-backend` can be used to specify the backend to be
  used if the query param is not specified. This allows it to be backwards
  compatible with how the DTL was previously used.
- Updated dependencies [ce5d596]
- Updated dependencies [1a55f64]
- Updated dependencies [6e8fe1b]
- Updated dependencies [8d4aae4]
- Updated dependencies [c75a0fc]
- Updated dependencies [d4ee2d7]
- Updated dependencies [edb4346]
- Updated dependencies [5077441]
  - @eth-optimism/contracts@0.2.6
  - @eth-optimism/core-utils@0.3.1

## 0.2.0

### Minor Changes

- 91460d9: add Metrics and use in base-service, rename DTL services to avoid spaces

### Patch Changes

- 0497d7d: Re-organize event typings to core-utils
- Updated dependencies [91460d9]
- Updated dependencies [a0a7956]
- Updated dependencies [0497d7d]
  - @eth-optimism/core-utils@0.3.0
  - @eth-optimism/contracts@0.2.5

## 0.1.6

### Patch Changes

- 35b99b0: add Sentry to TypeScript services for error tracking
- Updated dependencies [35b99b0]
  - @eth-optimism/core-utils@0.2.3

## 0.1.5

### Patch Changes

- 01eaf2c: added extra logs to base-service / dtl to improve observability
- Updated dependencies [01eaf2c]
  - @eth-optimism/core-utils@0.2.2

## 0.1.4

### Patch Changes

- 3b00b7c: bump private package versions to try triggering a tag

## 0.1.3

### Patch Changes

- Updated dependencies [6cbc54d]
  - @eth-optimism/core-utils@0.2.0
  - @eth-optimism/contracts@0.2.2

## v0.1.2

- Fix bug in L2 sync

## v0.1.1

- Prioritize L2 synced API requests
- Stop syncing L2 at a certain height

## v0.1.0

- Sync From L1
- Sync From L2
- Initial Release
