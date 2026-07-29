---
title: AVNU Private Swaps
version: 0.14.3
description: Add private swaps to a dapp with the AVNU SDK, without writing or deploying an anonymizer contract
keywords: [avnu, private swap, defi, wallet api]
---

Most private DeFi needs an app-specific
[anonymizer contract](/helpers/privacy-invoke). Swapping is the exception:
[AVNU](https://docs.avnu.fi/docs/privacy) has deployed its own executor, so a
dapp can offer private swaps with **no Cairo to write, review, or audit**.

## Install

```shell
npm install @avnu/avnu-sdk@^4.2.0 starknet@^10.4.0
```

## What you need

- A STRK20-capable wallet (Wallet API `>= 0.10.3`).
- The sell token **already shielded** — the swap moves value inside the pool, so
  it cannot shield for you.

## The call

```ts
import { executePrivateSwap, createStrk20WalletProver } from "@avnu/avnu-sdk"

const prover = createStrk20WalletProver(walletAccount)
const result = await executePrivateSwap(quote, { prover })
```

AVNU's paymaster relays the transaction, so the submitting address is not the
user's.

## When to use a helper instead

Reach for your own anonymizer contract when the action is not a swap — lending,
staking, or any app-specific flow. Those still need the pattern in
[Private DeFi End to End](/starknet-wallet-api/private-defi).

## Read next

- [Private DeFi End to End](/starknet-wallet-api/private-defi)
- [Swap Helper](/helpers/swap-helper) - the do-it-yourself route
