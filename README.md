# Digital Diploma UI

Frontend MVP for issuing and verifying digital diplomas on an EVM-compatible chain.

## Current scope

- `Issue`: sends an on-chain `issueDiploma(...)` transaction using MetaMask.
- `Verify`: reads `verifyDiploma(...)` and `getDiploma(...)` from the contract.
- Hashing: document input is hashed client-side via `keccak256(utf8(input))`.

## Prerequisites

- Node.js (for this UI: Node 20+ is fine)
- MetaMask (or compatible injected wallet)
- Deployed `DiplomaNFT` contract address

> Note: Hardhat in this repository currently requires Node 22.10+ for compile/deploy.

## 1) Install and run UI

```bash
cd /home/ubuntu/projects/blockchain/digital-diploma-ui
npm install
npm run dev
```

Open: http://localhost:3000

## 2) Configure contract address

Create `digital-diploma-ui/.env.local`:

```bash
NEXT_PUBLIC_DIPLOMA_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Restart the dev server after changing env vars.

## 3) Deploy contract (Hardhat + Ignition)

Contract files:
- `contracts/DiplomaNFT.sol`
- `ignition/modules/DiplomaNFT.ts`

Example deployment command (from repository root):

```bash
cd /home/ubuntu/projects/blockchain
npx hardhat ignition deploy ./ignition/modules/DiplomaNFT.ts --network sepolia
```

Then copy deployed address to `.env.local`.

## 4) Demo сценарий (3 шага)

1. Open `/issue`, connect wallet, fill all fields, submit.
2. Copy returned `Token ID` and keep same document input text.
3. Open `/verify`, paste token ID + same document input → `Valid Diploma`.

## Definition of Done checks (MVP)

- [ ] Issue works from UI and returns tx hash.
- [ ] Verify returns one of: `Valid`, `Not found`, `Invalid (revoked/hash mismatch)`.
- [ ] 3 test cases validated manually:
  - happy path issue→verify
  - invalid token ID
  - hash mismatch

## Known limitations

- No full ERC-721 metadata/tokenURI flow yet (minimal NFT-like storage contract).
- No backend/indexer yet (direct wallet + RPC interaction from browser).
- No automated test suite for UI yet.
