'use client'

import type React from 'react'

import { useState } from 'react'
import { UserIcon, Camera } from 'lucide-react'
import { User } from '@/lib/db-types'
import { useUser } from '@/app/components/user-provider'
import Image from 'next/image'

export default function ProfilePage() {
  const { user } = useUser()

  if (!user) {
    throw new Error('User must be defined at this point')
  }
  const [profile, setProfile] = useState<User>(user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProfile(formData)
    setIsEditing(false)
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg p-10 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center sm:items-start mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[var(--user2-color)] flex items-center justify-center">
              {profile.profile_pic ? (
                <Image
                  src={profile.profile_pic}
                  alt={profile.username}
                  className="w-full h-full rounded-full"
                  width={760}
                  height={760}
                />
              ) : (
                <UserIcon className="w-12 h-12 text-white" />
              )}
            </div>
            {isEditing && (
              <button
                className="absolute bottom-0 right-0 bg-[var(--foreground)] text-[var(--background)]
                            p-1 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">{profile.username}</h2>
            <p className="text-[var(--muted-foreground)] mb-4">
              {profile.email}
            </p>
            <p className="text-sm">{profile.bio || 'No bio provided'}</p>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md 
              hover:bg-[var(--hover-dark)] dark:hover:bg-[var(--hover-light-mode)] transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md
                                focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md
                                focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                />
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md
                                focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-md
                                focus:outline-none focus:ring-1 focus:ring-[var(--foreground)]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(profile)
                  }}
                  className="px-4 py-2 border border-[var(--border-color)] rounded-md
                            hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)] 
                            hover:border-transparent"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md
                            hover:bg-[var(--hover-dark)] dark:hover:bg-[var(--hover-light-mode)]
                            transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="border-t border-[var(--border-color)] pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-medium mb-2">Contact Information</h3>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[var(--muted-foreground)]">Email:</span>
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[var(--muted-foreground)]">Phone:</span>
                <span>{profile.phone_number}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
