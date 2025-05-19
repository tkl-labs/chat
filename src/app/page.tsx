"use client";
import {
  useState,
  type ReactNode,
  type ChangeEvent,
  type ButtonHTMLAttributes,
} from "react";
import { MessageCircle, Send, User, Menu, Search } from "lucide-react";
import Link from "next/link";

type AvatarProps = {
  children?: ReactNode;
  className?: string;
  userType?: "user1" | "user2" | "app";
};

type ButtonVariant = "default" | "ghost";
type ButtonSize = "default" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type InputProps = {
  className?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

type CardProps = {
  children: ReactNode;
  className?: string;
};

const Avatar = ({
  children,
  className = "",
  userType = "user1",
}: AvatarProps) => {
  const bgColor =
    userType === "user1"
      ? "bg-[var(--user1-color)]"
      : userType === "user2"
      ? "bg-[var(--user2-color)]"
      : "bg-[var(--foreground)]";

  return (
    <div
      className={`relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${bgColor} ${className}`}
    >
      {children ||
        (userType === "app" ? (
          <MessageCircle className="w-5 h-5 text-[var(--background)]" />
        ) : (
          <User className="w-5 h-5 text-white" />
        ))}
    </div>
  );
};

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: ButtonProps) => {
  const variantClasses: Record<ButtonVariant, string> = {
    default:
      "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--hover-dark)] dark:hover:bg-[var(--hover-light-mode)]",
    ghost:
      "bg-transparent hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)]",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10 p-2 flex items-center justify-center",
  };

  return (
    <button
      className={`rounded-full font-medium transition-colors flex items-center justify-center ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: InputProps) => (
  <input
    className={`h-10 px-3 py-2 rounded-md border border-[var(--border-color)] bg-[var(--background)] ${className}`}
    {...props}
  />
);

const Card = ({ children, className = "" }: CardProps) => (
  <div
    className={`rounded-lg border border-[var(--border-color)] bg-[var(--background)] shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: CardProps) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`p-4 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }: CardProps) => (
  <div className={`p-4 ${className}`}>{children}</div>
);

export default function Home() {
  const [message, setMessage] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div
        className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 
                  font-[family-name:var(--font-geist-sans)]"
      >
        <main className="flex flex-col gap-[32px] items-center sm:items-start max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-8 h-8" />
            <h1 className="text-3xl font-bold">TKL-CHAT</h1>
          </div>

          <p className="text-xl text-center sm:text-left">
            A modern, fast, and secure chat application built with Next.js +
            Rust
          </p>

          <ol
            className="list-inside list-decimal text-sm/6 text-center sm:text-left 
          font-[family-name:var(--font-geist-mono)]"
          >
            <li className="mb-2 tracking-[-.01em]">
              Real-time messaging with{" "}
              <code
                className="bg-[var(--muted-bg)] px-1 py-0.5 rounded 
              font-[family-name:var(--font-geist-mono)] font-semibold"
              >
                end-to-end encryption
              </code>
            </li>
            <li className="mb-2 tracking-[-.01em]">
              Group chats and direct messages with unlimited history
            </li>
            <li className="tracking-[-.01em]">
              Available on all your devices, always in sync
            </li>
          </ol>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link
              href={"/dashboard"}
              className="rounded-full border border-solid border-transparent transition-colors flex items-center 
              justify-center bg-[var(--foreground)] text-[var(--background)] gap-2 hover:bg-[var(--hover-dark)] 
              dark:hover:bg-[var(--hover-light-mode)] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 
              sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              Get Started
            </Link>
            <a
              className="rounded-full border border-solid border-[var(--border-color)] transition-colors 
              flex items-center justify-center hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)] 
              hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
              href="#"
            >
              Learn More
            </a>
          </div>
        </main>

        <footer className="flex flex-col gap-4 items-center justify-center">
          <div className="flex gap-[24px] flex-wrap items-center justify-center">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="#"
            >
              <User className="w-4 h-4" />
              Features
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="#"
            >
              <Search className="w-4 h-4" />
              Documentation
            </a>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} All rights reserved TKL-CHAT
          </p>
        </footer>
      </div>

      <div className="hidden lg:flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg border-black/10 dark:border-white/10">
          <CardHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar userType="app" />
                <div>
                  <h3 className="font-semibold">TKL-CHAT</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              <div className="flex items-start gap-2">
                <Avatar className="mt-1" userType="user1" />
                <div className="bg-[var(--muted-bg)] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-sm">
                    Hey there! Welcome to TKL-CHAT. How can I help you today?
                  </p>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    10:24 AM
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 justify-end">
                <div
                  className="bg-[var(--foreground)] text-[var(--background)] p-3 rounded-lg rounded-tr-none 
                max-w-[80%]"
                >
                  <p className="text-sm">
                    Hi! I am interested in learning more about the features of
                    TKL-CHAT.
                  </p>
                  <span className="text-xs opacity-70">10:26 AM</span>
                </div>
                <Avatar className="mt-1" userType="user2" />
              </div>

              <div className="flex items-start gap-2">
                <Avatar className="mt-1" userType="user1" />
                <div className="bg-[var(--muted-bg)] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-sm">
                    Of course! TKL-CHAT offers end-to-end encryption, group
                    chats, and syncs across all your devices.
                  </p>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    10:27 AM
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Avatar className="mt-1" userType="user1" />
                <div className="bg-[var(--muted-bg)] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-sm">
                    You can also share files and use our powerful search to find
                    any message.
                  </p>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    10:28 AM
                  </span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t p-4">
            <div className="flex items-center gap-2 w-full">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMessage(e.target.value)
                }
                className="flex-1"
              />
              <Button size="icon" className="rounded-full">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
