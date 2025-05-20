"use client";

import { useState } from "react";
import {
  MessageCircle,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useNotification } from "./notification-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormMode = "login" | "register";

export default function AuthForm({ mode }: { mode: FormMode }) {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  // const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      if (formData.password !== formData.confirmPassword) {
        showNotification(
          "error",
          "The passwords you entered do not match. Please try again.",
          "Password Mismatch"
        );
        setLoading(false);
        return;
      }
    }

    setTimeout(() => {
      setLoading(false);
      showNotification(
        "success",
        mode === "login"
          ? "You have successfully signed in to your account."
          : "Your account has been created successfully. Welcome to TKL-CHAT!",
        mode === "login" ? "Welcome back!" : "Account created!"
      );

      // Redirect to dashboard
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full
                        bg-[var(--foreground)] text-[var(--background)] mb-4"
            >
              <MessageCircle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font bold">TKL-CHAT</h1>
            <h2 className="mt-2 text-xl font-medium text-[var(--foreground)]">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-[var(--foreground)]">
              {mode === "login"
                ? "Sign in to continue to your account"
                : "Join TKL-CHAT and start connecting with others"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "login" ? (
              <div className="space-y-5">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email or Username
                  </label>

                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center
                                        pointer-events-none"
                    >
                      <Mail className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                    rounded-lg focus:outline-none focus: ring-2 focus:ring-[var(--foreground)]
                    focus:border-transparent transition-all text-[var(--foreground)] font-medium"
                      placeholder="Enter your email or username"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center
                    pointer-events-none"
                    >
                      <Lock className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                    rounded-lg focus:outline-none focus: ring-2 focus:ring-[var(--foreground)]
                    focus:border-transparent transition-all text-[var(--foreground)] font-medium"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="relative">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-2"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center
                                        pointer-events-none"
                    >
                      <User className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                    rounded-lg focus:outline-none focus: ring-2 focus:ring-[var(--foreground)]
                    focus:border-transparent transition-all text-[var(--foreground)] font-medium"
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center
                                        pointer-events-none"
                    >
                      <Mail className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                    rounded-lg focus:outline-none focus: ring-2 focus:ring-[var(--foreground)]
                    focus:border-transparent transition-all text-[var(--foreground)] font-medium"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center
                                        pointer-events-none"
                    >
                      <Phone className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                    rounded-lg focus:outline-none focus: ring-2 focus:ring-[var(--foreground)]
                    focus:border-transparent transition-all text-[var(--foreground)] font-medium"
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center
                                        pointer-events-none"
                    >
                      <Lock className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                    rounded-lg focus:outline-none focus: ring-2 focus:ring-[var(--foreground)]
                    focus:border-transparent transition-all text-[var(--foreground)] font-medium"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <div
                      className="absolute inset-y-0 left-0 pl-3 flex items-center
                                        pointer-events-none"
                    >
                      <Lock className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="confirmPassword"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                    rounded-lg focus:outline-none focus: ring-2 focus:ring-[var(--foreground)]
                    focus:border-transparent transition-all text-[var(--foreground)] font-medium"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[var(--foreground)]
                text-[var(--background)] rounded-lg font-medium transition-colors hover:opacity-90 focus:outline-none
                focus:ring-2 focus:ring-offset-2 focus:ring-[var(--foreground)]"
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent border-[var(--background)]
                     rounded-full animate-spin"
                  ></div>
                ) : (
                  <>
                    <span>
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[var(--muted-foreground)]">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link
                href={mode === "login" ? "/register" : "/login"}
                className="ml-1 text-[var(--foreground)] font-medium hover:underline"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center p-12 border-l border-[var(--border-color)]">
        <div className="max-w-md text-center">
          <div className="mb-6">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full
                        bg-[var(--foreground)] text-[var(--background)] mb-4"
            >
              <MessageCircle className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {mode === "login"
              ? "Welcome back to TKL-CHAT"
              : "Join TKL-CHAT today"}
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8">
            {mode === "login"
              ? `Connect with your friends, family, and colleagues securely with end to end 
                encryption`
              : `Create an account to enjoy secure messaging, group chats, and more with TKL-CHAT`}
          </p>

          <div className="space-y-4">
            <div className="flex items-center p-3 border border-[var(--border-color)] rounded-lg shadow-sm">
              <div
                className="w-10 h-10 rounded-full bg-[var(--user1-color)] flex items-center justify-center
                    flex-shirnk-0"
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium"> End-to-end encryption</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Your messages are secure and private
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-[var(--border-color)] rounded-lg shadow-sm">
              <div
                className="w-10 h-10 rounded-full bg-[var(--user1-color)] flex items-center justify-center
                    flex-shirnk-0"
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium">Group chats</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Connect with mutliple people at once
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 border border-[var(--border-color)] rounded-lg shadow-sm">
              <div
                className="w-10 h-10 rounded-full bg-[var(--user1-color)] flex items-center justify-center
                    flex-shirnk-0"
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium">Available everywhere</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Access your chats on any device
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
