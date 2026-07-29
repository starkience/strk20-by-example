// metadata
export const version = "0.14.3"
export const title = "Private DeFi End to End"
export const description =
  "Connect an anonymizer contract to a dapp through the Starknet Wallet API using open notes and calldata placeholders"
export const githubLink = ""
export const githubLabel = ""

export const keywords = [
  "private defi",
  "anonymizer",
  "open note",
  "privacy_invoke",
  "wallet api",
]

export const codes = []

const html = `<p>The <a href="/helpers/privacy-invoke">anonymizer contract pages</a> cover the Cairo side.
This page covers the other half: how a dapp actually reaches that contract
through the <a href="/starknet-wallet-api/overview">Starknet Wallet API</a>, without ever
touching a viewing key.</p>
<p>Requires <code>starknet@^10.4.0</code> and a wallet supporting Wallet API <code>0.10.3</code>.</p>
<h2 id="the-two-actions">The two actions</h2>
<p>A private DeFi call is <strong>one</strong> STRK20 transaction carrying two actions:</p>
<ol>
<li>A <code>transfer</code> with the literal amount <code>"OPEN"</code> — this creates an <strong>open note</strong>,
the slot your helper&#39;s output gets credited into. Its amount is only known
after the helper runs on-chain.</li>
<li>An <code>invoke</code> naming your helper contract and its calldata.</li>
</ol>
<p>The wallet resolves two placeholders inside the invoke calldata:</p>
<table>
<thead>
<tr>
<th>Placeholder</th>
<th>Resolves to</th>
</tr>
</thead>
<tbody><tr>
<td><code>\${openNoteIds[N]}</code></td>
<td>The id of the Nth open note in this transaction</td>
</tr>
<tr>
<td><code>\${poolAddress}</code></td>
<td>The privacy pool contract address</td>
</tr>
</tbody></table>
<p>That indirection is what lets you reference a note that does not exist yet at
the time you build the calldata.</p>
<h2 id="a-private-swap">A private swap</h2>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { <span class="hljs-title class_">STRK20</span>_ACTION } <span class="hljs-keyword">from</span> <span class="hljs-string">"@starknet-io/types-js"</span>

<span class="hljs-keyword">const</span> <span class="hljs-attr">actions</span>: <span class="hljs-title class_">STRK20</span>_ACTION[] = [
  <span class="hljs-comment">// 1. Open the note the swap output will be credited into.</span>
  { <span class="hljs-attr">type</span>: <span class="hljs-string">"transfer"</span>, <span class="hljs-attr">token</span>: tokenOut, <span class="hljs-attr">amount</span>: <span class="hljs-string">"OPEN"</span>, <span class="hljs-attr">recipient</span>: userAddress },

  <span class="hljs-comment">// 2. Call the helper. \${openNoteIds[0]} is the note opened above.</span>
  {
    <span class="hljs-attr">type</span>: <span class="hljs-string">"invoke"</span>,
    <span class="hljs-attr">contract</span>: swapHelperAddress,
    <span class="hljs-attr">calldata</span>: [tokenIn, tokenOut, amountIn, <span class="hljs-string">"\${openNoteIds[0]}"</span>],
  },
]

<span class="hljs-keyword">const</span> { transaction_hash } = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">strk20InvokeTransaction</span>(actions)
</code></pre><p>The pool withdraws <code>amountIn</code> to your helper, calls its <code>privacy_invoke</code>
entry point, and credits the returned <code>OpenNoteDeposit</code> into the open note —
atomically. Observers see pool → helper → AMM → helper. They do not see who
initiated it.</p>
<p>Match the calldata order to your helper&#39;s <code>privacy_invoke</code> signature; the pool
deserializes it directly into that function&#39;s parameters.</p>
<h2 id="dry-run-first">Dry-run first</h2>
<p><code>strk20PrepareInvoke</code> builds and proves the same actions without submitting,
which is the cheapest way to catch a calldata-shape mistake:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> prepared = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">strk20PrepareInvoke</span>(actions, <span class="hljs-literal">true</span>) <span class="hljs-comment">// simulate</span>
</code></pre><h2 id="show-the-shielded-balance">Show the shielded balance</h2>
<p>Reading private balances is a wallet call too — no viewing key in your app:</p>
<pre><code class="language-ts"><span class="hljs-keyword">const</span> balances = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">strk20Balances</span>([tokenIn, tokenOut])
<span class="hljs-comment">// [{ token, balance }, ...]</span>
</code></pre><h2 id="what-stays-public">What stays public</h2>
<p>The helper&#39;s on-chain action and the amounts it moves are visible; the link back
to the user is not. Open-note amounts are plaintext by design — they are
measured at execution time. Deposits and withdrawals remain public legs.</p>
<h2 id="read-next">Read next</h2>
<ul>
<li><a href="/helpers/privacy-invoke">Anonymizer Contract Anatomy</a></li>
<li><a href="/helpers/swap-helper">Swap Helper</a></li>
</ul>
`

export default html
