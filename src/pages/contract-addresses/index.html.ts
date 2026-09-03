// metadata
export const version = "0.14.3"
export const title = "Deployed Contract Addresses"
export const description =
  "Verified Starknet Mainnet and Sepolia addresses for the STRK20 privacy pool and deployed anonymizer contracts"
export const githubLink = ""
export const githubLabel = ""

export const keywords = [
  "addresses",
  "contracts",
  "deployments",
  "mainnet",
  "sepolia",
  "privacy pool",
  "anonymizer",
  "avnu",
  "offmarket",
  "endur",
]

export const codes = []

const html = `<p>These are the public STRK20 pool and anonymizer deployments verified on <strong>3
September 2026</strong>. Use the address for the network your wallet or backend is
connected to; Mainnet and Sepolia contracts are not interchangeable.</p>
<h2 id="starknet-mainnet">Starknet Mainnet</h2>
<table>
<thead>
<tr>
<th>Contract</th>
<th>Purpose</th>
<th>Address</th>
</tr>
</thead>
<tbody><tr>
<td>STRK20 Privacy Pool</td>
<td>Holds shielded ERC-20 notes and verifies private actions</td>
<td><a href="https://voyager.online/contract/0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a"><code>0x040337b1af3c663e86e333bab5a4b28da8d4652a15a69beee2b677776ffe812a</code></a></td>
</tr>
<tr>
<td>AVNU <code>PrivacySwapHelper</code></td>
<td>Executes private AVNU swaps</td>
<td><a href="https://voyager.online/contract/0x0426dcd1ab5fa2f852f138d07cb37708b00a4db999677fe2d0c9a440702dbe5e"><code>0x0426dcd1ab5fa2f852f138d07cb37708b00a4db999677fe2d0c9a440702dbe5e</code></a></td>
</tr>
<tr>
<td>Privacy Bridge / OFFMARKET <code>OutboundAnonymizer</code></td>
<td>Moves shielded USDC from the pool into the outbound CCTP flow</td>
<td><a href="https://voyager.online/contract/0x009067f35d2cab3cb933f3d78793660402026f8fa31e041ca2cab4a8e9a49092"><code>0x009067f35d2cab3cb933f3d78793660402026f8fa31e041ca2cab4a8e9a49092</code></a></td>
</tr>
<tr>
<td>Privacy Bridge / OFFMARKET <code>InboundAnonymizer</code></td>
<td>Binds returning CCTP funds to a private note</td>
<td><a href="https://voyager.online/contract/0x03a7e7f34e530f8ec00b1ff7eaca90a136311d9da7cb17a73203f813b56c86cb"><code>0x03a7e7f34e530f8ec00b1ff7eaca90a136311d9da7cb17a73203f813b56c86cb</code></a></td>
</tr>
<tr>
<td>Endur <code>EndurDepositAnonymizer</code></td>
<td>Deposits into Endur from shielded funds</td>
<td><a href="https://voyager.online/contract/0x030dee638065962eb3642ca54aa48e9e2cd98536bc90b64b99bb306c1db30698"><code>0x030dee638065962eb3642ca54aa48e9e2cd98536bc90b64b99bb306c1db30698</code></a></td>
</tr>
</tbody></table>
<p>AVNU returns its current <code>executorAddress</code> when a private quote is built. Use
that response at runtime rather than assuming the address above will never
change.</p>
<h2 id="starknet-sepolia">Starknet Sepolia</h2>
<table>
<thead>
<tr>
<th>Contract</th>
<th>Purpose</th>
<th>Address</th>
</tr>
</thead>
<tbody><tr>
<td>STRK20 Privacy Pool</td>
<td>Testnet pool for SDK and integration testing</td>
<td><a href="https://sepolia.voyager.online/contract/0x0254a6b2997ef52e9f830ce1f543f6b29768295e8d17e2267d672c552cfe0d91"><code>0x0254a6b2997ef52e9f830ce1f543f6b29768295e8d17e2267d672c552cfe0d91</code></a></td>
</tr>
<tr>
<td>Privacy Bridge / OFFMARKET <code>OutboundAnonymizer</code></td>
<td>Testnet outbound CCTP helper</td>
<td><a href="https://sepolia.voyager.online/contract/0x05b85f2ae4d47c1e661533d5832fe3e4afd4c6a9b52e54b7f873a00c9b285f4e"><code>0x05b85f2ae4d47c1e661533d5832fe3e4afd4c6a9b52e54b7f873a00c9b285f4e</code></a></td>
</tr>
<tr>
<td>Privacy Bridge / OFFMARKET <code>InboundAnonymizer</code></td>
<td>Testnet inbound CCTP helper</td>
<td><a href="https://sepolia.voyager.online/contract/0x00d2a07c657d8c70f6eeddb7c8125e39b0955a40a608f63ca8a88d3ebbf72117"><code>0x00d2a07c657d8c70f6eeddb7c8125e39b0955a40a608f63ca8a88d3ebbf72117</code></a></td>
</tr>
</tbody></table>
<p>No public Sepolia deployment was confirmed for the AVNU or Endur helpers, so
their Mainnet addresses must not be reused on Sepolia.</p>
<h2 id="what-is-not-in-the-list">What is not in the list</h2>
<p><code>EkuboSwapAnonymizer</code>, <code>VesuLendingAnonymizer</code>, and
<code>ShadowAccountAnonymizer</code> are reference packages in the
<a href="https://github.com/starkware-libs/starknet-privacy">starknet-privacy monorepo</a>,
but that repository does not currently publish canonical Mainnet or Sepolia
deployment addresses for them. The swap helper and escrow elsewhere on this
site are worked examples, not public deployments. Devnet and end-to-end test
addresses are intentionally excluded.</p>
<h2 id="sources-and-verification">Sources and verification</h2>
<ul>
<li>The pool addresses are exported by
<a href="https://www.npmjs.com/package/@avnu/avnu-sdk"><code>@avnu/avnu-sdk</code></a> as
<code>PRIVACY_POOL_ADDRESS</code> and <code>SEPOLIA_PRIVACY_POOL_ADDRESS</code>.</li>
<li>The pool and Privacy Bridge defaults are pinned per network in the
<a href="https://github.com/starkware-libs/privacy-bridge/blob/main/packages/bridge-core/src/core/config.ts">bridge-core configuration</a>.</li>
<li>Every address above was checked against its network&#39;s current on-chain class.
The helper ABIs identify <code>PrivacySwapHelperImpl</code>,
<code>OutboundAnonymizerImpl</code>, <code>InboundAnonymizerImpl</code>, and
<code>EndurDepositAnonymizerImpl</code> respectively.</li>
</ul>
<p>Contract addresses and implementations can change. Re-check this page and the
linked explorer before shipping a production integration.</p>
`

export default html
