# Cairo example contracts

Cairo sources for the example pages, mirrored into `src/pages/` by
`npm run copy:contracts`.

## Provenance

Most of these contracts are adapted from the
[starknet-privacy](https://github.com/starkware-libs/starknet-privacy) monorepo
(Apache License 2.0, StarkWare):

| Example | Upstream source |
| --- | --- |
| `src/helpers/privacy-invoke/EchoHelper.cairo` | `packages/privacy/src/tests/mock_invoke_returns.cairo` |
| `src/helpers/swap-helper/SwapHelper.cairo` | `packages/privacy/src/test_contracts/mock_swap_executor.cairo` |
| `src/helpers/swap-helper/MockAmm.cairo` | `packages/privacy/src/test_contracts/mock_amm.cairo` |
| `src/helpers/vesu-lending-helper/VesuLendingHelper.cairo` | `packages/vesu_lending_anonymizer/src/vesu_lending_anonymizer.cairo` |

`src/helpers/escrow/Escrow.cairo` is the one exception: it is an original
example written for this site, not adapted from the monorepo (which ships no
escrow package). It carries no upstream license attribution and has not been
reviewed or audited by StarkWare.

Adaptations (for the contracts listed in the table above) are limited to: trimming module-level doc comments that live in the
example page prose instead, renaming mock contracts to tutorial names, and
removing test-only entry points. The code is otherwise kept verbatim so it stays
diffable against upstream.

## Compilation

These files are **not compiled standalone in v1**: page slugs are kebab-case
(not valid Cairo module names) and the helpers depend on the privacy pool
package (`privacy::objects::OpenNoteDeposit`). The contracts listed in the
provenance table above are adapted from code that compiles and is tested in
the upstream monorepo - compile verification happens there. `Escrow.cairo` is
original and has not been compiled or independently audited; treat it as
illustrative only.
