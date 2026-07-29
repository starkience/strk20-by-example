// metadata
export const version = "0.14.3"
export const title = "AVNU Private Swaps"
export const description =
  "Add private swaps to a dapp with the AVNU SDK, without writing or deploying an anonymizer contract"
export const githubLink = ""
export const githubLabel = ""

export const keywords = ["avnu", "private swap", "defi", "wallet api"]

export const codes = []

const html = `<p>Most private DeFi needs an app-specific
<a href="/helpers/privacy-invoke">anonymizer contract</a>. Swapping is the exception:
<a href="https://docs.avnu.fi/docs/privacy">AVNU</a> has deployed its own executor, so a
dapp can offer private swaps with <strong>no Cairo to write, review, or audit</strong>.</p>
<h2 id="install">Install</h2>
<pre><code class="language-shell">npm install @avnu/avnu-sdk@^4.2.0 starknet@^10.4.0
</code></pre><h2 id="what-you-need">What you need</h2>
<ul>
<li>A STRK20-capable wallet (Wallet API <code>&gt;= 0.10.3</code>).</li>
<li>The sell token <strong>already shielded</strong> — the swap moves value inside the pool, so
it cannot shield for you.</li>
</ul>
<h2 id="the-call">The call</h2>
<pre><code class="language-ts"><span class="hljs-keyword">import</span> { executePrivateSwap, createStrk20WalletProver } <span class="hljs-keyword">from</span> <span class="hljs-string">"@avnu/avnu-sdk"</span>

<span class="hljs-keyword">const</span> prover = <span class="hljs-title function_">createStrk20WalletProver</span>(walletAccount)
<span class="hljs-keyword">const</span> result = <span class="hljs-keyword">await</span> <span class="hljs-title function_">executePrivateSwap</span>(quote, { prover })
</code></pre><p>AVNU&#39;s paymaster relays the transaction, so the submitting address is not the
user&#39;s.</p>
<h2 id="when-to-use-a-helper-instead">When to use a helper instead</h2>
<p>Reach for your own anonymizer contract when the action is not a swap — lending,
staking, or any app-specific flow. Those still need the pattern in
<a href="/starknet-wallet-api/private-defi">Private DeFi End to End</a>.</p>
<h2 id="read-next">Read next</h2>
<ul>
<li><a href="/starknet-wallet-api/private-defi">Private DeFi End to End</a></li>
<li><a href="/helpers/swap-helper">Swap Helper</a> - the do-it-yourself route</li>
</ul>
`

export default html
