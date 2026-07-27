// metadata
export const version = "0.14.3"
export const title = "Tip Jar"
export const description =
  "Add privacy to an app that already has users, liquidity, and activity"
export const githubLink = "https://github.com/starkience/strk20-tipjar-example"
export const githubLabel = "strk20-tipjar-example"

export const keywords = [
  "tip jar",
  "existing app",
  "private transfer",
  "shield",
  "unlinkability",
  "wallet api",
  "private swap",
  "ux",
]

export const codes = []

const html = `<p>Most privacy examples start from an empty directory. This one starts from an
app that is <strong>already deployed and transacting on Starknet mainnet</strong> — an
ordinary tip jar — and adds a private path beside the public one.</p>
<p>That is the case worth showing. <strong>You can add privacy to an app with existing
users, liquidity, and activity</strong> — nothing migrates, and the deployed contract
is never touched.</p>
<p><strong><a href="https://app-chi-three-39.vercel.app">Live demo</a></strong> ·
<strong><a href="https://github.com/starkience/strk20-tipjar-example">Repository</a></strong> ·
<strong><a href="https://github.com/starkience/strk20-tipjar-example/blob/main/TUTORIAL.md">Full tutorial</a></strong></p>
<h2 id="the-two-paths">The two paths</h2>
<p>A tip jar has one on-chain action: tip the creator. The public path calls a
<code>TipJar</code> contract, which forwards the token and emits a <code>Tipped</code> event — so who
paid whom, how much, and when are permanently visible.</p>
<p>The private path calls no contract at all:</p>
<ol>
<li>The tipper <strong>shields</strong> tokens into the pool — a public deposit, made earlier
and on its own.</li>
<li>The note <strong>matures</strong> (~10 blocks).</li>
<li>Optionally, a <strong>private swap</strong> turns any shielded token into STRK inside the
pool.</li>
<li>The tipper sends a <strong>private transfer</strong> to the creator — no public leg.</li>
</ol>
<p>Both paths deliver the same value to the creator. The private one leaves no
public link between the two of them.</p>
<h2 id="what-it-takes">What it takes</h2>
<p>The whole privacy feature is one call:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> <span class="hljs-attr">actions</span>: <span class="hljs-title class_">STRK20</span>_ACTION[] = [
  { <span class="hljs-attr">type</span>: <span class="hljs-string">"transfer"</span>, <span class="hljs-attr">token</span>: strkAddress, amount, recipient },
]
<span class="hljs-keyword">const</span> { transaction_hash } = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">strk20InvokeTransaction</span>(actions)
</code></pre><p>No contract call, no event, no approve. The wallet holds the keys, finds the
notes, proves, and submits. The app describes intent and nothing else.</p>
<p>Shielding is the same call with a different action:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> <span class="hljs-attr">actions</span>: <span class="hljs-title class_">STRK20</span>_ACTION[] = [
  { <span class="hljs-attr">type</span>: <span class="hljs-string">"deposit"</span>, <span class="hljs-attr">token</span>: tokenAddress, amount },
]
</code></pre><p>The <code>TipJar</code> contract is never modified — and the repository makes that
checkable rather than asserted. Two tags bracket the integration:</p>
<pre><code class="language-sh">git diff --<span class="hljs-built_in">stat</span> v1-public v2-private -- contracts/src/tipjar.cairo   <span class="hljs-comment"># empty</span>
</code></pre><h2 id="shield-separately-on-purpose">Shield separately, on purpose</h2>
<p>The single most important design decision here, and the easiest to get wrong.</p>
<p>Bundling the shield into the same transaction as the private transfer is one
click and one fee — and it defeats the purpose. A deposit is a <strong>public leg that
names the tipper</strong>, so an observer who sees both in one transaction correlates
the two ends trivially. The pool fee gets paid and the link survives.</p>
<p>Shielding <strong>earlier, as its own transaction</strong>, is what actually breaks the link,
because the later transfer carries no public leg at all. The extra transaction,
the extra pool fee and the maturity wait are the price of unlinkability, not
overhead to optimise away.</p>
<h2 id="designing-the-ux">Designing the UX</h2>
<p>The code is the easy part. A private flow has properties a public one does not,
and each is something the user has to be able to see:</p>
<ul>
<li><strong>A shield is two prompts.</strong> The ERC-20 <code>approve</code> must land on-chain before
the deposit can be proven against it, so the wallet asks twice on a token&#39;s
first shield. Say so before they click.</li>
<li><strong>Notes mature.</strong> Roughly 10 blocks, after a shield <strong>and</strong> after a swap,
since a swap credits a new note too. Show a countdown rather than letting a
button fail silently.</li>
<li><strong>A flat pool fee applies per operation.</strong> Read it with <code>get_fee_amount</code>
rather than hardcoding it, and have any "MAX" shortcut reserve it — otherwise
the transaction fails after the user has already signed.</li>
<li><strong>Private actions emit no events.</strong> There is nothing for an activity feed to
display, so say that explicitly; silence should not read as failure.</li>
<li><strong>Read private state only on explicit user action.</strong> Detect capability with
<code>supportedWalletApi</code>, never with a balance call — every read is a consent
prompt, and an app that asks constantly trains people to click through
prompts they should be reading.</li>
</ul>
<h2 id="verified-on-mainnet">Verified on mainnet</h2>
<p>The creator&#39;s wallet received four private transfers totalling <strong>42 STRK</strong>,
while the jar&#39;s public counter stayed at <strong>3 tips / 3 STRK</strong> and its event wall
never moved.</p>
<p>One honest detail: the recipient <strong>can</strong> see who paid them, because private
transfers run over a directional channel — which is exactly what a tip jar
wants. What is hidden is that no third party can.</p>
<h2 id="read-next">Read next</h2>
<ul>
<li><a href="/starknet-wallet-api/overview">Starknet Wallet API overview</a> — the route this
app uses.</li>
<li><a href="/starknet-wallet-api/starknet-js">starknet.js</a> — the <code>WalletAccountV6</code> wiring
behind <code>strk20InvokeTransaction</code>.</li>
<li><a href="/agent-skill">Agent Skill</a> — the integration in this example was planned and
built with it.</li>
</ul>
`

export default html
