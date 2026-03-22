import {
  BrowserProvider,
  Contract,
  keccak256,
  toUtf8Bytes,
  type Eip1193Provider,
} from "ethers";

export const DIPLOMA_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_DIPLOMA_CONTRACT_ADDRESS ?? "";

export const DIPLOMA_CONTRACT_ABI = [
  "function issueDiploma(address student,string diplomaId,string studentName,string degree,string issuerName,uint16 year,bytes32 documentHash) external returns (uint256 tokenId)",
  "function getDiploma(uint256 tokenId) external view returns (address student,string diplomaId,string studentName,string degree,string issuerName,uint16 year,bytes32 documentHash,bool revoked)",
  "function verifyDiploma(uint256 tokenId, bytes32 providedHash) external view returns (bool exists, bool valid, bool revoked)",
  "function totalSupply() external view returns (uint256)",
  "event DiplomaIssued(uint256 indexed tokenId, address indexed issuer, string diplomaId, bytes32 documentHash)",
] as const;

export function hashDocument(input: string): string {
  return keccak256(toUtf8Bytes(input.trim()));
}

export async function getBrowserContract({
  withSigner = false,
}: {
  withSigner?: boolean;
}) {
  if (typeof window === "undefined") {
    throw new Error("Wallet not found. Install MetaMask.");
  }

  const ethereum = (window as Window & { ethereum?: Eip1193Provider }).ethereum;
  if (!ethereum) {
    throw new Error("Wallet not found. Install MetaMask.");
  }

  if (!DIPLOMA_CONTRACT_ADDRESS) {
    throw new Error(
      "Missing NEXT_PUBLIC_DIPLOMA_CONTRACT_ADDRESS in environment variables."
    );
  }

  const provider = new BrowserProvider(ethereum);
  const signerOrProvider = withSigner ? await provider.getSigner() : provider;
  const contract = new Contract(
    DIPLOMA_CONTRACT_ADDRESS,
    DIPLOMA_CONTRACT_ABI,
    signerOrProvider
  );

  return { provider, contract };
}
