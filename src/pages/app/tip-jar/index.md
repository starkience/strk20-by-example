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

Most privacy examples start from an empty directory. This one starts from an
app that is **already deployed and transacting on Starknet mainnet** — an
ordinary tip jar — and adds a private path beside the public one.

That is the case worth showing. **You can add privacy to an app with existing
users, liquidity, and activity** — nothing migrates, and the deployed contract
is never touched.

**[Live demo](https://app-chi-three-39.vercel.app)** ·
**[Repository](https://github.com/starkience/strk20-tipjar-example)** ·
**[Full tutorial](https://github.com/starkience/strk20-tipjar-example/blob/main/TUTORIAL.md)**

## The two paths

A tip jar has one on-chain action: tip the creator. The public path calls a
`TipJar` contract, which forwards the token and emits a `Tipped` event — so who
paid whom, how much, and when are permanently visible.

The private path calls no contract at all:

1. The tipper **shields** tokens into the pool — a public deposit, made earlier
   and on its own.
2. The note **matures** (~10 blocks).
3. Optionally, a **private swap** turns any shielded token into STRK inside the
   pool.
4. The tipper sends a **private transfer** to the creator — no public leg.

Both paths deliver the same value to the creator. The private one leaves no
public link between the two of them.

## What it takes

The whole privacy feature is one call:

```ts
const actions: STRK20_ACTION[] = [
  { type: "transfer", token: strkAddress, amount, recipient },
]
const { transaction_hash } = await account.strk20InvokeTransaction(actions)
```

No contract call, no event, no approve. The wallet holds the keys, finds the
notes, proves, and submits. The app describes intent and nothing else.

Shielding is the same call with a different action:

```ts
const actions: STRK20_ACTION[] = [{ type: "deposit", token: tokenAddress, amount }]
```

The `TipJar` contract is never modified — and the repository makes that
checkable rather than asserted. Two tags bracket the integration:

```sh
git diff --stat v1-public v2-private -- contracts/src/tipjar.cairo   # empty
```

## Shield separately, on purpose

The single most important design decision here, and the easiest to get wrong.

Bundling the shield into the same transaction as the private transfer is one
click and one fee — and it defeats the purpose. A deposit is a **public leg that
names the tipper**, so an observer who sees both in one transaction correlates
the two ends trivially. The pool fee gets paid and the link survives.

Shielding **earlier, as its own transaction**, is what actually breaks the link,
because the later transfer carries no public leg at all. The extra transaction,
the extra pool fee and the maturity wait are the price of unlinkability, not
overhead to optimise away.

## Designing the UX

The code is the easy part. A private flow has properties a public one does not,
and each is something the user has to be able to see:

- **A shield is two prompts.** The ERC-20 `approve` must land on-chain before
  the deposit can be proven against it, so the wallet asks twice on a token's
  first shield. Say so before they click.
- **Notes mature.** Roughly 10 blocks, after a shield **and** after a swap,
  since a swap credits a new note too. Show a countdown rather than letting a
  button fail silently.
- **A flat pool fee applies per operation.** Read it with `get_fee_amount`
  rather than hardcoding it, and have any "MAX" shortcut reserve it — otherwise
  the transaction fails after the user has already signed.
- **Private actions emit no events.** There is nothing for an activity feed to
  display, so say that explicitly; silence should not read as failure.
- **Read private state only on explicit user action.** Detect capability with
  `supportedWalletApi`, never with a balance call — every read is a consent
  prompt, and an app that asks constantly trains people to click through
  prompts they should be reading.

## Verified on mainnet

The creator's wallet received four private transfers totalling **42 STRK**,
while the jar's public counter stayed at **3 tips / 3 STRK** and its event wall
never moved.

One honest detail: the recipient **can** see who paid them, because private
transfers run over a directional channel — which is exactly what a tip jar
wants. What is hidden is that no third party can.

## Read next

- [Starknet Wallet API overview](/starknet-wallet-api/overview) — the route this
  app uses.
- [starknet.js](/starknet-wallet-api/starknet-js) — the `WalletAccountV6` wiring
  behind `strk20InvokeTransaction`.
- [Agent Skill](/agent-skill) — the integration in this example was planned and
  built with it.
