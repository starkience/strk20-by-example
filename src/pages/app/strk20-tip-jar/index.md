---
title: Tip Jar
version: 0.14.3
description: "Add STRK20 to an app that already exists: a public tip jar live on mainnet gains a private tipping path, with no change to its deployed contract."
githubLink: https://github.com/starkience/strk20-tipjar-example
githubLabel: strk20-tipjar-example
keywords:
  [
    tip jar,
    private transfer,
    shield,
    wallet api,
    existing app,
    unlinkability,
    private swap,
    agent skill,
  ]
---

Most privacy examples start from an empty directory. This one starts from an
app that is **already deployed and transacting on Starknet mainnet** - an
ordinary tip jar - and adds a private path beside the public one.

That is the case worth showing: you can add privacy to an app with existing
users, liquidity, and activity. Nothing migrates, and the deployed contract is
never touched.

[Live demo](https://strk20-tipjar.vercel.app) ·
[Repository](https://github.com/starkience/strk20-tipjar-example) ·
[Tutorial](https://github.com/starkience/strk20-tipjar-example/blob/main/TUTORIAL.md)

## The two paths

A tip jar has one on-chain action: tip the creator. The public path calls the
`TipJar` contract, which forwards the token and emits a `Tipped` event - so who
paid whom, how much, and when are all permanently visible.

The private path calls no contract at all:

1. The tipper **shields** tokens into the pool - a public deposit, made earlier
   and on its own.
2. The note **matures** (~10 blocks).
3. Optionally, a **private swap** converts any shielded token to STRK inside the
   pool.
4. The tipper sends a **private transfer** to the creator - no public leg.

Both paths deliver the same value. The private one leaves no public link
between tipper and creator.

## What it takes

The whole privacy feature is one call:

<pre><code>const actions: STRK20_ACTION[] = [
  { type: "transfer", token: strkAddress, amount, recipient },
]
const { transaction_hash } = await account.strk20InvokeTransaction(actions)
</code></pre>

No contract call, no event, no approve. The wallet holds the keys, finds the
notes, proves, and submits; the app describes intent and nothing else.

The `TipJar` contract is never modified, which the repository makes checkable
rather than asserted - `v1-public` and `v2-private` tag the before and after:

<pre><code>git diff --stat v1-public v2-private -- contracts/src/tipjar.cairo   # empty
</code></pre>

## Shield separately, on purpose

The single most important design decision, and the easiest to get wrong.

Bundling the shield into the same transaction as the private transfer is one
click and one fee - and it defeats the purpose. A deposit is a **public leg that
names the tipper**, so an observer seeing both in one transaction correlates the
two ends trivially. The fee gets paid and the link survives.

Shielding **earlier, as its own transaction**, is what actually breaks the link.
The extra transaction, the extra pool fee, and the maturity wait are the price
of unlinkability, not overhead to remove.

## Designing the UX

A private flow differs from a public one in ways the interface has to carry:

- **A shield is two prompts.** The ERC-20 `approve` must land before the deposit
  can be proven against it, so the wallet asks twice on a token's first shield.
  Say so in advance.
- **Notes mature.** ~10 blocks, after a shield _and_ after a swap. Show a
  countdown rather than letting a button fail silently.
- **A flat pool fee applies per operation.** Read it with `get_fee_amount`, and
  have any "MAX" shortcut reserve it, or the transaction fails after the user
  has already signed.
- **Private actions emit no events.** There is nothing for an activity feed to
  display, so say that explicitly - silence should not read as failure.
- **Read private state only on explicit user action.** Detect capability with
  `supportedWalletApi`, never with a balance call: every read is a consent
  prompt.

## Verified on mainnet

The creator's wallet received four private transfers totalling **42 STRK**,
while the jar's public counter stayed at **3 tips / 3 STRK** and its event wall
never moved.

One honest detail: the recipient _can_ see who paid them, since private
transfers run over a directional channel - which is what a tip jar wants. What
is hidden is that no third party can.

## Read next

- [Starknet Wallet API overview](/starknet-wallet-api/overview) - the route this
  app uses.
- [starknet.js](/starknet-wallet-api/starknet-js) - the `WalletAccountV6` wiring
  behind `strk20InvokeTransaction`.
- The repository's
  [TUTORIAL.md](https://github.com/starkience/strk20-tipjar-example/blob/main/TUTORIAL.md),
  which walks the whole integration and was produced with the
  [STRK20 integration agent skill](https://github.com/starkience/strk20-agent-skills).
