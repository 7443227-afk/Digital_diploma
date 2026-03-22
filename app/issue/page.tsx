"use client";

import { useState } from "react";
import { getBrowserContract, hashDocument } from "@/lib/diplomaContract";

type IssueForm = {
  student: string;
  diplomaId: string;
  studentName: string;
  degree: string;
  issuerName: string;
  year: string;
  documentInput: string;
};

export default function IssuePage() {
  const [form, setForm] = useState<IssueForm>({
    student: "",
    diplomaId: "",
    studentName: "",
    degree: "",
    issuerName: "",
    year: "",
    documentInput: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    txHash: string;
    tokenId?: string;
    documentHash: string;
  } | null>(null);

  const setField = (field: keyof IssueForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (
      !form.student ||
      !form.diplomaId ||
      !form.studentName ||
      !form.degree ||
      !form.issuerName ||
      !form.year ||
      !form.documentInput
    ) {
      throw new Error("Please fill all fields.");
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(form.student.trim())) {
      throw new Error("Student wallet must be a valid EVM address.");
    }

    const yearNum = Number(form.year);
    if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > 9999) {
      throw new Error("Year must be between 1900 and 9999.");
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess(null);
    setLoading(true);

    try {
      validate();

      const { contract } = await getBrowserContract({ withSigner: true });
      const documentHash = hashDocument(form.documentInput);

      const tx = await contract.issueDiploma(
        form.student.trim(),
        form.diplomaId.trim(),
        form.studentName.trim(),
        form.degree.trim(),
        form.issuerName.trim(),
        Number(form.year),
        documentHash
      );

      await tx.wait();
      const totalSupply = await contract.totalSupply();

      setSuccess({
        txHash: tx.hash,
        tokenId: totalSupply.toString(),
        documentHash,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Issue failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Issue Diploma</h1>

      <div className="flex flex-col gap-4">
        <input
          placeholder="Student Wallet Address (0x...)"
          className="border p-3 rounded"
          value={form.student}
          onChange={(e) => setField("student", e.target.value)}
        />

        <input
          placeholder="Diploma ID"
          className="border p-3 rounded"
          value={form.diplomaId}
          onChange={(e) => setField("diplomaId", e.target.value)}
        />

        <input
          placeholder="Student Name"
          className="border p-3 rounded"
          value={form.studentName}
          onChange={(e) => setField("studentName", e.target.value)}
        />

        <input
          placeholder="Issuer Name (University)"
          className="border p-3 rounded"
          value={form.issuerName}
          onChange={(e) => setField("issuerName", e.target.value)}
        />

        <input
          placeholder="Degree"
          className="border p-3 rounded"
          value={form.degree}
          onChange={(e) => setField("degree", e.target.value)}
        />

        <input
          placeholder="Year"
          className="border p-3 rounded"
          value={form.year}
          onChange={(e) => setField("year", e.target.value)}
        />

        <textarea
          placeholder="Document content / fingerprint source (string to hash)"
          className="border p-3 rounded min-h-24"
          value={form.documentInput}
          onChange={(e) => setField("documentInput", e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black text-white p-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Issuing..." : "🎓 Issue Diploma"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {success && (
          <div className="mt-2 p-4 border rounded bg-green-50 text-sm">
            <p className="font-semibold">✅ Diploma issued successfully</p>
            {success.tokenId && <p><b>Token ID:</b> {success.tokenId}</p>}
            <p><b>Tx Hash:</b> {success.txHash}</p>
            <p><b>Document Hash:</b> {success.documentHash}</p>
          </div>
        )}
      </div>
    </main>
  );
}