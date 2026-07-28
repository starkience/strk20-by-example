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

const html = `<p>The <strong>Tip Jar</strong> is a worked example of the
<a href="/starknet-wallet-api/overview">Starknet Wallet API</a> route applied to an app that
already exists. It starts as an ordinary public tip jar deployed on Starknet
mainnet, then gains a private tipping path beside the public one. You can <strong>add
privacy to an app with existing users, liquidity, and activity</strong>, which is the
key advantage of STRK20 over building a separate private app.</p>
<p>Use it as a reference when you have a live app and want to see which files
change. The deployed contract is not one of them. The app itself runs at
<a href="https://strk20-tipjar.vercel.app">strk20-tipjar.vercel.app</a>.</p>
<h2 id="what-the-two-paths-look-like">What the two paths look like</h2>
<p>A tip jar has one onchain action: tip the creator.</p>
<p>The <strong>public path</strong> calls a <code>TipJar</code> contract, which forwards the token and emits
a <code>Tipped</code> event. Who paid whom, how much, and when are permanently visible.</p>
<p>The <strong>private path</strong> calls no contract at all:</p>
<ol>
<li><strong>Shield</strong> - the tipper deposits tokens into the pool, earlier and on its own.</li>
<li><strong>Wait</strong> - the resulting note matures after roughly 10 blocks.</li>
<li><strong>Swap</strong> (optional) - a private swap turns any shielded token into STRK inside
the pool.</li>
<li><strong>Private transfer</strong> - the tipper pays the creator, with no public leg.</li>
</ol>
<p>Both paths deliver the same value to the creator. The private one leaves no
public link between the two.</p>
<h2 id="how-it-works-in-code">How it works in code</h2>
<p>The private tip is a single action handed to the wallet:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> <span class="hljs-attr">actions</span>: <span class="hljs-title class_">STRK20</span>_ACTION[] = [
  { <span class="hljs-attr">type</span>: <span class="hljs-string">"transfer"</span>, <span class="hljs-attr">token</span>: strkAddress, amount, recipient },
]
<span class="hljs-keyword">const</span> { transaction_hash } = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">strk20InvokeTransaction</span>(actions)
</code></pre><p>There is no contract call, no event, and no approval step. The wallet holds the
keys, discovers the notes, generates the proof, and submits.</p>
<p>Shielding is the same call with a different action:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> <span class="hljs-attr">actions</span>: <span class="hljs-title class_">STRK20</span>_ACTION[] = [{ <span class="hljs-attr">type</span>: <span class="hljs-string">"deposit"</span>, <span class="hljs-attr">token</span>: tokenAddress, amount }]
</code></pre><p>Capability detection reads no private state:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> versions = <span class="hljs-keyword">await</span> walletV6.<span class="hljs-title function_">supportedWalletApi</span>(wallet)
<span class="hljs-keyword">const</span> supported = versions.<span class="hljs-title function_">some</span>(<span class="hljs-function">(<span class="hljs-params">v</span>) =&gt;</span> <span class="hljs-title function_">compareVersions</span>(v, <span class="hljs-string">"0.10.3"</span>) &gt;= <span class="hljs-number">0</span>)
</code></pre><h2 id="shield-separately-from-the-transfer">Shield separately from the transfer</h2>
<p>Bundling the shield into the same transaction as the private transfer costs one
click and one fee instead of two, and it defeats the purpose. A deposit is a
public leg that names the tipper, so an observer who sees both in one
transaction correlates the two ends.</p>
<p>Shielding as its own earlier transaction is what breaks the link, because the
later transfer carries no public leg at all. The extra transaction, the extra
pool fee, and the maturity wait are the cost of unlinkability.</p>
<p>A flow may still bundle them for UX reasons, but state what that costs so the
choice is deliberate.</p>
<h2 id="what-to-keep-in-mind">What to keep in mind</h2>
<p>A private flow behaves a little differently from a public one. A few things to
reflect in the UI:</p>
<ul>
<li><strong>Fresh notes mature in about 10 blocks</strong> — after a shield or a swap. Show the
short wait rather than letting the next action fail.</li>
<li><strong>Each private operation pays a flat pool fee.</strong> Read it from the pool with
<code>get_fee_amount</code> rather than hardcoding it, and reserve it in any "max"
shortcut so nothing fails after the user has signed.</li>
<li><strong>Private actions emit no events</strong> — which is the privacy working. An activity
feed has nothing to show, so say so rather than leaving the silence
unexplained.</li>
<li><strong>Read private balances only when the user asks for them.</strong> Detect capability
with <code>supportedWalletApi</code>; a balance read is a consent prompt, so keep it
behind an explicit action.</li>
<li><strong>Sender and recipient know each other; no one else does.</strong> A private transfer
runs over a channel between the two parties, so the creator sees who tipped
them — exactly what a tip jar wants — while no third party can link them or see
the amount.</li>
</ul>
<h2 id="verified-onchain">Verified onchain</h2>
<p>The creator&#39;s wallet received four private transfers totalling 42 STRK while the
jar&#39;s public counter stayed at 3 tips and 3 STRK. The <code>TipJar</code> contract was not
modified, which the repository leaves checkable through two tags:</p>
<pre><code class="language-sh">git diff --<span class="hljs-built_in">stat</span> v1-public v2-private -- contracts/src/tipjar.cairo
</code></pre><p>Full walkthrough, including the integration log and deployment record:
<a href="https://github.com/starkience/strk20-tipjar-example/blob/main/TUTORIAL.md">TUTORIAL.md</a>
(MIT).</p>
<h2 id="read-next">Read next</h2>
<ul>
<li><a href="/starknet-wallet-api/overview">Starknet Wallet API overview</a></li>
<li><a href="/starknet-wallet-api/starknet-js">starknet.js</a></li>
<li><a href="/agent-skill">Agent Skill</a></li>
<li><a href="/helpers/privacy-invoke">Anonymizer Contract Anatomy</a></li>
</ul>
`

export default html
