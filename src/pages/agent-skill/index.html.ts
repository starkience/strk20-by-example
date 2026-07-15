// metadata
export const version = "0.14.3"
export const title = "Agent Skill"
export const description =
  "Let your coding agent plan and build an STRK20 integration for your app"
export const githubLink = "https://github.com/starkience/strk20-agent-skills"
export const githubLabel = "strk20-agent-skills"

export const keywords = [
  "agent",
  "skill",
  "ai",
  "claude",
  "codex",
  "cursor",
  "integration",
  "plan",
  "execute",
]

export const codes = []

const html = `<p>Everything on this site can be done for you by a coding agent. The STRK20
integration skill turns Claude Code, Codex, Cursor, and 14+ other agents into
an integration engineer for the repo they run in:</p>
<pre><code class="language-sh">npx skills add starkience/strk20-agent-skills
</code></pre><p>Then, inside your project, ask your agent to <strong>"plan STRK20 privacy for this
app."</strong></p>
<h3>What it does</h3>
<ol>
<li><strong>Scans</strong> your repo - starknet.js version, get-starknet, Cairo contracts,
backend SDKs - and finds the plug-in points.</li>
<li><strong>Asks</strong> - a short interview: what exactly should be private, which wallets
your users hold, testnet or mainnet first.</li>
<li><strong>Routes</strong> - Starknet Wallet API via starknet.js (most dapps), anonymizer
contract + Wallet API (DeFi protocols), Privacy SDK direct (wallets and
backends holding their own keys), or private sub-accounts (tracked).</li>
<li><strong>Plans</strong> - writes a phased, versioned <code>STRK20_INTEGRATION_PLAN.md</code> naming
your actual files, honest about what is hidden vs. visible.</li>
<li><strong>Executes on your approval</strong> - builds the plan phase by phase, with
headless checks per phase and a short manual wallet check handed to you at
every phase boundary. Its chat output links back to the matching pages on
this site.</li>
</ol>
<h3>What it never does</h3>
<ul>
<li><strong>Generate or edit Cairo contracts.</strong> An anonymizer contract stays your
team&#39;s code to write, review, and audit; the skill points at the public
reference packages instead.</li>
<li><strong>Touch key material.</strong> Viewing keys, private keys, and secrets never land
in files - env-var placeholders only.</li>
<li><strong>Ship to mainnet silently.</strong> Testnet by default; mainnet-affecting changes
require your explicit confirmation.</li>
</ul>
<p>Source, docs, and issues:
<a href="https://github.com/starkience/strk20-agent-skills">github.com/starkience/strk20-agent-skills</a>
(Apache 2.0).</p>
`

export default html
