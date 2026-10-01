---
title: Viewing Keys & Backups
version: 0.14.3
description: What a STRK20 viewing key does, why every account needs a backup, and how to export it from Ready or Xverse
keywords:
  [
    viewing key,
    backup,
    recovery,
    Ready,
    Xverse,
    encryption,
    ecdh,
    stark curve,
    masking,
    auditor,
  ]
---

> **Back up your viewing key before holding meaningful shielded funds.** Export
> it separately for every account in Ready or Xverse and store it as carefully
> as your seed phrase. One wallet can contain several accounts, and each account
> has a different viewing key.

## What is a viewing key?

Every account registered with the privacy pool has a **viewing keypair**:

| Key                 | Symbol | Who has it    | Used for                                            |
| ------------------- | ------ | ------------- | --------------------------------------------------- |
| Private viewing key | `k`    | The user only | Decrypting notes, deriving channel keys, nullifiers |
| Public viewing key  | `K`    | On-chain      | Letting others encrypt notes and channels _to_ you  |

`K = k·G` on the STARK curve. The public key is **registered once** via the
`SetViewingKey` action and treated as immutable - every channel ever opened to
you is derived from it, so it cannot change without breaking discovery.

The private viewing key is not your seed phrase, account private key, or wallet
password. Your wallet uses it to find and decrypt your shielded balances and to
construct private transactions. The Starknet account signature still authorizes
spending.

## Why do I need to back it up?

Ready and Xverse normally manage the viewing key for you. That is convenient,
but it should not make the wallet your only recovery path. If the wallet loses
its copy or its recovery service becomes unavailable, your normal seed phrase
or account private key may not be enough on its own to reconstruct the viewing
key already registered for that account. Without the matching viewing key, you
cannot discover and use that account's shielded funds.

An exported backup removes that dependency. A compatible wallet or SDK can use
the viewing key to reconstruct the account's private state from encrypted
on-chain data; the account's normal signing authority is still required to move
funds.

| If...                    | What happens                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| You lose the viewing key | You may lose access to the account's shielded balances and private history                                 |
| Someone copies it        | They can read that account's private balances and past and future activity, but they cannot move its funds |
| You lose the seed phrase | The viewing key cannot replace it; it does not authorize account transactions                              |

Because the registered public viewing key is immutable, a leaked viewing key
cannot be rotated away for that account. Move to a new account if its privacy is
compromised.

## How to export it

The paths and screenshots below reflect current Ready X and Xverse browser
wallets. Labels can move between releases, but the export remains account-specific.
Select the account that actually holds the shielded funds before you begin.

### Ready X

1. Select the account you want to back up.
2. Open **Settings**, then select the account under **Account settings**.
3. Select **Export viewing key**.
4. Read the warning, enter your wallet password, and select **Unlock**.
5. Reveal and copy the viewing key. Record the complete value, then repeat these
   steps for every other account you use with private tokens.

![Ready X account settings showing Export viewing key](/images/viewing-keys/ready-export-menu.png)

_The export belongs only to the selected account. “Export private key” is a
different, spending-capable credential._

![Ready X viewing-key export warning and password prompt](/images/viewing-keys/ready-export-warning.png)

_Ready warns that a viewing key exposes private activity but cannot move funds._

### Xverse

1. Select the Starknet account you want to back up.
2. Open the header menu, then go to **Settings → Advanced**.
3. Select **Export private viewing key**.
4. Enter your wallet password and select **Continue**.
5. Copy the complete viewing key, then repeat these steps for every other
   privacy-enabled Starknet account.

If the export option is missing, confirm that you selected a Starknet account,
that private tokens are enabled for it, and that Xverse is up to date.

![Xverse export private viewing key screen with the example key hidden](/images/viewing-keys/xverse-export-viewing-key.png)

_The key is deliberately blurred in this guide. Never publish your own._

## How to store the backup

- Store it offline or in a trusted encrypted secret manager, with the same care
  you use for a seed phrase.
- Label it with the wallet, network, account name, and full public Starknet
  address. The viewing key itself is account-specific; the address prevents
  mixing up several backups.
- Keep a second protected copy in a separate location and verify the full value
  when you create the backup.
- Never paste it into a dapp, block explorer, support ticket, chat, prompt, or
  unencrypted cloud note. Do not save a screenshot of the revealed key.
- Do not use a third-party website to “check” it. Verification means comparing
  your protected copy with the value shown by the wallet.

The wallet's auditor-encrypted on-chain copy is a compliance mechanism, not a
user recovery service. Keep your own backup.

## How viewing-key encryption works

## Symmetric masking

Inside a channel, data is hidden with cheap "hash-and-add" masking rather than
heavyweight ciphers. Each field gets its own **domain-separated Poseidon hash**
plus a per-use **salt**, so no mask is ever reused:

```
enc_amount = (h(ENC_AMOUNT_TAG, channel_key, token, index, 0, salt) + amount) mod 2^128
enc_token  =  h(ENC_TOKEN_TAG,  channel_key, index, 0, salt) + token
```

Anyone holding the channel key recomputes the mask and subtracts it off.
Anyone without it sees values indistinguishable from random field elements.
The domain tags (`ENC_AMOUNT_TAG:V1`, `ENC_TOKEN_TAG:V1`, …) guarantee that a
mask derived for one purpose can never be replayed in another context.

## Asymmetric encryption: ECDH with ephemeral keys

Symmetric masking needs a shared secret - the channel key. Establishing it uses
**ECDH on the STARK curve** with a fresh ephemeral key per channel:

```
sender picks random r
publishes   rG            (ephemeral public key)
computes    shared = r·K  (recipient's public viewing key)

enc_channel_key = h(ENC_CHANNEL_KEY_TAG, shared.x) + channel_key
enc_sender_addr = h(ENC_SENDER_ADDR_TAG, shared.x) + sender_addr
```

The recipient computes the same secret from the other side: `k·(rG) = r·K`.
An observer sees only `rG` and two masked values - they learn that _a_ channel
was opened, not by whom or to whom.

## The auditor copy

At registration, the user's private viewing key `k` is also encrypted - with
the same ephemeral ECDH pattern - to the **auditor's public key** and stored
on-chain. This single escrowed ciphertext is what enables compliance: an
auditor under lawful process can recover `k` and decrypt that user's history,
while everyone else's data stays private. See
[Compliance & Auditing](/compliance).

## Why open notes skip masking

An **open note** carries its amount in plaintext, using the protocol-reserved
salt. This is deliberate: when a DeFi interaction (say, an AMM swap) produces
an output amount that is only known at execution time, the client cannot mask
it in advance - the mask is part of the proven transaction, but the amount
isn't decided until the anonymizer contract runs on-chain. Open notes trade amount
privacy for that late binding; ownership and subsequent spends remain private.

## Rule of thumb

- Everything derivable from `k` + public on-chain data → readable by you.
- Everything else → opaque Poseidon outputs and masked field elements.
- Reading private state is not spending authority; an account signature is still
  required to move funds.

Next: where encrypted notes are filed and how recipients find them -
[Channels & Note Discovery](/channels-and-subchannels).
