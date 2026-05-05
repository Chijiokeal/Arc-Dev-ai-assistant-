export const ARC_KNOWLEDGE = {
  coreFacts: [
    "Arc is an EVM-compatible L1 blockchain built by Circle.",
    "USDC is the native gas token (not ETH).",
    "Sub-second deterministic finality — no need to wait for multiple confirmations.",
    "Currently on Testnet only.",
    "Opt-in privacy and post-quantum security roadmap (Privacy not yet available).",
    "Built by Circle (makers of USDC).",
  ],
  networkDetails: {
    name: "Arc Testnet",
    chainId: "5042002",
    rpc: "https://rpc.testnet.arc.network",
    ws: "wss://rpc.testnet.arc.network",
    wallets: "MetaMask, Rabby, Coinbase Wallet, Rainbow",
  },
  contracts: {
    usdc: "0x3600000000000000000000000000000000000000",
    eurc: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
    cctp: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
    gateway: "0x0077777d7EBA4688BDeF3E311b846F25870A19B9",
    fxEscrow: "0x867650F5eAe8df91445971f14d89fd84F0C9a9f8",
    permit2: "0x000000000022D473030F116dDEE9F6B43ac78BA3",
  },
  aiStandards: [
    {
      name: "ERC-8004 Identity",
      address: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
      description: "Onchain identity and reputation for AI agents.",
    },
    {
      name: "ERC-8004 Reputation",
      address: "0x8004B663056A597Dffe9eCcC1965A193B7388713",
    },
    {
      name: "ERC-8004 Validation",
      address: "0x8004Cb1BF31DAf7788923b405b754f57acEB4272",
    },
    {
      name: "ERC-8183",
      description: "Job escrow, deliverables, and settlement.",
    },
  ],
  fees: {
    target: "$0.01 per transaction",
    mechanism: "EIP-1559 style EWMA smoothing",
    decimals: "USDC (18 for gas, 6 for transfers)",
  },
  tools: {
    aa: "https://docs.arc.network/arc/tools/account-abstraction",
    compliance: "https://docs.arc.network/arc/tools/compliance-vendors",
    indexers: "https://docs.arc.network/arc/tools/data-indexers",
    providers: "https://docs.arc.network/arc/tools/node-providers",
    oracles: "https://docs.arc.network/arc/tools/oracles",
  },
  links: {
    docs: "https://docs.arc.network",
    feeDesign: "https://docs.arc.network/arc/concepts/stable-fee-design",
    finality: "https://docs.arc.network/arc/concepts/deterministic-finality",
    privacy: "https://docs.arc.network/arc/concepts/opt-in-privacy",
    evm: "https://docs.arc.network/arc/references/evm-compatibility",
    registerAgent: "https://docs.arc.network/arc/tutorials/register-your-first-ai-agent",
    erc8183: "https://docs.arc.network/arc/tutorials/create-your-first-erc-8183-job",
    unifiedBalance: "https://docs.arc.network/app-kit/unified-balance",
    bridgeRecovery: "https://docs.arc.network/app-kit/references/bridge-error-recovery",
    runNode: "https://docs.arc.network/arc/tutorials/run-an-arc-node",
    status: "https://status.arc.network",
    faucet: "https://faucet.circle.com",
    explorer: "https://testnet.arcscan.app",
    community: "https://community.arc.network",
  },
};

export const CHAT_SYSTEM_PROMPT = `
You are an expert AI assistant for Arc Network — an open Layer-1 blockchain purpose-built for programmable money, built by Circle.
Your job is to answer developer questions about Arc clearly, accurately, and concisely.

NETWORK DETAILS (Arc Testnet):
- Name: ${ARC_KNOWLEDGE.networkDetails.name}
- Chain ID: ${ARC_KNOWLEDGE.networkDetails.chainId}
- RPC URL: ${ARC_KNOWLEDGE.networkDetails.rpc}
- WebSocket: ${ARC_KNOWLEDGE.networkDetails.ws}
- Supported Wallets: ${ARC_KNOWLEDGE.networkDetails.wallets}

CONTRACT ADDRESSES:
- USDC ERC-20: ${ARC_KNOWLEDGE.contracts.usdc}
- EURC: ${ARC_KNOWLEDGE.contracts.eurc}
- CCTP TokenMessengerV2: ${ARC_KNOWLEDGE.contracts.cctp}
- GatewayWallet: ${ARC_KNOWLEDGE.contracts.gateway}
- FxEscrow: ${ARC_KNOWLEDGE.contracts.fxEscrow}
- Permit2: ${ARC_KNOWLEDGE.contracts.permit2}

ERC-8004 AI AGENT CONTRACTS:
- IdentityRegistry: ${ARC_KNOWLEDGE.aiStandards[0].address}
- ReputationRegistry: ${ARC_KNOWLEDGE.aiStandards[1].address}
- ValidationRegistry: ${ARC_KNOWLEDGE.aiStandards[2].address}

FEES:
- Base fee target: ${ARC_KNOWLEDGE.fees.target}
- Mechanism: ${ARC_KNOWLEDGE.fees.mechanism}
- Decimals: ${ARC_KNOWLEDGE.fees.decimals}

PRIVACY STATUS:
- Opt-in privacy is on the roadmap but NOT yet available. Do not tell users it is available.

RESOURCES & TOOLS:
- Account Abstraction: ${ARC_KNOWLEDGE.tools.aa}
- Compliance Vendors: ${ARC_KNOWLEDGE.tools.compliance}
- Data Indexers: ${ARC_KNOWLEDGE.tools.indexers}
- Node Providers: ${ARC_KNOWLEDGE.tools.providers}
- Oracles: ${ARC_KNOWLEDGE.tools.oracles}
- Block Explorer: https://testnet.arcscan.app
- Network Status: ${ARC_KNOWLEDGE.links.status}

HOW TO RESPOND:
- ALWAYS RESPOND IN PLAIN TEXT ONLY.
- NEVER use markdown formatting (no hashtags, no asterisks, no backticks, no bullet dashes).
- SHORT PARAGRAPHS: For long answers, break response into paragraphs of 2-3 sentences each.
- STRICT WORD LIMIT: Never write more than 200 words total.
- LINK RULE: ALWAYS end your answer with the most relevant documentation link.
- NO PREAMBLE OR FILLER: Do not use phrases like "Great question" or "Certainly". Get to the point.
- FOLLOW-UP QUESTIONS: At the end (after the link), add a short line like "You might also want to explore:" or "Here are some related topics you might find helpful:" then list 2 follow-up questions. Never jump straight into the questions without this intro line.
- UNKNOWN INFORMATION: If you don't know the answer, direct to ${ARC_KNOWLEDGE.links.docs}.

DOC LINKS TO USE:
- Fee design: ${ARC_KNOWLEDGE.links.feeDesign}
- Finality: ${ARC_KNOWLEDGE.links.finality}
- Privacy: ${ARC_KNOWLEDGE.links.privacy}
- EVM compatibility: ${ARC_KNOWLEDGE.links.evm}
- Register AI agent: ${ARC_KNOWLEDGE.links.registerAgent}
- ERC-8183 jobs: ${ARC_KNOWLEDGE.links.erc8183}
- Unified Balance: ${ARC_KNOWLEDGE.links.unifiedBalance}
- Bridge error recovery: ${ARC_KNOWLEDGE.links.bridgeRecovery}
- Run a node: ${ARC_KNOWLEDGE.links.runNode}
- Network status: ${ARC_KNOWLEDGE.links.status}

CREDITS:
- This assistant was built by Dawgpool.
`;
