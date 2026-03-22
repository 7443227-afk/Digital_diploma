"use client";

import { useState } from "react";
import { getBrowserContract, hashDocument } from "@/lib/diplomaContract";

type VerifyState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "invalid"; revoked: boolean }
  | {
      kind: "valid";
      student: string;
      diplomaId: string;
      studentName: string;
      degree: string;
      issuerName: string;
      year: string;
      revoked: boolean;
      onChainHash: string;
      providedHash: string;
    }
  | { kind: "error"; message: string };

export default function VerifyPage() {
  const [tokenId, setTokenId] = useState("");
  const [documentInput, setDocumentInput] = useState("");
  const [result, setResult] = useState<VerifyState>({ kind: "idle" });

  const handleVerify = async () => {
    setResult({ kind: "loading" });

    try {
      const parsedId = Number(tokenId);
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        throw new Error("Token ID must be a positive integer.");
      }
      if (!documentInput.trim()) {
        throw new Error("Document input is required to compute hash.");
      }

      const { contract } = await getBrowserContract({ withSigner: false });
      const providedHash = hashDocument(documentInput);

      const [exists, valid, revoked] = await contract.verifyDiploma(
        parsedId,
        providedHash
      );

      if (!exists) {
        setResult({ kind: "not_found" });
        return;
      }

      if (!valid) {
        setResult({ kind: "invalid", revoked });
        return;
      }

      const diploma = await contract.getDiploma(parsedId);

      setResult({
        kind: "valid",
        student: diploma.student,
        diplomaId: diploma.diplomaId,
        studentName: diploma.studentName,
        degree: diploma.degree,
        issuerName: diploma.issuerName,
        year: diploma.year.toString(),
        revoked: diploma.revoked,
        onChainHash: diploma.documentHash,
        providedHash,
      });
    } catch (e: unknown) {
      setResult({
        kind: "error",
        message: e instanceof Error ? e.message : "Verification failed",
      });
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Verify Diploma</h1>

      <input
        placeholder="Enter Token ID"
        className="border p-3 rounded w-full mb-4"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
      />

      <textarea
        placeholder="Document content / fingerprint source (must match Issue input)"
        className="border p-3 rounded w-full mb-4 min-h-24"
        value={documentInput}
        onChange={(e) => setDocumentInput(e.target.value)}
      />

      <button
        onClick={handleVerify}
        disabled={result.kind === "loading"}
        className="bg-black text-white p-3 rounded-xl w-full"
      >
        {result.kind === "loading" ? "Verifying..." : "🔍 Verify"}
      </button>

      {result.kind === "not_found" && <p className="mt-4 text-red-500">❌ Diploma not found</p>}

      {result.kind === "invalid" && (
        <p className="mt-4 text-red-500">
          ❌ Diploma is invalid ({result.revoked ? "revoked" : "hash mismatch"})
        </p>
      )}

      {result.kind === "error" && (
        <p className="mt-4 text-red-500">⚠️ {result.message}</p>
      )}

      {result.kind === "valid" && (
        <div className="mt-4 p-4 border rounded">
          <p>✅ Valid Diploma</p>
          <p><b>Token ID:</b> {tokenId}</p>
          <p><b>Diploma ID:</b> {result.diplomaId}</p>
          <p><b>Student:</b> {result.studentName}</p>
          <p><b>Student Wallet:</b> {result.student}</p>
          <p><b>Degree:</b> {result.degree}</p>
          <p><b>Issuer:</b> {result.issuerName}</p>
          <p><b>Year:</b> {result.year}</p>
          <p><b>Revoked:</b> {result.revoked ? "Yes" : "No"}</p>
          <p><b>On-chain Hash:</b> {result.onChainHash}</p>
          <p><b>Provided Hash:</b> {result.providedHash}</p>
        </div>
      )}
    </main>
  );
}
