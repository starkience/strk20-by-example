// metadata
export const version = "0.14.3"
export const title = "Builder Privacy Overview"
export const description =
  "Choose the right STRK20 integration path: Starknet Wallet API, anonymizer contracts, building privacy wallets, shadow accounts, or prover infrastructure."
export const githubLink = ""
export const githubLabel = ""

export const keywords = [
  "builder overview",
  "privacy stack",
  "starknet wallet api",
  "wallet api",
  "build privacy wallets",
  "privacy wallet sdk",
  "anonymizer contracts",
  "shadow accounts",
  "prover",
  "strk20",
]

export const codes = []

const html = `<p>STRK20 is a privacy pool plus a small set of integration surfaces. Start with
the narrowest surface that keeps user keys in the right place and only move to a
lower-level route when your product needs more control.</p>
<h2 id="quick-decision-guide">Quick decision guide</h2>
<table>
<thead>
<tr>
<th>If you want to...</th>
<th>Use...</th>
<th>Why</th>
</tr>
</thead>
<tbody><tr>
<td>Build a private dapp anywhere from private DeFi, private consumer apps, private games, etc.</td>
<td><a href="/helpers/privacy-invoke">Anonymizer contracts</a> and <a href="/starknet-wallet-api/overview">Starknet Wallet API</a></td>
<td>The wallet manages viewing keys, notes, proving, and submission; for DeFi, the pool calls your <code>privacy_invoke</code> adapter atomically, then credits the result back into private notes.</td>
</tr>
<tr>
<td>Build a privacy wallet on Starknet</td>
<td><a href="/sdk/getting-started">Build Privacy Wallets</a></td>
<td>Direct access to registration, channels, note discovery, transaction building, and proving configuration.</td>
</tr>
<tr>
<td>Operate proving infrastructure yourself</td>
<td>Prover backend</td>
<td>For wallets and infrastructure teams that need control over proof generation.</td>
</tr>
<tr>
<td>Hide the link between a user&#39;s main wallet and app activity</td>
<td><a href="/starknet-wallet-api/shadow-accounts">Shadow accounts</a></td>
<td>Persistent per-dapp identity available through Wallet API <code>0.10.4</code>, starknet.js <code>10.8.0</code>, and Privacy SDK <code>0.14.3-rc.8</code>.</td>
</tr>
<tr>
<td>Let users fund a private balance from an EVM wallet and withdraw it back to one</td>
<td><a href="https://github.com/starkware-libs/privacy-bridge">Privacy Bridge</a></td>
<td>Moves USDC between EVM chains and the pool over Circle CCTP, with its own inbound/outbound anonymizer contracts, so the two sides are not linked onchain.</td>
</tr>
</tbody></table>
<h2 id="core-surfaces">Core surfaces</h2>
<h3 id="strk20-pool">STRK20 pool</h3>
<p>The pool is the base contract layer. Deposits move public ERC-20 tokens into the
pool, private transfers spend encrypted notes inside the pool, and withdrawals
move tokens back to a public address. Movement inside the pool hides sender,
receiver, token, amount, and spent notes from public observers.</p>
<h3 id="starknet-wallet-api">Starknet Wallet API</h3>
<p>This is the recommended route for most <strong>private dapps</strong>. Your dapp asks the
user&#39;s privacy-enabled wallet to perform an action; the wallet handles private
state, proofs, and submission. A normal dapp should not receive the user&#39;s
viewing key or manage note discovery directly. See the
<a href="/starknet-wallet-api/overview">Starknet Wallet API overview</a>.</p>
<h3 id="anonymizer-contracts">Anonymizer contracts</h3>
<p>Anonymizer contracts, also called helper contracts, are app-specific Cairo
adapters for private DeFi. The pool withdraws tokens to the helper, calls its
<code>privacy_invoke</code> entry point, and the helper returns <code>OpenNoteDeposit</code>
instructions for whatever should be credited back into private notes. This is the
focus for <strong>core builders shipping private dapps</strong>. See
<a href="/helpers/privacy-invoke">Anonymizer Contract Anatomy</a>.</p>
<h3 id="privacy-bridge-evm-to-pool">Privacy Bridge (EVM to pool)</h3>
<p>Most users hold their USDC on an EVM chain, not on Starknet. The
<a href="https://github.com/starkware-libs/privacy-bridge">Privacy Bridge</a> is a
value-movement engine for exactly that gap: it takes USDC from an EVM wallet and
deposits it into the pool as a private note, and moves value back out to an EVM
chain, using Circle&#39;s CCTP for the cross-chain leg. Both directions run through
its own Cairo anonymizer contracts - <code>OutboundAnonymizer</code> on the way out,
<code>InboundAnonymizer</code> on the way back in - so the deposit side and the withdrawal
side cannot be linked onchain. All client-side key material is derived from a
single wallet signature; only the read-only viewing key may be persisted.</p>
<p>The repository is open source (Apache 2.0) and ships three parts: the
<code>bridge-anonymizers</code> Cairo contracts, the framework-agnostic
<code>@starkware-libs/starknet-privacy-bridge</code> TypeScript engine with optional React
hooks, and a demo web app. It is early and moving fast - read its README before
planning around it.</p>
<h3 id="build-privacy-wallets">Build Privacy Wallets</h3>
<p>The Build Privacy Wallets section is the lower-level SDK route for teams building
<strong>privacy wallets on Starknet</strong>, account-controlled backends, and advanced
integrators. Use it when you need to
manage registration, channels, note discovery, transaction construction, and
proving providers yourself. See <a href="/sdk/getting-started">Build Privacy Wallets</a>.</p>
<h3 id="shadow-accounts">Shadow accounts</h3>
<p>Shadow accounts are persistent, pseudonymous identities for account-based app
activity. Each <code>(user, dapp, nonce)</code> tuple maps to a deterministic address with
no public onchain link to the user&#39;s main wallet.</p>
<p>Both integration routes are available. Dapps can send
<code>shadow_account_invoke</code> through Wallet API <code>0.10.4</code> with starknet.js <code>10.8.0</code>;
wallets and advanced backends can use Privacy SDK <code>0.14.3-rc.8</code> through
<code>transfers.build().shadowAccounts(dappName)</code>. See
<a href="/starknet-wallet-api/shadow-accounts">Shadow Accounts through the Wallet API</a>
or <a href="/sdk/shadow-accounts">Shadow Accounts with the Privacy SDK</a>.</p>
<p>The shadow address, balances, calls, and positions are public. What stays
private is the link back to the user&#39;s main wallet. A shadow account has no
keys; only the <code>ShadowAccountAnonymizer</code> can execute through it.</p>
<h3 id="prover-backend">Prover backend</h3>
<p>Most dapps do not need to operate proving infrastructure. Wallets,
infrastructure teams, and advanced integrators may run their own prover when
they need operational control over proof generation. Running a prover locally
does not itself require screening credentials. A transaction that needs a
screening attestation - most notably a deposit - still has the depositing
address evaluated by Elliptic. An FPI-managed signer attests an allowed result,
and the pool verifies that signature onchain, so self-hosting does not bypass
the deployed screening policy.</p>
<h2 id="builder-rules-of-thumb">Builder rules of thumb</h2>
<ul>
<li>Use the Starknet Wallet API first for user-facing private dapps.</li>
<li>Use Build Privacy Wallets when you are building the wallet itself or need low-level SDK control.</li>
<li>Do not ask a normal dapp user for their viewing key.</li>
<li>Make per-account viewing-key export and recovery guidance easy to find before
users shield meaningful funds. See <a href="/viewing-keys">Viewing Keys &amp; Backups</a>.</li>
<li>For private DeFi integrations, expect both a Starknet Wallet API flow and an app-specific anonymizer contract.</li>
<li>Deposits are screened on every route - self-hosted proving does not bypass onchain screening.</li>
<li>Be explicit about what remains public: deposits, withdrawals, timing, and some app-side activity may still be visible.</li>
<li>Verify wallet support, API versions, contract addresses, and compliance assumptions before launch.</li>
</ul>
<h2 id="read-next">Read next</h2>
<ul>
<li><a href="/what-is-strk20">What is STRK20?</a></li>
<li><a href="/starknet-wallet-api/overview">Starknet Wallet API</a></li>
<li><a href="/helpers/privacy-invoke">Anonymizer Contract Anatomy</a></li>
<li><a href="/sdk/getting-started">Build Privacy Wallets</a></li>
</ul>
`

export default html
