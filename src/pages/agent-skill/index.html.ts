// metadata
export const version = "0.14.3"
export const title = "Agent Skill"
export const description =
  "Give your coding agent working knowledge of STRK20 - concepts, Wallet API, anonymizer contracts, and the Privacy SDK"
export const githubLink = "https://github.com/welttowelt/strk20-skills"
export const githubLabel = "strk20-skills"

export const keywords = [
  "agent",
  "skill",
  "ai",
  "claude",
  "codex",
  "cursor",
  "knowledge",
  "reference",
]

export const codes = []

const html = `<p>Everything on this site can be loaded into a coding agent. The STRK20 skills
give Claude Code, Codex, Cursor, and other agents that read the skills format
the working knowledge behind these pages - how the pool works, how a dapp asks
a wallet to act, how to write the Cairo adapter, and how to drive the SDK:</p>
<pre><code class="language-sh">npx skills add welttowelt/strk20-skills
</code></pre><p>Then work normally. The skills fire on their own when a task touches STRK20 -
you do not invoke them by name.</p>
<h3 id="the-four-skills">The four skills</h3>
<ul>
<li><strong><code>strk20-privacy</code></strong> - the router and mental model. Notes, nullifiers,
viewing keys, channels, actions and proofs, deposit screening, what is
hidden versus public, compliance and auditing, and the ecosystem map. Fires
when an agent is choosing an integration route or answering how STRK20
works.</li>
<li><strong><code>strk20-wallet-api</code></strong> - private dapps in TypeScript or React through the
Starknet Wallet API: shield and unshield, private transfers, shielded
balances, private DeFi calls, and AVNU private swaps. The recommended route
for most dapps, where the wallet keeps the viewing keys.</li>
<li><strong><code>strk20-anonymizer-contracts</code></strong> - the Cairo side of private DeFi: the
<code>privacy_invoke</code> entry point the pool calls, <code>OpenNoteDeposit</code> returns, the
balance-delta idiom, and the swap, Vesu lending, and escrow patterns.</li>
<li><strong><code>strk20-privacy-sdk</code></strong> - for teams building the wallet itself, or backends
that hold their own keys: <code>createPrivateTransfers</code> wiring, register, deposit,
transfer, withdraw, multi-op batches, shadow accounts, note discovery, and
proving configuration.</li>
</ul>
<p>Each skill is a distilled <code>SKILL.md</code> plus the relevant pages from this site
bundled verbatim under <code>references/</code>, so the agent opens the source instead of
reconstructing it from memory. Codex metadata ships under <code>agents/openai.yaml</code>.</p>
<h3 id="what-they-never-do">What they never do</h3>
<ul>
<li><strong>Generate or edit Cairo contracts for you.</strong> An anonymizer contract stays
your team&#39;s code to write, review, and audit; the skills carry the reference
patterns and the public packages. Learn more about Cairo at
<a href="https://www.cairo-lang.org/">cairo-lang.org</a> and about anonymizer contracts
in <a href="/helpers/privacy-invoke">Anonymizer Contract Anatomy</a>.</li>
<li><strong>Touch key material.</strong> Viewing keys, private keys, and secrets belong in
env vars, never in files, and never in a prompt.</li>
</ul>
<h3 id="check-anything-load-bearing">Check anything load-bearing</h3>
<p>The skills bundle a snapshot, and versions, wallet support, and feature status
all move. Verify against this site before you rely on a version pin or a
support claim.</p>
<h3 id="this-site-is-agent-readable">This site is agent-readable</h3>
<p>Agents don&#39;t need to parse the app bundle: every page on this site is mirrored
as raw Markdown. Start from <a href="/llms.txt">/llms.txt</a> (index of all pages as <code>.md</code>
URLs) or fetch the whole site in one file at <a href="/llms-full.txt">/llms-full.txt</a>.</p>
<p>Source, docs, and issues:
<a href="https://github.com/welttowelt/strk20-skills">github.com/welttowelt/strk20-skills</a>
(Apache 2.0).</p>
`

export default html
