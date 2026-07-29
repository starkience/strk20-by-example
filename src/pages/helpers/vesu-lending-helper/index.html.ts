// metadata
export const version = "0.14.3"
export const title = "Vesu Lending Helper"
export const description =
  "Earn lending yield privately - the official reference helper for Vesu ERC-4626 vaults"
export const githubLink = ""
export const githubLabel = ""

export const keywords = [
  "vesu",
  "lending",
  "vault",
  "erc4626",
  "vtoken",
  "helper",
  "yield",
]

export const codes = [
  {
    fileName: "VesuLendingHelper.cairo",
    code: "Ly8gQWRhcHRlZCBmcm9tIHN0YXJrbmV0LXByaXZhY3kgcGFja2FnZXMvdmVzdV9sZW5kaW5nX2Fub255bWl6ZXIvc3JjL3Zlc3VfbGVuZGluZ19hbm9ueW1pemVyLmNhaXJvCi8vIChBcGFjaGUtMi4wLCBTdGFya1dhcmUpCnVzZSBwcml2YWN5OjpvYmplY3RzOjpPcGVuTm90ZURlcG9zaXQ7CnVzZSBzdGFya25ldDo6Q29udHJhY3RBZGRyZXNzOwoKLy8vIEludGVyZmFjZSBmb3IgYSBWZXN1IHZUb2tlbiB2YXVsdCAoRVJDLTQ2MjYgLyBTTklQLTIyIGNvbXBhdGlibGUpLgojW3N0YXJrbmV0OjppbnRlcmZhY2VdCnB1YiB0cmFpdCBJVlRva2VuPFQ+IHsKICAgIC8vLyBEZXBvc2l0cyBhc3NldHMgaW50byB0aGUgcG9vbCBhbmQgbWludHMgdlRva2VucyAoc2hhcmVzKSB0byB0aGUgcmVjZWl2ZXIuCiAgICBmbiBkZXBvc2l0KHJlZiBzZWxmOiBULCBhc3NldHM6IHUyNTYsIHJlY2VpdmVyOiBDb250cmFjdEFkZHJlc3MpIC0+IHUyNTY7CiAgICAvLy8gV2l0aGRyYXdzIGFzc2V0cyBmcm9tIHRoZSBwb29sIGFuZCBidXJucyB2VG9rZW5zIChzaGFyZXMpIGZyb20gdGhlIG93bmVyLgogICAgZm4gd2l0aGRyYXcoCiAgICAgICAgcmVmIHNlbGY6IFQsIGFzc2V0czogdTI1NiwgcmVjZWl2ZXI6IENvbnRyYWN0QWRkcmVzcywgb3duZXI6IENvbnRyYWN0QWRkcmVzcywKICAgICkgLT4gdTI1NjsKfQoKLy8vIExlbmRpbmcgb3BlcmF0aW9uIHRvIHBlcmZvcm0gb24gYSBWZXN1IHZhdWx0LgojW2Rlcml2ZShTZXJkZSwgQ29weSwgRHJvcCwgUGFydGlhbEVxLCBEZWJ1ZyldCnB1YiBlbnVtIExlbmRpbmdPcGVyYXRpb24gewogICAgRGVwb3NpdCwKICAgIFdpdGhkcmF3LAp9CgojW3N0YXJrbmV0OjppbnRlcmZhY2VdCnB1YiB0cmFpdCBJVmVzdUxlbmRpbmdIZWxwZXI8VD4gewogICAgLy8vIEV4ZWN1dGVzIGEgbGVuZGluZyBvcGVyYXRpb24gb24gdGhlIFZlc3UgbGVuZGluZyBwb29sLgogICAgLy8vCiAgICAvLy8gQ2FsbGVkIGJ5IHRoZSBwcml2YWN5IGNvbnRyYWN0IHZpYSB0aGUgYElOVk9LRV9TRUxFQ1RPUmAuCiAgICAvLy8KICAgIC8vLyAtIGBvcGVyYXRpb25gIC0gVGhlIGxlbmRpbmcgb3BlcmF0aW9uIHRvIHBlcmZvcm0uCiAgICAvLy8gLSBgaW5fdG9rZW5gIC0gVGhlIHRva2VuIGFkZHJlc3Mgb2YgdGhlIGlucHV0IGZ1bmRzIChvbiB3aXRoZHJhdzogdGhlIHZUb2tlbikuCiAgICAvLy8gLSBgb3V0X3Rva2VuYCAtIFRoZSB0b2tlbiBhZGRyZXNzIG9mIHRoZSBvdXRwdXQgZnVuZHMgKG9uIGRlcG9zaXQ6IHRoZSB2VG9rZW4pLgogICAgLy8vIC0gYGFzc2V0c2AgLSBBbW91bnQgb2YgYXNzZXRzIHRvIGRlcG9zaXQvd2l0aGRyYXcuCiAgICAvLy8gLSBgbm90ZV9pZGAgLSBUaGUgaWRlbnRpZmllciBvZiB0aGUgb3BlbiBub3RlIHRvIGRlcG9zaXQgdGhlIG91dHB1dCB0by4KICAgIGZuIHByaXZhY3lfaW52b2tlKAogICAgICAgIHJlZiBzZWxmOiBULAogICAgICAgIG9wZXJhdGlvbjogTGVuZGluZ09wZXJhdGlvbiwKICAgICAgICBpbl90b2tlbjogQ29udHJhY3RBZGRyZXNzLAogICAgICAgIG91dF90b2tlbjogQ29udHJhY3RBZGRyZXNzLAogICAgICAgIGFzc2V0czogdTI1NiwKICAgICAgICBub3RlX2lkOiBmZWx0MjUyLAogICAgKSAtPiBTcGFuPE9wZW5Ob3RlRGVwb3NpdD47Cn0KCi8vLyBFcnJvciBjb2RlcyBmb3IgVmVzdSBsZW5kaW5nIG9wZXJhdGlvbnMuCnB1YiBtb2QgZXJyb3JzIHsKICAgIHB1YiBjb25zdCBaRVJPX0lOX1RPS0VOOiBmZWx0MjUyID0gJ1pFUk9fSU5fVE9LRU4nOwogICAgcHViIGNvbnN0IFpFUk9fT1VUX1RPS0VOOiBmZWx0MjUyID0gJ1pFUk9fT1VUX1RPS0VOJzsKICAgIHB1YiBjb25zdCBaRVJPX0FTU0VUUzogZmVsdDI1MiA9ICdaRVJPX0FTU0VUUyc7CiAgICBwdWIgY29uc3QgVE9LRU5TX0VRVUFMOiBmZWx0MjUyID0gJ1RPS0VOU19FUVVBTCc7CiAgICBwdWIgY29uc3QgUkVDRUlWRURfQU1PVU5UX09WRVJGTE9XOiBmZWx0MjUyID0gJ1JFQ0VJVkVEX0FNT1VOVF9PVkVSRkxPVyc7CiAgICBwdWIgY29uc3QgWkVST19PVVRfQU1PVU5UOiBmZWx0MjUyID0gJ1pFUk9fT1VUX0FNT1VOVCc7Cn0KCi8vLyBWZXN1IGxlbmRpbmcgYW5vbnltaXplciBjb250cmFjdCB0aGF0IHBlcmZvcm1zIFZlc3UgZGVwb3NpdC93aXRoZHJhdyBvbiBiZWhhbGYgb2YgdGhlIHByaXZhY3kKLy8vIGNvbnRyYWN0LgojW3N0YXJrbmV0Ojpjb250cmFjdF0KcHViIG1vZCBWZXN1TGVuZGluZ0hlbHBlciB7CiAgICB1c2UgY29yZTo6bnVtOjp0cmFpdHM6Olplcm87CiAgICB1c2Ugb3BlbnplcHBlbGluOjppbnRlcmZhY2VzOjp0b2tlbjo6ZXJjMjA6OntJRVJDMjBEaXNwYXRjaGVyLCBJRVJDMjBEaXNwYXRjaGVyVHJhaXR9OwogICAgdXNlIHByaXZhY3k6Om9iamVjdHM6Ok9wZW5Ob3RlRGVwb3NpdDsKICAgIHVzZSBzdGFya25ldDo6e0NvbnRyYWN0QWRkcmVzcywgZ2V0X2NhbGxlcl9hZGRyZXNzLCBnZXRfY29udHJhY3RfYWRkcmVzc307CiAgICB1c2Ugc3VwZXI6OnsKICAgICAgICBJVlRva2VuRGlzcGF0Y2hlciwgSVZUb2tlbkRpc3BhdGNoZXJUcmFpdCwgSVZlc3VMZW5kaW5nSGVscGVyLCBMZW5kaW5nT3BlcmF0aW9uLCBlcnJvcnMsCiAgICB9OwoKICAgICNbc3RvcmFnZV0KICAgIHN0cnVjdCBTdG9yYWdlIHt9CgogICAgI1tjb25zdHJ1Y3Rvcl0KICAgIGZuIGNvbnN0cnVjdG9yKHJlZiBzZWxmOiBDb250cmFjdFN0YXRlKSB7fQoKICAgICNbYWJpKGVtYmVkX3YwKV0KICAgIHB1YiBpbXBsIFZlc3VMZW5kaW5nSGVscGVySW1wbCBvZiBJVmVzdUxlbmRpbmdIZWxwZXI8Q29udHJhY3RTdGF0ZT4gewogICAgICAgIGZuIHByaXZhY3lfaW52b2tlKAogICAgICAgICAgICByZWYgc2VsZjogQ29udHJhY3RTdGF0ZSwKICAgICAgICAgICAgb3BlcmF0aW9uOiBMZW5kaW5nT3BlcmF0aW9uLAogICAgICAgICAgICBpbl90b2tlbjogQ29udHJhY3RBZGRyZXNzLAogICAgICAgICAgICBvdXRfdG9rZW46IENvbnRyYWN0QWRkcmVzcywKICAgICAgICAgICAgYXNzZXRzOiB1MjU2LAogICAgICAgICAgICBub3RlX2lkOiBmZWx0MjUyLAogICAgICAgICkgLT4gU3BhbjxPcGVuTm90ZURlcG9zaXQ+IHsKICAgICAgICAgICAgYXNzZXJ0KGluX3Rva2VuLmlzX25vbl96ZXJvKCksIGVycm9yczo6WkVST19JTl9UT0tFTik7CiAgICAgICAgICAgIGFzc2VydChvdXRfdG9rZW4uaXNfbm9uX3plcm8oKSwgZXJyb3JzOjpaRVJPX09VVF9UT0tFTik7CiAgICAgICAgICAgIGFzc2VydChhc3NldHMuaXNfbm9uX3plcm8oKSwgZXJyb3JzOjpaRVJPX0FTU0VUUyk7CiAgICAgICAgICAgIGFzc2VydChpbl90b2tlbiAhPSBvdXRfdG9rZW4sIGVycm9yczo6VE9LRU5TX0VRVUFMKTsKCiAgICAgICAgICAgIGxldCBzZWxmX2FkZHIgPSBnZXRfY29udHJhY3RfYWRkcmVzcygpOwogICAgICAgICAgICBsZXQgcHJpdmFjeV9hZGRyID0gZ2V0X2NhbGxlcl9hZGRyZXNzKCk7CiAgICAgICAgICAgIGxldCBpbl9lcmMyMCA9IElFUkMyMERpc3BhdGNoZXIgeyBjb250cmFjdF9hZGRyZXNzOiBpbl90b2tlbiB9OwogICAgICAgICAgICBsZXQgb3V0X2VyYzIwID0gSUVSQzIwRGlzcGF0Y2hlciB7IGNvbnRyYWN0X2FkZHJlc3M6IG91dF90b2tlbiB9OwoKICAgICAgICAgICAgLy8gR2V0IG91dHB1dCB0b2tlbiBiYWxhbmNlIGJlZm9yZSBvcGVyYXRpb24uCiAgICAgICAgICAgIGxldCBiYWxhbmNlX2JlZm9yZSA9IG91dF9lcmMyMC5iYWxhbmNlX29mKGFjY291bnQ6IHNlbGZfYWRkcik7CgogICAgICAgICAgICAvLyBFeGVjdXRlIG9wZXJhdGlvbi4KICAgICAgICAgICAgLy8gUmV0dXJuIHZhbHVlIChtaW50ZWQvYnVybmVkIHNoYXJlcykgaXMgaWdub3JlZC4KICAgICAgICAgICAgbWF0Y2ggb3BlcmF0aW9uIHsKICAgICAgICAgICAgICAgIExlbmRpbmdPcGVyYXRpb246OkRlcG9zaXQgPT4gewogICAgICAgICAgICAgICAgICAgIC8vIEFwcHJvdmUgVmVzdSBUb2tlbiBjb250cmFjdCB0byBzcGVuZCBgYXNzZXRzYCBvZiBgaW5fdG9rZW5gLgogICAgICAgICAgICAgICAgICAgIGluX2VyYzIwLmFwcHJvdmUoc3BlbmRlcjogb3V0X3Rva2VuLCBhbW91bnQ6IGFzc2V0cyk7CiAgICAgICAgICAgICAgICAgICAgSVZUb2tlbkRpc3BhdGNoZXIgeyBjb250cmFjdF9hZGRyZXNzOiBvdXRfdG9rZW4gfQogICAgICAgICAgICAgICAgICAgICAgICAuZGVwb3NpdCg6YXNzZXRzLCByZWNlaXZlcjogc2VsZl9hZGRyKQogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICAgIExlbmRpbmdPcGVyYXRpb246OldpdGhkcmF3ID0+IHsKICAgICAgICAgICAgICAgICAgICBJVlRva2VuRGlzcGF0Y2hlciB7IGNvbnRyYWN0X2FkZHJlc3M6IGluX3Rva2VuIH0KICAgICAgICAgICAgICAgICAgICAgICAgLndpdGhkcmF3KDphc3NldHMsIHJlY2VpdmVyOiBzZWxmX2FkZHIsIG93bmVyOiBzZWxmX2FkZHIpCiAgICAgICAgICAgICAgICB9LAogICAgICAgICAgICB9CgogICAgICAgICAgICAvLyBBc3NlcnQgb3V0cHV0IGFtb3VudCBpcyBjb3JyZWN0LgogICAgICAgICAgICBsZXQgYmFsYW5jZV9hZnRlciA9IG91dF9lcmMyMC5iYWxhbmNlX29mKGFjY291bnQ6IHNlbGZfYWRkcik7CiAgICAgICAgICAgIGxldCBvdXRfYW1vdW50OiB1MTI4ID0gKGJhbGFuY2VfYWZ0ZXIgLSBiYWxhbmNlX2JlZm9yZSkKICAgICAgICAgICAgICAgIC50cnlfaW50bygpCiAgICAgICAgICAgICAgICAuZXhwZWN0KGVycm9yczo6UkVDRUlWRURfQU1PVU5UX09WRVJGTE9XKTsKICAgICAgICAgICAgYXNzZXJ0KG91dF9hbW91bnQuaXNfbm9uX3plcm8oKSwgZXJyb3JzOjpaRVJPX09VVF9BTU9VTlQpOwoKICAgICAgICAgICAgLy8gQXBwcm92ZSBjYWxsZXIgKHByaXZhY3kgY29udHJhY3QpIHRvIHRyYW5zZmVyIHJlY2VpdmVkIG91dHB1dCBmdW5kcy4KICAgICAgICAgICAgb3V0X2VyYzIwLmFwcHJvdmUoc3BlbmRlcjogcHJpdmFjeV9hZGRyLCBhbW91bnQ6IG91dF9hbW91bnQuaW50bygpKTsKCiAgICAgICAgICAgIC8vIFJldHVybnMgZGVwb3NpdCB0byBvcGVuIG5vdGUgaW5wdXQuCiAgICAgICAgICAgIFtPcGVuTm90ZURlcG9zaXQgeyBub3RlX2lkLCB0b2tlbjogb3V0X3Rva2VuLCBhbW91bnQ6IG91dF9hbW91bnQgfV0uc3BhbigpCiAgICAgICAgfQogICAgfQp9Cg==",
  },
]

