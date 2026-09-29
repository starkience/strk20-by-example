// metadata
export const version = "0.14.3"
export const title = "Shadow Accounts"
export const description =
  "Build and invoke deterministic per-dapp shadow accounts with the Starknet Privacy SDK"
export const githubLink =
  "https://github.com/starkware-libs/starknet-privacy/blob/main/sdk/CHANGELOG.md"
export const githubLabel = "privacy sdk changelog"

export const keywords = [
  "shadow account",
  "shadowAccounts",
  "commitment",
  "PRIMER_CLASS_HASH",
  "collectPolicy",
  "privacy sdk",
]

export const codes = []

const html = `<p>Shadow accounts give one user a persistent, pseudonymous identity for one
dapp. They are useful for positions that live across transactions - staking,
lending, rewards, and any protocol that needs to recognize a returning caller.</p>
<p>This page follows Privacy SDK <code>0.14.3-rc.8</code>. The old <code>subaccounts(...)</code> API was
renamed and is not compatible with the current anonymizer. Use
<code>shadowAccounts(...)</code> throughout.</p>
<p>Snippets assume <code>transfers</code>, <code>account</code> and <code>provider</code> from
<a href="/sdk/getting-started">Getting Started</a>.</p>
<h2 id="configure-the-anonymizer">Configure the anonymizer</h2>
<p>Pass the deployment for the connected network when creating <code>transfers</code>:</p>
<pre><code class="language-typescript"><span class="hljs-keyword">const</span> transfers = <span class="hljs-title function_">createPrivateTransfers</span>({
  account,
  viewingKeyProvider,
  provingProvider,
  discoveryProvider,
  <span class="hljs-attr">poolContractAddress</span>: process.<span class="hljs-property">env</span>.<span class="hljs-property">POOL_ADDRESS</span>!,
  <span class="hljs-attr">shadowAccountAnonymizerAddress</span>: process.<span class="hljs-property">env</span>.<span class="hljs-property">SHADOW_ACCOUNT_ANONYMIZER_ADDRESS</span>!,
})
</code></pre><p>Calling <code>shadowAccounts(...)</code> without <code>shadowAccountAnonymizerAddress</code> throws.
Use the current Mainnet or Sepolia value from
<a href="/contract-addresses">Deployed Contract Addresses</a>.</p>
<h2 id="commitments-and-addresses">Commitments and addresses</h2>
<p>The builder derives the partial and full commitments locally from the user,
viewing key, anonymizer, dapp name, and nonce:</p>
<pre><code class="language-typescript"><span class="hljs-keyword">import</span> { shadowAccountAddress } <span class="hljs-keyword">from</span> <span class="hljs-string">"@starkware-libs/starknet-privacy-sdk"</span>

<span class="hljs-keyword">const</span> shadow = transfers.<span class="hljs-title function_">build</span>().<span class="hljs-title function_">shadowAccounts</span>(<span class="hljs-string">"myDapp"</span>)
<span class="hljs-keyword">const</span> partial = <span class="hljs-keyword">await</span> shadow.<span class="hljs-title function_">partialCommitment</span>()
<span class="hljs-keyword">const</span> commitment = <span class="hljs-keyword">await</span> shadow.<span class="hljs-title function_">commitment</span>(<span class="hljs-number">0n</span>)

<span class="hljs-keyword">const</span> address = <span class="hljs-title function_">shadowAccountAddress</span>(
  commitment,
  <span class="hljs-title class_">BigInt</span>(process.<span class="hljs-property">env</span>.<span class="hljs-property">SHADOW_ACCOUNT_ANONYMIZER_ADDRESS</span>!),
)
</code></pre><p><code>shadowAccountAddress</code> uses the exported, fixed <code>PRIMER_CLASS_HASH</code>, matching
the current Cairo deployment pattern. It works before the account is deployed
and does not require an RPC call. The package also exports the lower-level
<code>shadowAccountPartialCommitment</code> and <code>shadowAccountCommitment</code> helpers when you
already hold the raw felts.</p>
<h2 id="invoke-through-the-shadow-account">Invoke through the shadow account</h2>
<p>Fund the shadow address, create an open note for each expected output token,
then queue the calls. The SDK translates this into one <code>ComputeAndInvoke</code>
against the <code>ShadowAccountAnonymizer</code>.</p>
<pre><code class="language-typescript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Open</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">"@starkware-libs/starknet-privacy-sdk"</span>

<span class="hljs-keyword">const</span> provingBlockId = (<span class="hljs-keyword">await</span> provider.<span class="hljs-title function_">getBlockNumber</span>()) - <span class="hljs-number">10</span>

<span class="hljs-keyword">const</span> { callAndProof } = <span class="hljs-keyword">await</span> transfers
  .<span class="hljs-title function_">build</span>({ <span class="hljs-attr">autoDiscover</span>: { <span class="hljs-attr">notes</span>: <span class="hljs-string">"refresh"</span> } })
  .<span class="hljs-title function_">with</span>(<span class="hljs-variable constant_">STRK</span>)
  .<span class="hljs-title function_">withdraw</span>({ <span class="hljs-attr">recipient</span>: address, <span class="hljs-attr">amount</span>: <span class="hljs-number">5n</span> * <span class="hljs-number">10n</span> ** <span class="hljs-number">18n</span> })
  .<span class="hljs-title function_">surplusTo</span>(account.<span class="hljs-property">address</span>, <span class="hljs-literal">false</span>)
  .<span class="hljs-title function_">with</span>(<span class="hljs-variable constant_">STRK</span>)
  .<span class="hljs-title function_">transfer</span>({ <span class="hljs-attr">recipient</span>: account.<span class="hljs-property">address</span>, <span class="hljs-attr">amount</span>: <span class="hljs-title class_">Open</span> })
  .<span class="hljs-title function_">done</span>()
  .<span class="hljs-title function_">shadowAccounts</span>(<span class="hljs-string">"myDapp"</span>)
  .<span class="hljs-title function_">invoke</span>(<span class="hljs-number">0n</span>, {
    <span class="hljs-attr">calls</span>: [stakingContract.<span class="hljs-title function_">populate</span>(<span class="hljs-string">"stake"</span>, { <span class="hljs-attr">amount</span>: <span class="hljs-number">1000n</span> })],
    <span class="hljs-attr">collectPolicy</span>: { <span class="hljs-attr">type</span>: <span class="hljs-string">"all"</span> },
  })
  .<span class="hljs-title function_">execute</span>({ provingBlockId })

<span class="hljs-comment">// Submit callAndProof with the usual proofDetails + tip: 0n tail.</span>
</code></pre><p><code>collectPolicy</code> is optional in the SDK and defaults to <code>{ type: "all" }</code>.</p>
<table>
<thead>
<tr>
<th><code>collectPolicy</code></th>
<th>Amount collected into each open note</th>
</tr>
</thead>
<tbody><tr>
<td><code>{ type: "all" }</code></td>
<td>The token&#39;s entire shadow-account balance</td>
</tr>
<tr>
<td><code>{ type: "diff" }</code></td>
<td>Only the balance gained during this interaction</td>
</tr>
<tr>
<td><code>{ type: "exact", amount }</code></td>
<td>Exactly <code>amount</code></td>
</tr>
</tbody></table>
<h2 id="read-deployed-and-undeployed-accounts">Read deployed and undeployed accounts</h2>
<p>The exported <code>ShadowAccountAnonymizerABI</code> includes these views:</p>
<ul>
<li><code>get_shadow_accounts(partial, start, end, until_undeployed)</code> resolves a nonce
range and returns <code>{ nonce, address, is_deployed }</code> for each entry.</li>
<li><code>get_shadow_account(commitment)</code> returns the stored address of an already
deployed account, or zero when it has not been deployed.</li>
<li><code>get_shadow_account_class_hash()</code> returns the class installed after the
primer deployment. It is not the class hash used for address derivation.</li>
</ul>
<p>The scan range is limited to 1,024 nonces. With <code>until_undeployed: true</code>, the
range stops at the first address that has not been deployed.</p>
<h2 id="things-to-notice">Things to notice</h2>
<ul>
<li>A shadow account&#39;s balances, calls, and positions are public. Privacy comes
from hiding the link to the user&#39;s main account.</li>
<li>A shadow account has no keys. Only the anonymizer can execute through it.</li>
<li>One transaction can contain at most one invoke-phase action, whether it is a
normal <code>invoke</code> or a shadow-account invocation.</li>
<li>One collection policy applies to every open note settled by the invocation.</li>
<li>The current anonymizer returns the shadow-account address used by deposits so
the pool can apply its screening policy to that address.</li>
</ul>
<p>Next: <a href="/sdk/proving-config">Proving Configuration</a> - prepare and submit the
resulting call safely.</p>
`

export default html
