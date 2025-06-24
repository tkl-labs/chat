'use client'

import React, { useEffect } from 'react'
import { useState, useRef, useCallback } from 'react'
import { User, X, Camera, Upload, ZoomIn, ZoomOut, Move } from 'lucide-react'
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

interface ProfileDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const SelfProfileDialog: React.FC<ProfileDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
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
    if (isOpen) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - cropState.x,
      y: e.clientY - cropState.y,
    })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !showCropper) return

      setCropState((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }))
    },
    [isDragging, dragStart, showCropper],
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

  const handleClose = () => {
    setIsAnimating(false)
    // Add a small delay to allow exit animation for better UX
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
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
    e.stopPropagation()
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

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ease-out
    overflow-y-auto max-h-screen
    ${isAnimating ? 'backdrop-blur-sm bg-black/30' : 'backdrop-blur-none bg-black/0'}`}
      onClick={handleBackdropClick}
    >
      {showCropper && imagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] border border-[var(--border-color)] rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-center text-[var(--foreground)]">
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
                  className="p-2 border border-[var(--border-color)] rounded-md hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-[var(--foreground)]">Zoom</span>
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
                  className="p-2 border border-[var(--border-color)] rounded-md hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] transition-colors"
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

      <div
        className={`bg-white dark:bg-[var(--background)] border border-[var(--border-color)]
    rounded-lg shadow-xl w-full max-w-2xl mx-4 transform transition-all duration-300 ease-out
    max-h-[90vh] flex flex-col overflow-hidden
    ${
      isAnimating
        ? 'translate-y-0 opacity-100 scale-100'
        : 'translate-y-full opacity-0 scale-95'
    }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b dark:border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-[var(--foreground)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {isEditing ? 'Edit Profile' : 'Your Profile'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[var(--muted-bg)] transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center justify-center md:items-start md:w-1/2">
              <div className="text-center">
                <div className="relative mb-4">
                  <div
                    className={`w-32 h-32 rounded-full bg-gray-200 dark:bg-[var(--muted-bg)] 
                        flex items-center justify-center border-2 border-[var(--border-color)] ${
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
                        width={128}
                        height={128}
                      />
                    ) : (
                      <User className="w-16 h-16 text-[var(--muted-foreground)]" />
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
                        className="bg-[var(--foreground)] text-[var(--background)] p-2 rounded-full hover:opacity-80 transition-opacity"
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

                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {profile.username}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  {profile.bio || 'No bio provided'}
                </p>
              </div>
            </div>

            {/* Form/Info Section */}
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
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
                      transition-colors text-[var(--foreground)] bg-[var(--background)] ${
                        touchedFields.username &&
                        isValidUsername(formData.username || '')
                          ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                          : touchedFields.username
                            ? 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                            : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                      }`}
                    />
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {formData.username?.length}/16 characters
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
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
                      transition-colors text-[var(--foreground)] bg-[var(--background)] ${
                        touchedFields.email &&
                        isValidEmail(formData.email || '')
                          ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                          : touchedFields.email
                            ? 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                            : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                      }`}
                    />
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      Valid email format required
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
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
                      placeholder="+447123456789"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 
                      transition-colors text-[var(--foreground)] bg-[var(--background)] ${
                        touchedFields.phone_number &&
                        isValidPhoneNumber(formData.phone_number || '')
                          ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                          : touchedFields.phone_number
                            ? 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                            : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                      }`}
                    />
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      Include country code (+ Prefix, 7-15 digits)
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-[var(--muted-foreground)] mb-1"
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
                      transition-colors resize-none text-[var(--foreground)] bg-[var(--background)] ${
                        touchedFields.bio && isValidBio(formData.bio || '')
                          ? 'border-[var(--success-border-color)] focus:ring-[var(--success-border-color)]'
                          : touchedFields.bio
                            ? 'border-[var(--error-border-color)] focus:ring-[var(--error-border-color)]'
                            : 'border-[var(--border-color)] focus:ring-[var(--foreground)]'
                      }`}
                    />
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {formData.bio?.length}/500 characters
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                      Email
                    </label>
                    <p className="text-[var(--foreground)]">{profile.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                      Phone Number
                    </label>
                    <p className="text-[var(--foreground)]">
                      {profile.phone_number}
                    </p>
                  </div>

                  {profile.bio && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                        Bio
                      </label>
                      <p className="text-[var(--foreground)] text-sm leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-8">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