const html = `<p>The Vesu lending helper connects the privacy pool to
<a href="https://vesu.xyz">Vesu</a>, a permissionless lending protocol whose pools are
ERC-4626 / SNIP-22 tokenized vaults: deposit underlying assets, receive vToken
shares; withdraw by burning shares. This is the reference anonymizer contract used in
the official Starknet Privacy docs. It is a reference example: review and
adoption of the Vesu route remain with the app team, and the integration is
in progress.</p>
<p>Two operations, one entry point:</p>
<ul>
<li><strong>Deposit</strong> - underlying → vToken shares. <code>out_token</code> is the vault; the helper
approves it, calls <code>deposit</code>, and the minted shares land in an open note.</li>
<li><strong>Withdraw</strong> - vToken shares → underlying. <code>in_token</code> is the vault; the helper
calls <code>withdraw</code> and the returned assets land in an open note.</li>
</ul>
<p>Your position in the vault is itself a private note holding vTokens - the yield
accrues to a position nobody can attribute to you.</p>
<pre><code class="language-cairo"><span class="hljs-comment">// Adapted from starknet-privacy packages/vesu_lending_anonymizer/src/vesu_lending_anonymizer.cairo</span>
<span class="hljs-comment">// (Apache-2.0, StarkWare)</span>
<span class="hljs-keyword">use</span> privacy::objects::OpenNoteDeposit;
<span class="hljs-keyword">use</span> starknet::ContractAddress;

<span class="hljs-comment">/// Interface for a Vesu vToken vault (ERC-4626 / SNIP-22 compatible).</span>
<span class="hljs-meta">#[starknet::interface]</span>
<span class="hljs-keyword">pub</span> <span class="hljs-keyword">trait</span> <span class="hljs-title class_">IVToken</span>&lt;T&gt; {
    <span class="hljs-comment">/// Deposits assets into the pool and mints vTokens (shares) to the receiver.</span>
    <span class="hljs-keyword">fn</span> <span class="hljs-title function_">deposit</span>(<span class="hljs-keyword">ref</span> <span class="hljs-keyword">self</span>: T, assets: u256, receiver: ContractAddress) <span class="hljs-punctuation">-&gt;</span> u256;
    <span class="hljs-comment">/// Withdraws assets from the pool and burns vTokens (shares) from the owner.</span>
    <span class="hljs-keyword">fn</span> <span class="hljs-title function_">withdraw</span>(
        <span class="hljs-keyword">ref</span> <span class="hljs-keyword">self</span>: T, assets: u256, receiver: ContractAddress, owner: ContractAddress,
    ) <span class="hljs-punctuation">-&gt;</span> u256;
}

<span class="hljs-comment">/// Lending operation to perform on a Vesu vault.</span>
<span class="hljs-meta">#[derive(Serde, Copy, Drop, PartialEq, Debug)]</span>
<span class="hljs-keyword">pub</span> <span class="hljs-keyword">enum</span> <span class="hljs-title class_">LendingOperation</span> {
    Deposit,
    Withdraw,
}

<span class="hljs-meta">#[starknet::interface]</span>
<span class="hljs-keyword">pub</span> <span class="hljs-keyword">trait</span> <span class="hljs-title class_">IVesuLendingHelper</span>&lt;T&gt; {
    <span class="hljs-comment">/// Executes a lending operation on the Vesu lending pool.</span>
    <span class="hljs-comment">///</span>
    <span class="hljs-comment">/// Called by the privacy contract via the \`INVOKE_SELECTOR\`.</span>
    <span class="hljs-comment">///</span>
    <span class="hljs-comment">/// - \`operation\` - The lending operation to perform.</span>
    <span class="hljs-comment">/// - \`in_token\` - The token address of the input funds (on withdraw: the vToken).</span>
    <span class="hljs-comment">/// - \`out_token\` - The token address of the output funds (on deposit: the vToken).</span>
    <span class="hljs-comment">/// - \`assets\` - Amount of assets to deposit/withdraw.</span>
    <span class="hljs-comment">/// - \`note_id\` - The identifier of the open note to deposit the output to.</span>
    <span class="hljs-keyword">fn</span> <span class="hljs-title function_">privacy_invoke</span>(
        <span class="hljs-keyword">ref</span> <span class="hljs-keyword">self</span>: T,
        operation: LendingOperation,
        in_token: ContractAddress,
        out_token: ContractAddress,
        assets: u256,
        note_id: felt252,
    ) <span class="hljs-punctuation">-&gt;</span> Span&lt;OpenNoteDeposit&gt;;
}

<span class="hljs-comment">/// Error codes for Vesu lending operations.</span>
<span class="hljs-keyword">pub</span> <span class="hljs-keyword">mod</span> errors {
    <span class="hljs-keyword">pub</span> <span class="hljs-keyword">const</span> ZERO_IN_TOKEN: felt252 = <span class="hljs-symbol">&#x27;ZERO_IN_TOKE</span>N<span class="hljs-string">&#x27;;
    pub const ZERO_OUT_TOKEN: felt252 = &#x27;</span>ZERO_OUT_TOKEN<span class="hljs-string">&#x27;;
    pub const ZERO_ASSETS: felt252 = &#x27;</span>ZERO_ASSETS<span class="hljs-string">&#x27;;
    pub const TOKENS_EQUAL: felt252 = &#x27;</span>TOKENS_EQUAL<span class="hljs-string">&#x27;;
    pub const RECEIVED_AMOUNT_OVERFLOW: felt252 = &#x27;</span>RECEIVED_AMOUNT_OVERFLOW<span class="hljs-string">&#x27;;
    pub const ZERO_OUT_AMOUNT: felt252 = &#x27;</span>ZERO_OUT_AMOUNT<span class="hljs-string">&#x27;;
}

/// Vesu lending anonymizer contract that performs Vesu deposit/withdraw on behalf of the privacy
/// contract.
#[starknet::contract]
pub mod VesuLendingHelper {
    use core::num::traits::Zero;
    use openzeppelin::interfaces::token::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use privacy::objects::OpenNoteDeposit;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use super::{
        IVTokenDispatcher, IVTokenDispatcherTrait, IVesuLendingHelper, LendingOperation, errors,
    };

    #[storage]
    struct Storage {}

    #[constructor]
    fn constructor(ref self: ContractState) {}

    #[abi(embed_v0)]
    pub impl VesuLendingHelperImpl of IVesuLendingHelper&lt;ContractState&gt; {
        fn privacy_invoke(
            ref self: ContractState,
            operation: LendingOperation,
            in_token: ContractAddress,
            out_token: ContractAddress,
            assets: u256,
            note_id: felt252,
        ) -&gt; Span&lt;OpenNoteDeposit&gt; {
            assert(in_token.is_non_zero(), errors::ZERO_IN_TOKEN);
            assert(out_token.is_non_zero(), errors::ZERO_OUT_TOKEN);
            assert(assets.is_non_zero(), errors::ZERO_ASSETS);
            assert(in_token != out_token, errors::TOKENS_EQUAL);

            let self_addr = get_contract_address();
            let privacy_addr = get_caller_address();
            let in_erc20 = IERC20Dispatcher { contract_address: in_token };
            let out_erc20 = IERC20Dispatcher { contract_address: out_token };

            // Get output token balance before operation.
            let balance_before = out_erc20.balance_of(account: self_addr);

            // Execute operation.
            // Return value (minted/burned shares) is ignored.
            match operation {
                LendingOperation::Deposit =&gt; {
                    // Approve Vesu Token contract to spend \`assets\` of \`in_token\`.
                    in_erc20.approve(spender: out_token, amount: assets);
                    IVTokenDispatcher { contract_address: out_token }
                        .deposit(:assets, receiver: self_addr)
                },
                LendingOperation::Withdraw =&gt; {
                    IVTokenDispatcher { contract_address: in_token }
                        .withdraw(:assets, receiver: self_addr, owner: self_addr)
                },
            }

            // Assert output amount is correct.
            let balance_after = out_erc20.balance_of(account: self_addr);
            let out_amount: u128 = (balance_after - balance_before)
                .try_into()
                .expect(errors::RECEIVED_AMOUNT_OVERFLOW);
            assert(out_amount.is_non_zero(), errors::ZERO_OUT_AMOUNT);

            // Approve caller (privacy contract) to transfer received output funds.
            out_erc20.approve(spender: privacy_addr, amount: out_amount.into());

            // Returns deposit to open note input.
            [OpenNoteDeposit { note_id, token: out_token, amount: out_amount }].span()
        }
    }
}
</span>
</code></pre><h2 id="things-to-notice">Things to notice</h2>
<ul>
<li><strong>Same skeleton as the swap helper</strong> - validate inputs, snapshot the output
balance, do the external call, credit the delta. Only the middle differs.</li>
<li><strong>Stateless and permissionless</strong> - unlike the escrow, this helper has no
storage and no pinned pool address; it trusts only the balance delta and
approves whoever called it. Anything it holds mid-transaction is pulled by the
pool in the same transaction.</li>
<li><strong>Directionality via token roles</strong> - deposit puts the vault at <code>out_token</code>,
withdraw puts it at <code>in_token</code>. One signature covers both directions.</li>
<li><strong>Shares return value ignored</strong> - the ERC-4626 return value is discarded in
favor of the measured delta, for the same reasons as the swap helper.</li>
<li><strong><code>u256</code> assets, <code>u128</code> note amounts</strong> - vault math is <code>u256</code>; the credited
delta must fit a note&#39;s 128-bit amount or the call reverts.</li>
</ul>
<p>Next: <a href="/helpers/escrow">Escrow</a> - an unofficial worked example of a <em>stateful</em>
helper with its own commitment scheme.</p>
`

export default html
