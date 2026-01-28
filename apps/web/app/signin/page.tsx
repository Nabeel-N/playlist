"use client";

export default function Signin() {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">Sign In</h1>
        <button
          onClick={() => {
            window.location.href = "http://localhost:8080/auth/google";
          }}
          className="rounded bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
