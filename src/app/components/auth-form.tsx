'use client'

import { useState } from 'react'
import {
  Mail,
  MessageCircle,
  User,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { useNotification } from '@/app/components/context/notification-provider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/axios'
import { AxiosError } from 'axios'

type FormMode = 'login' | 'register'

export default function AuthForm({ mode }: { mode: FormMode }) {
  const router = useRouter()
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    email: false,
    phone_number: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target

    let value = e.target.value

    if (!value.startsWith('+')) {
      value = '+' + value.replace(/\+/g, '')
    }

    value = '+' + value.slice(1).replace(/\D/g, '')

    setFormData((prev) => ({ ...prev, phone_number: value }))
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
  }

  const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9]{8,16}$/.test(username)
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPhoneNumber = (phone: string) => {
    return /^\+?[0-9]{7,15}$/.test(phone)
  }

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{12,64}$/.test(
      password,
    )
  }

  const doPasswordsMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword
  }

  let isFormValid = true
  if (mode === 'register') {
    isFormValid =
      isValidUsername(formData.username) &&
      isValidEmail(formData.email) &&
      isValidPhoneNumber(formData.phone_number) &&
      isValidPassword(formData.password) &&
      doPasswordsMatch(formData.password, formData.confirmPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (mode === 'register') {
      try {
        const response = await api.post('/auth/register', {
          username: formData.username,
          email: formData.email,
          phone_number: formData.phone_number,
          password: formData.password,
        })

        // at this point, registration was successful
        showNotification('success', response.data?.detail, 'Account created!')
        router.push('/dashboard')
      } catch (err) {
        const error = err as AxiosError<{ detail?: string }>
        const message = error.response?.data?.detail || 'Registration failed.'
        showNotification('error', message, 'Error')
      } finally {
        setLoading(false)
      }
    } else {
      try {
        const response = await api.post('/auth/login', {
          username: formData.username,
          password: formData.password,
        })

        // at this point, login was successful
        showNotification('success', response.data?.detail, 'Welcome back!')
        router.push('/dashboard')
      } catch (err) {
        const error = err as AxiosError<{ detail?: string }>
        const message = error.response?.data?.detail || 'Login failed.'
        showNotification('error', message, 'Error')
      } finally {
        setLoading(false)
      }
    }
  }

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
            <h1 className="text-3xl font bold">TKL Chat</h1>
            <h2 className="mt-2 text-xl font-medium text-[var(--foreground)]">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="mt-2 text-[var(--foreground)]">
              {mode === 'login'
                ? 'Sign in to continue to your account'
                : 'Join TKL Chat and start connecting with others'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'login' ? (
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
                      rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]
                      focus:border-transparent transition-all duration-300
                      text-[var(--foreground)] font-medium"
                      placeholder="Enter your username"
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
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-[var(--border-color)]
                      rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]
                      focus:border-transparent transition-all duration-300
                      text-[var(--foreground)] font-medium"
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
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>

                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 rounded-lg text-[var(--foreground)] font-medium
                      focus:outline-none focus:ring-1 transition-all duration-300 border
                      ${
                        touchedFields.username
                          ? isValidUsername(formData.username)
                            ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                            : 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                          : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                      }
                    `}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  <div className="mt-3 m-1 text-left">
                    <ul className="space-y-1 text-xs">
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.username &&
                          isValidUsername(formData.username)
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.username
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.username &&
                        isValidUsername(formData.username) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        8 to 16 alphanumeric characters only
                      </li>
                    </ul>
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
                      className={`block w-full pl-10 pr-3 py-3 rounded-lg text-[var(--foreground)] font-medium
                        focus:outline-none focus:ring-1 transition-all duration-300 border
                        ${
                          touchedFields.email
                            ? isValidEmail(formData.email)
                              ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                              : 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                            : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                        }
                      `}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="mt-3 m-1 text-left">
                    <ul className="space-y-1 text-xs">
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.email && isValidEmail(formData.email)
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.email
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.email &&
                        isValidUsername(formData.email) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Email is valid
                      </li>
                    </ul>
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
                      onChange={handlePhoneChange}
                      className={`block w-full pl-10 pr-3 py-3 rounded-lg text-[var(--foreground)] font-medium
                        focus:outline-none focus:ring-1 transition-all duration-300 border
                        ${
                          touchedFields.phone_number
                            ? isValidPhoneNumber(formData.phone_number)
                              ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                              : 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                            : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                        }
                      `}
                      placeholder="+447123456789"
                      required
                    />
                  </div>
                  <div className="mt-3 m-1 text-left">
                    <ul className="space-y-1 text-xs">
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.phone_number &&
                          isValidPhoneNumber(formData.phone_number)
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.phone_number
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.phone_number &&
                        isValidPhoneNumber(formData.phone_number) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Phone number is valid
                      </li>
                    </ul>
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
                      className={`block w-full pl-10 pr-3 py-3 rounded-lg text-[var(--foreground)] font-medium
                        focus:outline-none focus:ring-1 transition-all duration-300 border
                        ${
                          touchedFields.password
                            ? isValidPassword(formData.password)
                              ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                              : 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                            : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                        }
                      `}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>
                  <div className="mt-3 m-1 text-left">
                    <ul className="space-y-1 text-xs">
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.password &&
                          isValidPassword(formData.password)
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.password
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.password &&
                        isValidPassword(formData.password) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        12 to 64 characters
                      </li>
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.password &&
                          /[a-z]/.test(formData.password)
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.password
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.password &&
                        /[a-z]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        At least one lowercase letter
                      </li>
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.password &&
                          /[A-Z]/.test(formData.password)
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.password
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.password &&
                        /[A-Z]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        At least one uppercase letter
                      </li>
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.password && /\d/.test(formData.password)
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.password
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.password &&
                        /\d/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        At least one number
                      </li>
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.password &&
                          /[^a-zA-Z0-9]/.test(formData.password)
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.password
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.password &&
                        /[^a-zA-Z0-9]/.test(formData.password) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        At least one special character
                      </li>
                    </ul>
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
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 rounded-lg text-[var(--foreground)] font-medium
                        focus:outline-none focus:ring-1 transition-all duration-300 border
                        ${
                          touchedFields.confirmPassword
                            ? isValidPassword(formData.password) &&
                              doPasswordsMatch(
                                formData.password,
                                formData.confirmPassword,
                              )
                              ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                              : 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                            : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                        }
                      `}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  <div className="mt-3 m-1 text-left">
                    <ul className="space-y-1 text-xs">
                      <li
                        className={`flex items-center gap-2 font-medium ${
                          touchedFields.confirmPassword &&
                          isValidPassword(formData.password) &&
                          doPasswordsMatch(
                            formData.password,
                            formData.confirmPassword,
                          )
                            ? 'text-[var(--success-border-color)]'
                            : touchedFields.confirmPassword
                              ? 'text-[var(--error-border-color)]'
                              : 'text-[var(--muted-foreground)]'
                        }`}
                      >
                        {touchedFields.confirmPassword &&
                        isValidPassword(formData.password) &&
                        doPasswordsMatch(
                          formData.password,
                          formData.confirmPassword,
                        ) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Password is valid and matches
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors 
                  focus:outline-none focus:ring-1 focus:ring-offset-2
                  ${
                    !isFormValid
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : `bg-[var(--foreground)] cursor-pointer
                       text-[var(--background)] hover:opacity-90 focus:ring-[var(--foreground)]`
                  }
                `}
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent border-[var(--background)]
                     rounded-full animate-spin"
                  ></div>
                ) : (
                  <>
                    <span>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[var(--muted-foreground)]">
              {mode === 'login'
                ? "Don't have an account?"
                : 'Already have an account?'}
              <Link
                href={mode === 'login' ? '/register' : '/login'}
                className="ml-1 text-[var(--foreground)] font-medium hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
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
            {mode === 'login'
              ? 'Welcome back to TKL Chat'
              : 'Join TKL Chat today'}
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8">
            {mode === 'login'
              ? `Connect with your friends, family, and colleagues securely with end to end 
                encryption`
              : `Create an account to enjoy secure messaging, group chats, and more with TKL Chat`}
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
                className="w-10 h-10 rounded-full bg-[var(--user2-color)] flex items-center justify-center
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
                className="w-10 h-10 rounded-full bg-[var(--foreground)] flex items-center justify-center
                    flex-shirnk-0"
              >
                <User className="w-5 h-5 text-black" />
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
  )
}
