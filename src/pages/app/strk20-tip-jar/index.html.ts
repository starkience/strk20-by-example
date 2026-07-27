// metadata
export const version = "0.14.3"
export const title = "Tip Jar"
export const description =
  "Add STRK20 to an app that already exists: a public tip jar live on mainnet gains a private tipping path, with no change to its deployed contract."
export const githubLink = "https://github.com/starkience/strk20-tipjar-example"
export const githubLabel = "strk20-tipjar-example"

export const keywords = [
  "tip jar",
  "private transfer",
  "shield",
  "wallet api",
  "existing app",
  "unlinkability",
  "private swap",
  "agent skill",
]

export const codes = []

const html = `<p>Most privacy examples start from an empty directory. This one starts from an
app that is <strong>already deployed and transacting on Starknet mainnet</strong> - an
ordinary tip jar - and adds a private path beside the public one.</p>
<p>That is the case worth showing: you can add privacy to an app with existing
users, liquidity, and activity. Nothing migrates, and the deployed contract is
never touched.</p>
<p><a href="https://app-chi-three-39.vercel.app">Live demo</a> ·
<a href="https://github.com/starkience/strk20-tipjar-example">Repository</a> ·
<a href="https://github.com/starkience/strk20-tipjar-example/blob/main/TUTORIAL.md">Tutorial</a></p>
<h2>The two paths</h2>
<p>A tip jar has one on-chain action: tip the creator. The public path calls the
<code>TipJar</code> contract, which forwards the token and emits a <code>Tipped</code> event - so who
paid whom, how much, and when are all permanently visible.</p>
<p>The private path calls no contract at all:</p>
<ol>
<li>The tipper <strong>shields</strong> tokens into the pool - a public deposit, made earlier
and on its own.</li>
<li>The note <strong>matures</strong> (~10 blocks).</li>
<li>Optionally, a <strong>private swap</strong> converts any shielded token to STRK inside the
pool.</li>
<li>The tipper sends a <strong>private transfer</strong> to the creator - no public leg.</li>
</ol>
<p>Both paths deliver the same value. The private one leaves no public link
between tipper and creator.</p>
<h2>What it takes</h2>
<p>The whole privacy feature is one call:</p>
<pre><code>const actions: STRK20_ACTION[] = [
  { type: "transfer", token: strkAddress, amount, recipient },
]
const { transaction_hash } = await account.strk20InvokeTransaction(actions)
</code></pre>

<p>No contract call, no event, no approve. The wallet holds the keys, finds the
notes, proves, and submits; the app describes intent and nothing else.</p>
<p>The <code>TipJar</code> contract is never modified, which the repository makes checkable
rather than asserted - <code>v1-public</code> and <code>v2-private</code> tag the before and after:</p>
<pre><code>git diff --stat v1-public v2-private -- contracts/src/tipjar.cairo   # empty
</code></pre>

<h2>Shield separately, on purpose</h2>
<p>The single most important design decision, and the easiest to get wrong.</p>
<p>Bundling the shield into the same transaction as the private transfer is one
click and one fee - and it defeats the purpose. A deposit is a <strong>public leg that
names the tipper</strong>, so an observer seeing both in one transaction correlates the
two ends trivially. The fee gets paid and the link survives.</p>
<p>Shielding <strong>earlier, as its own transaction</strong>, is what actually breaks the link.
The extra transaction, the extra pool fee, and the maturity wait are the price
of unlinkability, not overhead to remove.</p>
<h2>Designing the UX</h2>
<p>A private flow differs from a public one in ways the interface has to carry:</p>
<ul>
<li><strong>A shield is two prompts.</strong> The ERC-20 <code>approve</code> must land before the deposit
can be proven against it, so the wallet asks twice on a token&#39;s first shield.
Say so in advance.</li>
<li><strong>Notes mature.</strong> ~10 blocks, after a shield <em>and</em> after a swap. Show a
countdown rather than letting a button fail silently.</li>
<li><strong>A flat pool fee applies per operation.</strong> Read it with <code>get_fee_amount</code>, and
have any "MAX" shortcut reserve it, or the transaction fails after the user
has already signed.</li>
<li><strong>Private actions emit no events.</strong> There is nothing for an activity feed to
display, so say that explicitly - silence should not read as failure.</li>
<li><strong>Read private state only on explicit user action.</strong> Detect capability with
<code>supportedWalletApi</code>, never with a balance call: every read is a consent
prompt.</li>
</ul>
<h2>Verified on mainnet</h2>
<p>The creator&#39;s wallet received four private transfers totalling <strong>42 STRK</strong>,
while the jar&#39;s public counter stayed at <strong>3 tips / 3 STRK</strong> and its event wall
never moved.</p>
<p>One honest detail: the recipient <em>can</em> see who paid them, since private
transfers run over a directional channel - which is what a tip jar wants. What
is hidden is that no third party can.</p>
<h2>Read next</h2>
<ul>
<li><a href="/starknet-wallet-api/overview">Starknet Wallet API overview</a> - the route this
app uses.</li>
<li><a href="/starknet-wallet-api/starknet-js">starknet.js</a> - the <code>WalletAccountV6</code> wiring
behind <code>strk20InvokeTransaction</code>.</li>
<li>The repository&#39;s
<a href="https://github.com/starkience/strk20-tipjar-example/blob/main/TUTORIAL.md">TUTORIAL.md</a>,
which walks the whole integration and was produced with the
<a href="https://github.com/starkience/strk20-agent-skills">STRK20 integration agent skill</a>.</li>
</ul>
`

export default html
