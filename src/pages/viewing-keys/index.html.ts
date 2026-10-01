// metadata
export const version = "0.14.3"
export const title = "Viewing Keys & Backups"
export const description =
  "What a STRK20 viewing key does, why every account needs a backup, and how to export it from Ready or Xverse"
export const githubLink = ""
export const githubLabel = ""

export const keywords = [
  "viewing key",
  "backup",
  "recovery",
  "Ready",
  "Xverse",
  "encryption",
  "ecdh",
  "stark curve",
  "masking",
  "auditor",
]

export const codes = []

const html = `<blockquote>
<p><strong>Back up your viewing key before holding meaningful shielded funds.</strong> Export
it separately for every account in Ready or Xverse and store it as carefully
as your seed phrase. One wallet can contain several accounts, and each account
has a different viewing key.</p>
</blockquote>
<h2 id="what-is-a-viewing-key">What is a viewing key?</h2>
<p>Every account registered with the privacy pool has a <strong>viewing keypair</strong>:</p>
<table>
<thead>
<tr>
<th>Key</th>
<th>Symbol</th>
<th>Who has it</th>
<th>Used for</th>
</tr>
</thead>
<tbody><tr>
<td>Private viewing key</td>
<td><code>k</code></td>
<td>The user only</td>
<td>Decrypting notes, deriving channel keys, nullifiers</td>
</tr>
<tr>
<td>Public viewing key</td>
<td><code>K</code></td>
<td>On-chain</td>
<td>Letting others encrypt notes and channels <em>to</em> you</td>
</tr>
</tbody></table>
<p><code>K = k·G</code> on the STARK curve. The public key is <strong>registered once</strong> via the
<code>SetViewingKey</code> action and treated as immutable - every channel ever opened to
you is derived from it, so it cannot change without breaking discovery.</p>
<p>The private viewing key is not your seed phrase, account private key, or wallet
password. Your wallet uses it to find and decrypt your shielded balances and to
construct private transactions. The Starknet account signature still authorizes
spending.</p>
<h2 id="why-do-i-need-to-back-it-up">Why do I need to back it up?</h2>
<p>Ready and Xverse normally manage the viewing key for you. That is convenient,
but it should not make the wallet your only recovery path. If the wallet loses
its copy or its recovery service becomes unavailable, your normal seed phrase
or account private key may not be enough on its own to reconstruct the viewing
key already registered for that account. Without the matching viewing key, you
cannot discover and use that account&#39;s shielded funds.</p>
<p>An exported backup removes that dependency. A compatible wallet or SDK can use
the viewing key to reconstruct the account&#39;s private state from encrypted
on-chain data; the account&#39;s normal signing authority is still required to move
funds.</p>
<table>
<thead>
<tr>
<th>If...</th>
<th>What happens</th>
</tr>
</thead>
<tbody><tr>
<td>You lose the viewing key</td>
<td>You may lose access to the account&#39;s shielded balances and private history</td>
</tr>
<tr>
<td>Someone copies it</td>
<td>They can read that account&#39;s private balances and past and future activity, but they cannot move its funds</td>
</tr>
<tr>
<td>You lose the seed phrase</td>
<td>The viewing key cannot replace it; it does not authorize account transactions</td>
</tr>
</tbody></table>
<p>Because the registered public viewing key is immutable, a leaked viewing key
cannot be rotated away for that account. Move to a new account if its privacy is
compromised.</p>
<h2 id="how-to-export-it">How to export it</h2>
<p>The paths and screenshots below reflect current Ready X and Xverse browser
wallets. Labels can move between releases, but the export remains account-specific.
Select the account that actually holds the shielded funds before you begin.</p>
<h3 id="ready-x">Ready X</h3>
<ol>
<li>Select the account you want to back up.</li>
<li>Open <strong>Settings</strong>, then select the account under <strong>Account settings</strong>.</li>
<li>Select <strong>Export viewing key</strong>.</li>
<li>Read the warning, enter your wallet password, and select <strong>Unlock</strong>.</li>
<li>Reveal and copy the viewing key. Record the complete value, then repeat these
steps for every other account you use with private tokens.</li>
</ol>
<p><img src="/images/viewing-keys/ready-export-menu.png" alt="Ready X account settings showing Export viewing key"></p>
<p><em>The export belongs only to the selected account. “Export private key” is a
different, spending-capable credential.</em></p>
<p><img src="/images/viewing-keys/ready-export-warning.png" alt="Ready X viewing-key export warning and password prompt"></p>
<p><em>Ready warns that a viewing key exposes private activity but cannot move funds.</em></p>
<h3 id="xverse">Xverse</h3>
<ol>
<li>Select the Starknet account you want to back up.</li>
<li>Open the header menu, then go to <strong>Settings → Advanced</strong>.</li>
<li>Select <strong>Export private viewing key</strong>.</li>
<li>Enter your wallet password and select <strong>Continue</strong>.</li>
<li>Copy the complete viewing key, then repeat these steps for every other
privacy-enabled Starknet account.</li>
</ol>
<p>If the export option is missing, confirm that you selected a Starknet account,
that private tokens are enabled for it, and that Xverse is up to date.</p>
<p><img src="/images/viewing-keys/xverse-export-viewing-key.png" alt="Xverse export private viewing key screen with the example key hidden"></p>
<p><em>The key is deliberately blurred in this guide. Never publish your own.</em></p>
<h2 id="how-to-store-the-backup">How to store the backup</h2>
<ul>
<li>Store it offline or in a trusted encrypted secret manager, with the same care
you use for a seed phrase.</li>
<li>Label it with the wallet, network, account name, and full public Starknet
address. The viewing key itself is account-specific; the address prevents
mixing up several backups.</li>
<li>Keep a second protected copy in a separate location and verify the full value
when you create the backup.</li>
<li>Never paste it into a dapp, block explorer, support ticket, chat, prompt, or
unencrypted cloud note. Do not save a screenshot of the revealed key.</li>
<li>Do not use a third-party website to “check” it. Verification means comparing
your protected copy with the value shown by the wallet.</li>
</ul>
<p>The wallet&#39;s auditor-encrypted on-chain copy is a compliance mechanism, not a
user recovery service. Keep your own backup.</p>
<h2 id="how-viewing-key-encryption-works">How viewing-key encryption works</h2>
<h2 id="symmetric-masking">Symmetric masking</h2>
<p>Inside a channel, data is hidden with cheap "hash-and-add" masking rather than
heavyweight ciphers. Each field gets its own <strong>domain-separated Poseidon hash</strong>
plus a per-use <strong>salt</strong>, so no mask is ever reused:</p>
<pre><code>enc_amount = (h(ENC_AMOUNT_TAG, channel_key, token, index, 0, salt) + amount) mod 2^128
enc_token  =  h(ENC_TOKEN_TAG,  channel_key, index, 0, salt) + token
</code></pre><p>Anyone holding the channel key recomputes the mask and subtracts it off.
Anyone without it sees values indistinguishable from random field elements.
The domain tags (<code>ENC_AMOUNT_TAG:V1</code>, <code>ENC_TOKEN_TAG:V1</code>, …) guarantee that a
mask derived for one purpose can never be replayed in another context.</p>
<h2 id="asymmetric-encryption-ecdh-with-ephemeral-keys">Asymmetric encryption: ECDH with ephemeral keys</h2>
<p>Symmetric masking needs a shared secret - the channel key. Establishing it uses
<strong>ECDH on the STARK curve</strong> with a fresh ephemeral key per channel:</p>
<pre><code>sender picks random r
publishes   rG            (ephemeral public key)
computes    shared = r·K  (recipient&#x27;s public viewing key)

enc_channel_key = h(ENC_CHANNEL_KEY_TAG, shared.x) + channel_key
enc_sender_addr = h(ENC_SENDER_ADDR_TAG, shared.x) + sender_addr
</code></pre><p>The recipient computes the same secret from the other side: <code>k·(rG) = r·K</code>.
An observer sees only <code>rG</code> and two masked values - they learn that <em>a</em> channel
was opened, not by whom or to whom.</p>
<h2 id="the-auditor-copy">The auditor copy</h2>
<p>At registration, the user&#39;s private viewing key <code>k</code> is also encrypted - with
the same ephemeral ECDH pattern - to the <strong>auditor&#39;s public key</strong> and stored
on-chain. This single escrowed ciphertext is what enables compliance: an
auditor under lawful process can recover <code>k</code> and decrypt that user&#39;s history,
while everyone else&#39;s data stays private. See
<a href="/compliance">Compliance &amp; Auditing</a>.</p>
<h2 id="why-open-notes-skip-masking">Why open notes skip masking</h2>
<p>An <strong>open note</strong> carries its amount in plaintext, using the protocol-reserved
salt. This is deliberate: when a DeFi interaction (say, an AMM swap) produces
an output amount that is only known at execution time, the client cannot mask
it in advance - the mask is part of the proven transaction, but the amount
isn&#39;t decided until the anonymizer contract runs on-chain. Open notes trade amount
privacy for that late binding; ownership and subsequent spends remain private.</p>
<h2 id="rule-of-thumb">Rule of thumb</h2>
<ul>
<li>Everything derivable from <code>k</code> + public on-chain data → readable by you.</li>
<li>Everything else → opaque Poseidon outputs and masked field elements.</li>
<li>Reading private state is not spending authority; an account signature is still
required to move funds.</li>
</ul>
<p>Next: where encrypted notes are filed and how recipients find them -
<a href="/channels-and-subchannels">Channels &amp; Note Discovery</a>.</p>
`

export default html
