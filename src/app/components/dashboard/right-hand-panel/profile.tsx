'use client'

import React, { useEffect } from 'react'
import { useState, useRef, useCallback } from 'react'
import { UserIcon, Camera, Upload, ZoomIn, ZoomOut, Move } from 'lucide-react'
import Image from 'next/image'
import api from '@/lib/axios'
import { AxiosError } from 'axios'
import { useNotification } from '@/app/components/context/notification-provider'
import { Button } from '@/app/components/ui/buttons'

interface ProfileUpdatePayload {
  username?: string
  email?: string
  phone_number?: string
  bio?: string
  profile_pic?: string
}

interface CropState {
  x: number
  y: number
  zoom: number
  rotation: number
}

const defaultUser: ProfileUpdatePayload = {
  username: '',
  email: '',
  phone_number: '',
  bio: '',
  profile_pic: '',
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileUpdatePayload>(defaultUser)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null)
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [cropState, setCropState] = useState<CropState>({
    x: 0,
    y: 0,
    zoom: 1,
    rotation: 0,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const { showNotification } = useNotification()
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const [touchedFields, setTouchedFields] = useState({
    username: false,
    email: false,
    phone_number: false,
    bio: false,
  })

  useEffect(() => {
    // Featch user profile on mount
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/profile/self')
        console.log(response.data)
        setProfile(response.data)
        setFormData(response.data)
      } catch (err) {
        const error = err as AxiosError<{ detail?: string }>
        const message =
          error.response?.data?.detail || 'Failed to load profile.'
        showNotification('error', message, 'Error')
      }
    }
    fetchUserProfile()
  }, [showNotification])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouchedFields((prev) => ({ ...prev, [name]: true }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showNotification(
          'error',
          'Please select a valid image file',
          'Invalid File',
        )
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showNotification(
          'error',
          'Image size must be less than 5MB',
          'File Too Large',
        )
        return
      }

      setSelectedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setShowCropper(true)
        setCropState({ x: 0, y: 0, zoom: 1, rotation: 0 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfilePictureClick = () => {
    if (isEditing) {
      fileInputRef.current?.click()
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - cropState.x,
      y: e.clientY - cropState.y,
    })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      setCropState((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }))
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const getCroppedImage = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!
      const ctx = canvas.getContext('2d')!
      const img = new window.Image()

      img.onload = () => {
        const outputSize = 400
        canvas.width = outputSize
        canvas.height = outputSize

        // Enable high quality rendering
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Clear canvas with white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, outputSize, outputSize)

        // Create circular clipping path
        ctx.save()
        ctx.beginPath()
        ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2)
        ctx.clip()

        // The crop area is 256px, so we need to map from crop coordinates to canvas coordinates
        const cropSize = 256
        const scale = outputSize / cropSize

        // Calculate image dimensions in the crop area
        const imgAspect = img.width / img.height
        let displayWidth, displayHeight

        // Fit image to crop area initially (maintain aspect ratio)
        if (imgAspect > 1) {
          displayWidth = cropSize
          displayHeight = cropSize / imgAspect
        } else {
          displayWidth = cropSize * imgAspect
          displayHeight = cropSize
        }

        // Apply zoom
        displayWidth *= cropState.zoom
        displayHeight *= cropState.zoom

        // Calculate final position
        const finalX = cropSize / 2 + cropState.x - displayWidth / 2
        const finalY = cropSize / 2 + cropState.y - displayHeight / 2

        // Apply rotation
        ctx.translate(outputSize / 2, outputSize / 2)
        ctx.rotate((cropState.rotation * Math.PI) / 180)
        ctx.translate(-outputSize / 2, -outputSize / 2)

        // Draw image with scaling and high quality
        ctx.drawImage(
          img,
          finalX * scale,
          finalY * scale,
          displayWidth * scale,
          displayHeight * scale,
        )

        ctx.restore()

        // Use higher quality JPEG compression
        canvas.toBlob(
          (blob) => {
            resolve(blob!)
          },
          'image/jpeg',
          0.95,
        )
      }

      img.src = imagePreview!
    })
  }

  const handleImageCrop = async () => {
    if (!selectedImage || !imagePreview) return

    try {
      const croppedBlob = await getCroppedImage()
      setCroppedImageBlob(croppedBlob)

      // Create URL for preview
      const url = URL.createObjectURL(croppedBlob)
      setCroppedImageUrl(url)

      // Close cropper
      handleCloseCropper()

      showNotification(
        'success',
        'Profile picture ready! Click "Save Changes" to apply.',
        'Image Ready',
      )
    } catch {
      showNotification('error', 'Failed to process image', 'Error')
    }
  }

  const drawPreview = useCallback(() => {
    if (!previewCanvasRef.current || !imagePreview) return

    const canvas = previewCanvasRef.current
    const ctx = canvas.getContext('2d')!
    const img = new window.Image()

    img.onload = () => {
      // Get device pixel ratio for high DPI displays
      const dpr = window.devicePixelRatio || 1
      const displaySize = 256

      // Set actual canvas size in memory (high resolution)
      canvas.width = displaySize * dpr
      canvas.height = displaySize * dpr

      // Scale the canvas back down using CSS
      canvas.style.width = displaySize + 'px'
      canvas.style.height = displaySize + 'px'

      // Scale the drawing context so everything draws at high resolution
      ctx.scale(dpr, dpr)

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'

      // Clear canvas
      ctx.clearRect(0, 0, displaySize, displaySize)

      // Create circular clipping path for preview
      ctx.save()
      ctx.beginPath()
      ctx.arc(displaySize / 2, displaySize / 2, displaySize / 2, 0, Math.PI * 2)
      ctx.clip()

      // Calculate image dimensions
      const imgAspect = img.width / img.height
      let displayWidth, displayHeight

      // Fit image to canvas initially (maintain aspect ratio)
      if (imgAspect > 1) {
        displayWidth = displaySize
        displayHeight = displaySize / imgAspect
      } else {
        displayWidth = displaySize * imgAspect
        displayHeight = displaySize
      }

      // Apply zoom
      displayWidth *= cropState.zoom
      displayHeight *= cropState.zoom

      // Calculate position
      const x = displaySize / 2 + cropState.x - displayWidth / 2
      const y = displaySize / 2 + cropState.y - displayHeight / 2

      // Apply rotation
      ctx.translate(displaySize / 2, displaySize / 2)
      ctx.rotate((cropState.rotation * Math.PI) / 180)
      ctx.translate(-displaySize / 2, -displaySize / 2)

      // Draw image with high quality
      ctx.drawImage(img, x, y, displayWidth, displayHeight)
      ctx.restore()
    }

    img.src = imagePreview
  }, [imagePreview, cropState])

  React.useEffect(() => {
    if (showCropper) {
      drawPreview()
    }
  }, [showCropper, drawPreview])

  const handleCloseCropper = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setShowCropper(false)
    setCropState({ x: 0, y: 0, zoom: 1, rotation: 0 })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleZoom = (direction: 'in' | 'out') => {
    setCropState((prev) => ({
      ...prev,
      zoom: Math.max(
        0.5,
        Math.min(3, prev.zoom + (direction === 'in' ? 0.1 : -0.1)),
      ),
    }))
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Validations
  const isValidUsername = (username: string) => {
    return /^[a-zA-Z0-9]{8,16}$/.test(username)
  }

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const isValidPhoneNumber = (phone: string) => {
    return /^\+?[0-9]{7,15}$/.test(phone)
  }

  const isValidBio = (bio: string) => {
    return bio.length <= 500
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let hasChanges = false

      // Build the payload as a JSON
      const payload: ProfileUpdatePayload = {}

      if (formData.username !== profile.username) {
        payload.username = formData.username
        hasChanges = true
      }
      if (formData.email !== profile.email) {
        payload.email = formData.email
        hasChanges = true
      }
      if (formData.phone_number !== profile.phone_number) {
        payload.phone_number = formData.phone_number
        hasChanges = true
      }
      if (formData.bio !== profile.bio) {
        payload.bio = formData.bio || ''
        hasChanges = true
      }

      if (croppedImageBlob) {
        const base64 = await blobToBase64(croppedImageBlob)
        payload.profile_pic = base64
        hasChanges = true
      }

      if (!hasChanges) {
        setIsEditing(false)
        return
      }

      const response = await api.patch('/profile/self', payload)
      console.log(response)

      const updatedProfile = {
        ...profile,
        ...payload,
      }

      setProfile(updatedProfile)
      setFormData(updatedProfile)
      setIsEditing(false)

      // Clean up
      setCroppedImageBlob(null)
      if (croppedImageUrl) {
        URL.revokeObjectURL(croppedImageUrl)
        setCroppedImageUrl(null)
      }

      showNotification('success', 'Profile updated successfully!', 'Success')
    } catch (err) {
      const error = err as AxiosError<{ detail?: string }>
      const message = error.response?.data?.detail || 'Updating Profile failed.'
      showNotification('error', message, 'Error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData(profile)
    handleCloseCropper()

    // Clean up cropped image states
    setCroppedImageBlob(null)
    if (croppedImageUrl) {
      URL.revokeObjectURL(croppedImageUrl)
      setCroppedImageUrl(null)
    }
  }

  // Get the display image URL
  const getDisplayImageUrl = () => {
    if (croppedImageUrl && isEditing) {
      return croppedImageUrl
    }
    return profile.profile_pic
  }

  return (
    <div
      className={`${
        isEditing
          ? 'isEditing'
          : 'contents sm:flex h-full flex-col items-center justify-center'
      } h-full flex flex-col items-center justify-center p-6`}
    >
      <div
        className={`bg-[var(--background)] min-w-full sm:min-w-1/2 border border-[var(--border-color)] sm:rounded-lg p-10 sm:p-6 shadow-sm relative ${
          isEditing
            ? 'isEditing'
            : 'bg-[var(--background)] border border-[var(--border-color)] rounded-lg p-10 sm:p-6 shadow-sm relative'
        }`}
      >
        {showCropper && imagePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Adjust your photo
              </h3>
              <div className="relative w-64 h-64 mx-auto mb-4 border-2 border-[var(--border-color)] rounded-full overflow-hidden bg-gray-50">
                <canvas
                  ref={previewCanvasRef}
                  width={256}
                  height={256}
                  className="absolute inset-0 cursor-move rounded-full"
                  onMouseDown={handleMouseDown}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
                <div className="absolute inset-0 border-2 border-white rounded-full pointer-events-none shadow-lg" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleZoom('out')}
                    className="p-2 border border-[var(--border-color)] rounded-md hover:bg-[var(--hover-light)] 
                        dark:hover:bg-[var(--hover-dark-mode)] hover:border-transparent transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm">Zoom</span>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={cropState.zoom}
                      onChange={(e) =>
                        setCropState((prev) => ({
                          ...prev,
                          zoom: parseFloat(e.target.value),
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {Math.round(cropState.zoom * 100)}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleZoom('in')}
                    className="p-2 border border-[var(--border-color)] rounded-md hover:bg-[var(--hover-light)] 
                        dark:hover:bg-[var(--hover-dark-mode)] hover:border-transparent transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-center">
                  <div className="flex items-center gap-1 px-3 py-2 border border-[var(--border-color)] rounded-md text-sm text-[var(--muted-foreground)]">
                    <Move className="w-4 h-4" />
                    Drag to move
                  </div>
                </div>

                <div className="flex justify-center gap-2 pt-4">
                  <Button variant="outline" onClick={handleCloseCropper}>
                    Cancel
                  </Button>

                  <Button onClick={handleImageCrop}>
                    <Upload className="w-4 h-4" />
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
        <div className="flex flex-col sm:flex-row gap-6 items-center justify-center sm:items-start mb-6">
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full bg-[var(--user-loading-color)] flex items-center justify-center overflow-hidden ${
                isEditing
                  ? 'cursor-pointer hover:opacity-80 transition-opacity'
                  : ''
              }`}
              onClick={handleProfilePictureClick}
            >
              {getDisplayImageUrl() ? (
                <Image
                  src={getDisplayImageUrl()!}
                  alt={profile.username || 'Profile Picture'}
                  className="w-full h-full rounded-full object-cover"
                  width={96}
                  height={96}
                />
              ) : (
                <UserIcon className="w-12 h-12 text-white" />
              )}
            </div>

            {isEditing && (
              <div className="absolute bottom-0 right-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[var(--foreground)] text-[var(--background)] p-1 rounded-full hover:opacity-80 transition-opacity"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            )}
            {croppedImageUrl && isEditing && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">{profile.username}</h2>
            <p className="text-[var(--muted-foreground)] mb-4">
              {profile.bio || 'No bio provided'}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md 
              hover:bg-[var(--hover-dark)] dark:hover:bg-[var(--hover-light-mode)] transition-colors cursor-pointer"
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
                  className="flex items-center gap-2 font-medium text-[var(--foreground)]"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  maxLength={16}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                    transition-colors text-[var(--foreground)] ${
                      touchedFields.username &&
                      isValidUsername(formData.username || '')
                        ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                        : touchedFields.username
                          ? 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                          : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                    }`}
                />
                <p className="mt-1 text-xs text-[var(--border-color)]">
                  {formData.username?.length}/16 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 font-medium text-[var(--foreground)]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                    transition-colors text-[var(--foreground)] ${
                      touchedFields.email && isValidEmail(formData.email || '')
                        ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                        : touchedFields.email
                          ? 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                          : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                    }`}
                />
                <p className="mt-1 text-xs text-[var(--border-color)]">
                  Valid email format
                </p>
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="flex items-center gap-2 font-medium text-[var(--foreground)]"
                >
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  maxLength={16}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                    transition-colors text-[var(--foreground)] ${
                      touchedFields.phone_number &&
                      isValidPhoneNumber(formData.phone_number || '')
                        ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                        : touchedFields.phone_number
                          ? 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                          : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                    }`}
                />
                <p className="mt-1 text-xs text-[var(--border-color)]">
                  Include country code (+ Prefix, 7-15 digits)
                </p>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="flex items-center gap-2 font-medium text-[var(--foreground)]"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  maxLength={500}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                    transition-colors resize-none text-[var(--foreground)] ${
                      touchedFields.bio && isValidBio(formData.bio || '')
                        ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                        : touchedFields.bio
                          ? 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                          : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                    }`}
                />
                <p className="mt-1 text-xs text-[var(--border-color)]">
                  {formData.bio?.length}/500 characters
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-[var(--border-color)] rounded-md
                            hover:bg-[var(--hover-light)] dark:hover:bg-[var(--hover-dark-mode)] 
                            hover:border-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-md
                            hover:bg-[var(--hover-dark)] dark:hover:bg-[var(--hover-light-mode)]
                            transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div
                      className="w-5 h-5 border-2 border-t-transparent border-[var(--background)]
                     rounded-full animate-spin"
                    ></div>
                  ) : (
                    <span>Save Changes</span>
                  )}
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
