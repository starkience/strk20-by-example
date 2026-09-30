// metadata
export const version = "0.14.3"
export const title = "Proving Configuration"
export const description =
  "Configure ProvingServiceProofProvider, pick provingBlockId, and submit proofs correctly"
export const githubLink =
  "https://github.com/starkware-libs/starknet-privacy/blob/main/sdk/README.md"
export const githubLabel = ""

export const keywords = [
  "proving",
  "provingBlockId",
  "proofFacts",
  "nonce",
  "reorg",
  "maturity",
]

export const codes = []

const html = `<p>The proving provider sends your signed invocation to a proving service,
which executes it in a virtual Starknet environment and returns a STARK
proof. Three small conventions around it account for most submission
failures.</p>
<p>Snippets assume <code>transfers</code>, <code>account</code> and <code>provider</code> from
<a href="/sdk/getting-started">Getting Started</a>.</p>
<pre><code class="language-typescript"><span class="hljs-keyword">import</span> { constants } <span class="hljs-keyword">from</span> <span class="hljs-string">"starknet"</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">ProvingServiceProofProvider</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">"@starkware-libs/starknet-privacy-sdk"</span>

<span class="hljs-keyword">const</span> provingProvider = <span class="hljs-keyword">new</span> <span class="hljs-title class_">ProvingServiceProofProvider</span>(
  process.<span class="hljs-property">env</span>.<span class="hljs-property">PROVING_SERVICE_URL</span>!,
  constants.<span class="hljs-property">StarknetChainId</span>.<span class="hljs-property">SN_SEPOLIA</span>,
)
</code></pre><h2 id="provingblockid---always-currentblock---10"><code>provingBlockId</code> - always <code>currentBlock - 10</code></h2>
<pre><code class="language-typescript"><span class="hljs-keyword">const</span> provingBlockId = (<span class="hljs-keyword">await</span> provider.<span class="hljs-title function_">getBlockNumber</span>()) - <span class="hljs-number">10</span>
<span class="hljs-keyword">const</span> result = <span class="hljs-keyword">await</span> transfers.<span class="hljs-title function_">build</span>().<span class="hljs-comment">/* ... */</span>.<span class="hljs-title function_">execute</span>({ provingBlockId })
</code></pre><p>The proof is generated against the state at <code>provingBlockId</code>. Three reasons to
back off from the head:</p>
<ol>
<li><strong>Note maturity</strong> - notes mature 10 blocks after creation. Proving at
<code>currentBlock - 10</code> guarantees every unspent note in your registry has
matured at the proof base.</li>
<li><strong>Reorg buffer</strong> - a proof based on the chain head can be invalidated by
an L2 reorg before the transaction lands. The contract allows proofs up to
<code>proof_validity_blocks</code> old (default 450, ~15 min at 2s/block; it is
governance-settable), so ten blocks back is a comfortable, still-fresh
margin.</li>
<li><strong>Consistent state</strong> - the SDK forwards <code>provingBlockId</code> to <code>discoverNotes</code>
and <code>discoverChannels</code>, so discovery and proving see the same block. Without
it the two can disagree, and a note selected from a newer state can fail to
prove.</li>
</ol>
<p>Omitting it works <em>most</em> of the time - with intermittent failures on
insufficiently mature notes and worse proving-service cache hits. Just always
pass it. And when
chaining transactions (approve then deposit), re-fetch it after each
<code>waitForTransaction</code>.</p>
<h2 id="proofdetails---conditional-never-empty"><code>proofDetails</code> - conditional, never empty</h2>
<pre><code class="language-typescript"><span class="hljs-keyword">const</span> proofDetails = callAndProof.<span class="hljs-property">proof</span>.<span class="hljs-property">proofFacts</span>?.<span class="hljs-property">length</span>
  ? { <span class="hljs-attr">proofFacts</span>: callAndProof.<span class="hljs-property">proof</span>.<span class="hljs-property">proofFacts</span>, <span class="hljs-attr">proof</span>: callAndProof.<span class="hljs-property">proof</span>.<span class="hljs-property">data</span> }
  : {}
<span class="hljs-keyword">const</span> tx = <span class="hljs-keyword">await</span> account.<span class="hljs-title function_">execute</span>(callAndProof.<span class="hljs-property">call</span>, { <span class="hljs-attr">tip</span>: <span class="hljs-number">0n</span>, ...proofDetails })
</code></pre><p>Some providers (the mock/no-validate ones used in development) return empty
proof facts. Passing <code>proofFacts: []</code> through to <code>account.execute</code> makes
starknet.js serialize an invalid v3 transaction - the keys must be <strong>omitted
entirely</strong>, hence the conditional spread. <code>tip: 0n</code> is mandatory for v3
transactions; forgetting it fails with the cryptic
<code>Cannot mix BigInt and other types</code>.</p>
<h2 id="retry-hygiene-invalidateproofnoncecache">Retry hygiene: <code>invalidateProofNonceCache()</code></h2>
<p>The proving provider caches the pool nonce. After any failed submission -
a revert, <code>INVALID_NONCE</code>, <code>Replacement transaction underpriced</code> - the cache
is stale, and retrying loops on proofs the chain keeps rejecting:</p>
<pre><code class="language-typescript">transfers.<span class="hljs-title function_">invalidateProofNonceCache</span>()
<span class="hljs-comment">// ...then rebuild and resubmit</span>
</code></pre><h2 id="deposits-are-screened-on-every-proving-route">Deposits are screened on every proving route</h2>
<p>A custom or self-hosted backend can generate proofs without an Elliptic or FPI
credential. Registration, private transfers, withdrawals, and other operations
with no screened subject can therefore run entirely through a local prover.</p>
<p>A deposit is different: Elliptic evaluates the depositing address, an
FPI-managed attestation signer signs an allowed result, and the pool verifies
that signature onchain. A screening-enabled pool may apply the same requirement
to other configured subjects, such as an invoke or shadow-account address.
Self-hosting the prover does not bypass that policy; the proof flow must also
obtain the required attestation.</p>
<p>For most builders, the starting route for screening access is Starkscan rather
than requesting direct Elliptic partner credentials. Hosted wallet and prover
flows handle the screening round-trip for you. If you operate your own prover,
deploy the official
<a href="https://github.com/starkware-libs/starknet-privacy/tree/main/proof-interceptor">proof interceptor</a>
alongside it and confirm the current Starkscan onboarding and screening
credentials before production. The public SDK does not contain a reusable
screening secret.</p>
<h2 id="common-failures">Common failures</h2>
<table>
<thead>
<tr>
<th>Symptom</th>
<th>Cause</th>
<th>Fix</th>
</tr>
</thead>
<tbody><tr>
<td>Spend fails on a recently created note</td>
<td><code>provingBlockId</code> not backed off</td>
<td>Use <code>currentBlock - 10</code></td>
</tr>
<tr>
<td><code>Cannot mix BigInt and other types</code></td>
<td>Missing <code>tip</code></td>
<td>Add <code>tip: 0n</code></td>
</tr>
<tr>
<td>Revert with <code>INVALID_PROOF_FACTS</code></td>
<td>Passed <code>proofFacts: []</code></td>
<td>Conditional spread</td>
</tr>
<tr>
<td><code>INVALID_NONCE</code> on retry</td>
<td>Stale cached pool nonce</td>
<td><code>invalidateProofNonceCache()</code> first</td>
</tr>
</tbody></table>
<p>This is the last page of the series - head back to
<a href="/sdk/getting-started">Getting Started</a> to revisit the wiring.</p>
`

export default html
