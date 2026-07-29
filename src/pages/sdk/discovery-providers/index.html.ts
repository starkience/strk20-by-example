// metadata
export const version = "0.14.3"
export const title = "Discovery Providers"
export const description =
  "IndexerDiscoveryProvider is the discovery backend the SDK exports; ContractDiscoveryProvider exists in source but is not yet reachable"
export const githubLink =
  "https://github.com/starkware-libs/starknet-privacy/blob/main/sdk/README.md"
export const githubLabel = ""

export const keywords = [
  "discovery",
  "indexer",
  "contract",
  "provider",
  "ohttp",
  "exports",
]

export const codes = []

const html = `<p>Everything on the previous page - <code>discoverNotes</code>, <code>discoverChannels</code>,
<code>discoverRequirement</code>, the <code>autoDiscover</code> options - is served by the
<code>discoveryProvider</code> you wired into <code>createPrivateTransfers</code>. The SDK ships
two implementations.</p>
<table>
<thead>
<tr>
<th>Provider</th>
<th>Backend</th>
<th>Use for</th>
</tr>
</thead>
<tbody><tr>
<td><code>IndexerDiscoveryProvider</code></td>
<td>Discovery service over HTTP</td>
<td>Production - pagination and reorg detection handled server-side</td>
</tr>
<tr>
<td><code>ContractDiscoveryProvider</code></td>
<td>Pool contract via Starknet RPC</td>
<td>Not yet exported from the published package - see below</td>
</tr>
</tbody></table>
<h2 id="indexerdiscoveryprovider">IndexerDiscoveryProvider</h2>
<p>The default. Passing a config object to <code>createPrivateTransfers</code> constructs one
for you:</p>
<pre><code class="language-typescript"><span class="hljs-attr">discoveryProvider</span>: { <span class="hljs-attr">url</span>: process.<span class="hljs-property">env</span>.<span class="hljs-property">INDEXER_URL</span>! }
</code></pre><p>Construct it directly only when you need constructor options the config object
does not expose — for example OHTTP envelope encryption:</p>
<pre><code class="language-typescript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">IndexerDiscoveryProvider</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">"@starkware-libs/starknet-privacy-sdk"</span>

<span class="hljs-keyword">const</span> discoveryProvider = <span class="hljs-keyword">new</span> <span class="hljs-title class_">IndexerDiscoveryProvider</span>(
  process.<span class="hljs-property">env</span>.<span class="hljs-property">INDEXER_URL</span>!,
  process.<span class="hljs-property">env</span>.<span class="hljs-property">POOL_ADDRESS</span>!, <span class="hljs-comment">// hex string, like everywhere else</span>
  { <span class="hljs-attr">ohttp</span>: <span class="hljs-literal">true</span> },
)
</code></pre><p>Import it from the package root. Deep paths into <code>dist/internal/</code> are blocked by
the package&#39;s <code>exports</code> map and fail at runtime with
<code>ERR_PACKAGE_PATH_NOT_EXPORTED</code>.</p>
<h2 id="contractdiscoveryprovider">ContractDiscoveryProvider</h2>
<p>Replays pool events by querying the contract over RPC, with no indexer to run.
It exists in the SDK source but is <strong>not currently reachable from the published
package</strong> — it is not exported from the package root, and the <code>exports</code> map
blocks every deep path, so <code>import { ContractDiscoveryProvider } from "@starkware-libs/starknet-privacy-sdk"</code> fails with
<code>TS2305: has no exported member</code>.</p>
<p>Until it is exported, use <code>IndexerDiscoveryProvider</code> against a development
indexer. Track
<a href="https://github.com/starkware-libs/starknet-privacy">starkware-libs/starknet-privacy</a>
for the export.</p>
<h2 id="things-to-notice">Things to notice</h2>
<ul>
<li>Reorg handling: the indexer detects L2 reorgs and repairs its cursor
automatically. You do not need to write reorg-handling logic against
<code>IndexerDiscoveryProvider</code>.</li>
<li>Discovery cost does not grow with pool history from your app&#39;s
perspective - the indexer scans the pool once, server-side, for every
consumer.</li>
</ul>
<p>Next: <a href="/sdk/proving-config">Proving Configuration</a> - the proving side of the
same wiring.</p>
`

export default html
