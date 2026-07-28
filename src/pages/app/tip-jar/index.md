---
title: Tip Jar
version: 0.14.3
description: Add privacy to an app that already has users, liquidity, and activity
keywords:
  [
    tip jar,
    existing app,
    private transfer,
    shield,
    unlinkability,
    wallet api,
    private swap,
    ux,
  ]
githubLink: https://github.com/starkience/strk20-tipjar-example
githubLabel: strk20-tipjar-example
---

The **Tip Jar** is a worked example of the
[Starknet Wallet API](/starknet-wallet-api/overview) route applied to an app that
already exists. It starts as an ordinary public tip jar deployed on Starknet
mainnet, then gains a private tipping path beside the public one. You can **add
privacy to an app with existing users, liquidity, and activity**, which is the
key advantage of STRK20 over building a separate private app.

Use it as a reference when you have a live app and want to see which files
change. The deployed contract is not one of them. The app itself runs at
[strk20-tipjar.vercel.app](https://strk20-tipjar.vercel.app).

## What the two paths look like

A tip jar has one onchain action: tip the creator.

The **public path** calls a `TipJar` contract, which forwards the token and emits
a `Tipped` event. Who paid whom, how much, and when are permanently visible.

The **private path** calls no contract at all:

1. **Shield** - the tipper deposits tokens into the pool, earlier and on its own.
2. **Wait** - the resulting note matures after roughly 10 blocks.
3. **Swap** (optional) - a private swap turns any shielded token into STRK inside
   the pool.
4. **Private transfer** - the tipper pays the creator, with no public leg.

Both paths deliver the same value to the creator. The private one leaves no
public link between the two.

## How it works in code

The private tip is a single action handed to the wallet:

```ts
const actions: STRK20_ACTION[] = [
  { type: "transfer", token: strkAddress, amount, recipient },
]
const { transaction_hash } = await account.strk20InvokeTransaction(actions)
```

There is no contract call, no event, and no approval step. The wallet holds the
keys, discovers the notes, generates the proof, and submits.

Shielding is the same call with a different action:

```ts
const actions: STRK20_ACTION[] = [{ type: "deposit", token: tokenAddress, amount }]
```

Capability detection reads no private state:

```ts
const versions = await walletV6.supportedWalletApi(wallet)
const supported = versions.some((v) => compareVersions(v, "0.10.3") >= 0)
```

## Shield separately from the transfer

Bundling the shield into the same transaction as the private transfer costs one
click and one fee instead of two, and it defeats the purpose. A deposit is a
public leg that names the tipper, so an observer who sees both in one
transaction correlates the two ends.

Shielding as its own earlier transaction is what breaks the link, because the
later transfer carries no public leg at all. The extra transaction, the extra
pool fee, and the maturity wait are the cost of unlinkability.

A flow may still bundle them for UX reasons, but state what that costs so the
choice is deliberate.

## What to keep in mind

A private flow behaves a little differently from a public one. A few things to
reflect in the UI:

- **Fresh notes mature in about 10 blocks** — after a shield or a swap. Show the
  short wait rather than letting the next action fail.
- **Each private operation pays a flat pool fee.** Read it from the pool with
  `get_fee_amount` rather than hardcoding it, and reserve it in any "max"
  shortcut so nothing fails after the user has signed.
- **Private actions emit no events** — which is the privacy working. An activity
  feed has nothing to show, so say so rather than leaving the silence
  unexplained.
- **Read private balances only when the user asks for them.** Detect capability
  with `supportedWalletApi`; a balance read is a consent prompt, so keep it
  behind an explicit action.
- **Sender and recipient know each other; no one else does.** A private transfer
  runs over a channel between the two parties, so the creator sees who tipped
  them — exactly what a tip jar wants — while no third party can link them or see
  the amount.

## Verified onchain

The creator's wallet received four private transfers totalling 42 STRK while the
jar's public counter stayed at 3 tips and 3 STRK. The `TipJar` contract was not
modified, which the repository leaves checkable through two tags:

```sh
git diff --stat v1-public v2-private -- contracts/src/tipjar.cairo
```

Full walkthrough, including the integration log and deployment record:
[TUTORIAL.md](https://github.com/starkience/strk20-tipjar-example/blob/main/TUTORIAL.md)
(MIT).

## Read next

- [Starknet Wallet API overview](/starknet-wallet-api/overview)
- [starknet.js](/starknet-wallet-api/starknet-js)
- [Agent Skill](/agent-skill)
- [Anonymizer Contract Anatomy](/helpers/privacy-invoke)
