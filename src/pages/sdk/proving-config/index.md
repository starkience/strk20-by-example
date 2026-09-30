---
title: Proving Configuration
version: 0.14.3
description: Configure ProvingServiceProofProvider, pick provingBlockId, and submit proofs correctly
keywords: [proving, provingBlockId, proofFacts, nonce, reorg, maturity]
githubLink: https://github.com/starkware-libs/starknet-privacy/blob/main/sdk/README.md
---

The proving provider sends your signed invocation to a proving service,
which executes it in a virtual Starknet environment and returns a STARK
proof. Three small conventions around it account for most submission
failures.

Snippets assume `transfers`, `account` and `provider` from
[Getting Started](/sdk/getting-started).

```typescript
import { constants } from "starknet"
import { ProvingServiceProofProvider } from "@starkware-libs/starknet-privacy-sdk"

const provingProvider = new ProvingServiceProofProvider(
  process.env.PROVING_SERVICE_URL!,
  constants.StarknetChainId.SN_SEPOLIA,
)
```

## `provingBlockId` - always `currentBlock - 10`

```typescript
const provingBlockId = (await provider.getBlockNumber()) - 10
const result = await transfers.build()./* ... */.execute({ provingBlockId })
```

The proof is generated against the state at `provingBlockId`. Three reasons to
back off from the head:

1. **Note maturity** - notes mature 10 blocks after creation. Proving at
   `currentBlock - 10` guarantees every unspent note in your registry has
   matured at the proof base.
2. **Reorg buffer** - a proof based on the chain head can be invalidated by
   an L2 reorg before the transaction lands. The contract allows proofs up to
   `proof_validity_blocks` old (default 450, ~15 min at 2s/block; it is
   governance-settable), so ten blocks back is a comfortable, still-fresh
   margin.
3. **Consistent state** - the SDK forwards `provingBlockId` to `discoverNotes`
   and `discoverChannels`, so discovery and proving see the same block. Without
   it the two can disagree, and a note selected from a newer state can fail to
   prove.

Omitting it works _most_ of the time - with intermittent failures on
insufficiently mature notes and worse proving-service cache hits. Just always
pass it. And when
chaining transactions (approve then deposit), re-fetch it after each
`waitForTransaction`.

## `proofDetails` - conditional, never empty

```typescript
const proofDetails = callAndProof.proof.proofFacts?.length
  ? { proofFacts: callAndProof.proof.proofFacts, proof: callAndProof.proof.data }
  : {}
const tx = await account.execute(callAndProof.call, { tip: 0n, ...proofDetails })
```

Some providers (the mock/no-validate ones used in development) return empty
proof facts. Passing `proofFacts: []` through to `account.execute` makes
starknet.js serialize an invalid v3 transaction - the keys must be **omitted
entirely**, hence the conditional spread. `tip: 0n` is mandatory for v3
transactions; forgetting it fails with the cryptic
`Cannot mix BigInt and other types`.

## Retry hygiene: `invalidateProofNonceCache()`

The proving provider caches the pool nonce. After any failed submission -
a revert, `INVALID_NONCE`, `Replacement transaction underpriced` - the cache
is stale, and retrying loops on proofs the chain keeps rejecting:

```typescript
transfers.invalidateProofNonceCache()
// ...then rebuild and resubmit
```

## Deposits are screened on every proving route

A custom or self-hosted backend can generate proofs without an Elliptic or FPI
credential. Registration, private transfers, withdrawals, and other operations
with no screened subject can therefore run entirely through a local prover.

A deposit is different: Elliptic evaluates the depositing address, an
FPI-managed attestation signer signs an allowed result, and the pool verifies
that signature onchain. A screening-enabled pool may apply the same requirement
to other configured subjects, such as an invoke or shadow-account address.
Self-hosting the prover does not bypass that policy; the proof flow must also
obtain the required attestation.

For most builders, the starting route for screening access is Starkscan rather
than requesting direct Elliptic partner credentials. Hosted wallet and prover
flows handle the screening round-trip for you. If you operate your own prover,
deploy the official
[proof interceptor](https://github.com/starkware-libs/starknet-privacy/tree/main/proof-interceptor)
alongside it and confirm the current Starkscan onboarding and screening
credentials before production. The public SDK does not contain a reusable
screening secret.

## Common failures

| Symptom                                | Cause                           | Fix                                 |
| -------------------------------------- | ------------------------------- | ----------------------------------- |
| Spend fails on a recently created note | `provingBlockId` not backed off | Use `currentBlock - 10`             |
| `Cannot mix BigInt and other types`    | Missing `tip`                   | Add `tip: 0n`                       |
| Revert with `INVALID_PROOF_FACTS`      | Passed `proofFacts: []`         | Conditional spread                  |
| `INVALID_NONCE` on retry               | Stale cached pool nonce         | `invalidateProofNonceCache()` first |

This is the last page of the series - head back to
[Getting Started](/sdk/getting-started) to revisit the wiring.
