import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        🎓 Digital Diploma
      </h1>

      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
        Issue and verify academic credentials securely using blockchain technology.
      </p>

      <div className="flex gap-4">
        <Link
          href="/issue"
          className="px-6 py-3 bg-black text-white rounded-xl"
        >
          Issue Diploma
        </Link>

        <Link
          href="/verify"
          className="px-6 py-3 border rounded-xl"
        >
          Verify Diploma
        </Link>
      </div>
    </main>
  );
}