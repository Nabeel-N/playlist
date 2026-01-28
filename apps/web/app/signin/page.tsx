"use client";

export default function Signin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-950 via-black to-fuchsia-950 p-4">
      {/* Main content card */}
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/20 opacity-50" />

          <div className="relative p-8 sm:p-12">
            {/* Logo or app name */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome back
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Sign in to continue to your account
              </p>
            </div>

            {/* Google sign-in button */}
            <button
              onClick={() => {
                window.location.href = "http://localhost:8080/auth/google";
              }}
              className="group relative w-full overflow-hidden rounded-xl bg-white px-6 py-4 font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/20 active:scale-[0.98]"
            >
              <div className="flex items-center justify-center gap-3">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-base">Continue with Google</span>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-xs font-medium text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/20 to-transparent" />
            </div>

            {/* Additional options */}
            <div className="text-center">
              <button className="text-sm text-gray-400 transition-colors hover:text-white">
                Continue as guest
              </button>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our{" "}
          <a
            href="#"
            className="text-gray-400 underline decoration-gray-600 transition-colors hover:text-white"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-gray-400 underline decoration-gray-600 transition-colors hover:text-white"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
