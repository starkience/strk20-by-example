// metadata
export const version = "0.14.3"
export const title = "Shadow Accounts"
export const description =
  "Use persistent, pseudonymous per-dapp accounts through the Starknet Wallet API"
export const githubLink =
  "https://github.com/starknet-io/starknet.js/blob/develop/www/docs/guides/account/walletAccount.md"
export const githubLabel = "starknet.js guide"

export const keywords = [
  "shadow account",
  "shadow_account_invoke",
  "WalletAccountV6",
  "commitment",
  "collect policy",
  "pseudonymous account",
]

export const codes = []

const html = `<p>A <strong>shadow account</strong> is a persistent, pseudonymous identity for one user and
one dapp. It lets a protocol recognize a returning user and hold positions over
time without exposing the public link to that user&#39;s main wallet.</p>
<p>A shadow account is not a wallet account: it has no keys and cannot sign. The
<code>ShadowAccountAnonymizer</code> deploys it lazily at a deterministic address and is
the only contract that can execute calls through it.</p>
<p>Requires <code>starknet@^10.8.0</code>, Wallet API <code>0.10.4</code>, and a connected wallet that
supports the STRK20 shadow-account methods.</p>
<h2 id="what-is-private">What is private</h2>
<p>The link to the user&#39;s main wallet is hidden. The shadow account itself is
public: its ERC-20 balances, calls, and protocol positions are visible onchain.
Use it for <strong>unlinkability and stable per-dapp identity</strong>, not to hide the
contents of the account.</p>
<p>Each <code>(user, dapp_name, nonce)</code> tuple resolves to a different address. Keep the
<code>dapp_name</code> stable, and use another nonce when the user wants a separate
identity for the same dapp.</p>
<h2 id="get-the-commitment">Get the commitment</h2>
<p><code>WalletAccountV6</code> asks the wallet to derive commitments from the user&#39;s private
state. No transaction is sent and the dapp never receives the viewing key.</p>
<pre><code class="language-typescript"><span class="hljs-comment">// Shared by every shadow account this user derives for this dapp.</span>
<span class="hljs-keyword">const</span> partial = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">strk20ShadowAccountCommitment</span>(<span class="hljs-string">"myDapp"</span>)

<span class="hljs-comment">// Selects the shadow account at nonce 0.</span>
<span class="hljs-keyword">const</span> commitment = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">strk20ShadowAccountCommitment</span>(<span class="hljs-string">"myDapp"</span>, <span class="hljs-string">"0x0"</span>)
</code></pre><p>Omitting the nonce returns the <strong>partial commitment</strong>. Passing <code>"0x0"</code> returns
the <strong>full commitment for nonce 0</strong>; the two calls are not equivalent.</p>
<h2 id="resolve-the-address">Resolve the address</h2>
<p>Use the anonymizer&#39;s <code>get_shadow_accounts</code> view when the dapp needs an address
before invoking - for example, to fund it from the shielded balance. The view
also reports whether each address has already been deployed. This snippet
assumes <code>anonymizer</code> is a starknet.js <code>Contract</code> created with the current
<code>ShadowAccountAnonymizerABI</code>.</p>
<pre><code class="language-typescript"><span class="hljs-keyword">import</span> { num } <span class="hljs-keyword">from</span> <span class="hljs-string">"starknet"</span>

<span class="hljs-keyword">const</span> shadowAccounts = <span class="hljs-keyword">await</span> anonymizer.<span class="hljs-title function_">get_shadow_accounts</span>(partial, <span class="hljs-number">0</span>, <span class="hljs-number">5</span>, <span class="hljs-literal">false</span>)

<span class="hljs-comment">// [{ nonce, address, is_deployed }, ...]</span>
<span class="hljs-keyword">const</span> shadowAccountAddress = num.<span class="hljs-title function_">toHex</span>(shadowAccounts[<span class="hljs-number">0</span>].<span class="hljs-property">address</span>)
</code></pre><p>The range is <code>[start, end)</code> and is limited to 1,024 nonces. Set the final
argument to <code>true</code> to stop at the first undeployed nonce and return only the
contiguous deployed prefix.</p>
<p>For offline derivation, use the Privacy SDK&#39;s <code>shadowAccountAddress</code> helper.
The current anonymizer implementation uses the fixed <code>PRIMER_CLASS_HASH</code>; do
not substitute the value returned by <code>get_shadow_account_class_hash</code>, because
that is the class installed <em>after</em> the deterministic address is chosen.</p>
<h2 id="invoke-through-the-shadow-account">Invoke through the shadow account</h2>
<p>The Wallet API action takes normal starknet.js <code>Call</code> objects. A common flow is:</p>
<ol>
<li>Withdraw an input token from the shielded balance to the shadow address.</li>
<li>Create one open note for each token that should return to the pool.</li>
<li>Run the calls through <code>shadow_account_invoke</code>.</li>
</ol>
<pre><code class="language-typescript"><span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { <span class="hljs-title class_">STRK20</span>_ACTION } <span class="hljs-keyword">from</span> <span class="hljs-string">"starknet"</span>

<span class="hljs-keyword">const</span> <span class="hljs-attr">actions</span>: <span class="hljs-title class_">STRK20</span>_ACTION[] = [
  {
    <span class="hljs-attr">type</span>: <span class="hljs-string">"withdraw"</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-variable constant_">STRK</span>,
    <span class="hljs-attr">amount</span>: <span class="hljs-string">"0x4563918244f40000"</span>,
    <span class="hljs-attr">recipient</span>: shadowAccountAddress,
  },
  {
    <span class="hljs-attr">type</span>: <span class="hljs-string">"transfer"</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-variable constant_">STRK</span>,
    <span class="hljs-attr">amount</span>: <span class="hljs-string">"OPEN"</span>,
    <span class="hljs-attr">recipient</span>: userAddress,
  },
  {
    <span class="hljs-attr">type</span>: <span class="hljs-string">"shadow_account_invoke"</span>,
    <span class="hljs-attr">dapp_name</span>: <span class="hljs-string">"myDapp"</span>,
    <span class="hljs-attr">nonce</span>: <span class="hljs-string">"0x0"</span>,
    <span class="hljs-attr">calls</span>: [stakingContract.<span class="hljs-title function_">populate</span>(<span class="hljs-string">"stake"</span>, { <span class="hljs-attr">amount</span>: <span class="hljs-number">1000n</span> })],
    <span class="hljs-attr">collect_policy</span>: { <span class="hljs-attr">type</span>: <span class="hljs-string">"all"</span> },
  },
]

<span class="hljs-keyword">const</span> { transaction_hash } = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">strk20InvokeTransaction</span>(actions)
</code></pre><p>The exported
<a href="https://starknet-js.com/docs/API/type-aliases/STRK20_SHADOW_ACCOUNT_INVOKE_ACTION/"><code>STRK20_SHADOW_ACCOUNT_INVOKE_ACTION</code></a>
type is also available when an action is built separately.</p>
<h2 id="collection-policies">Collection policies</h2>
<p>One policy applies to every open note settled by the action:</p>
<table>
<thead>
<tr>
<th><code>collect_policy</code></th>
<th>Amount collected from the shadow account</th>
</tr>
</thead>
<tbody><tr>
<td><code>{ type: "all" }</code></td>
<td>The token&#39;s entire balance</td>
</tr>
<tr>
<td><code>{ type: "diff" }</code></td>
<td>Only the balance gained during this interaction</td>
</tr>
<tr>
<td><code>{ type: "exact", amount }</code></td>
<td>Exactly <code>amount</code> in the token&#39;s smallest unit</td>
</tr>
</tbody></table>
<h2 id="things-to-notice">Things to notice</h2>
<ul>
<li><code>calls</code> must contain at least one standard starknet.js <code>Call</code>.</li>
<li>The number of open notes created in the transaction must match the number
the shadow-account call fills.</li>
<li>A transaction has one invoke-phase slot. <code>invoke</code> and
<code>shadow_account_invoke</code> are mutually exclusive in the same transaction.</li>
<li>Deployment is lazy: the address can receive funds before the first
<code>shadow_account_invoke</code> deploys it.</li>
<li>Use the anonymizer address for the connected network from
<a href="/contract-addresses">Deployed Contract Addresses</a>.</li>
</ul>
<h2 id="read-next">Read next</h2>
<ul>
<li><a href="/starknet-wallet-api/starknet-js">starknet.js</a></li>
<li><a href="/starknet-wallet-api/private-defi">Private DeFi End to End</a></li>
<li><a href="/sdk/shadow-accounts">Shadow Accounts with the Privacy SDK</a></li>
</ul>
`

export default html
