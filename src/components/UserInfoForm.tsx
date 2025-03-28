import React, { useState } from 'react';
import { Upload, ArrowRight, ArrowLeft } from 'lucide-react';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mediaPreferences: string;
  mediaFiles: {
    images: File[];
    videos: File[];
  };
  triggerImage?: File | null;
}

interface UserInfoFormProps {
  onSubmit: (data: UserInfo) => void;
  onBack: () => void;
  initialData?: UserInfo;
}

export default function UserInfoForm({ onSubmit, onBack, initialData }: UserInfoFormProps) {
  const [formData, setFormData] = useState<UserInfo>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    mediaPreferences: initialData?.mediaPreferences || '',
    mediaFiles: initialData?.mediaFiles || { images: [], videos: [] },
    triggerImage: initialData?.triggerImage || null,
  });
  const [errors, setErrors] = useState<Partial<UserInfo>>({});

  const validateForm = () => {
    const newErrors: Partial<UserInfo> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.mediaPreferences.trim()) newErrors.mediaPreferences = 'Media preferences are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.match('image/(jpeg|png|jpg)')) {
        setFormData(prev => ({
          ...prev,
          triggerImage: file
        }));
      } else {
        alert('Please upload only JPG, JPEG, or PNG files.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white py-20 px-4">
      <button
        onClick={onBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 text-white hover:text-purple-400 transition-colors rounded-full bg-purple-600/20 backdrop-blur-sm hover:bg-purple-600/30"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Personalize Your Experience</h1>
          <p className="text-xl text-gray-300">
            Help us create the perfect D-frames experience tailored just for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg bg-purple-900/20 border ${
                  errors.firstName ? 'border-red-500' : 'border-purple-500/30'
                } focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 text-white`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg bg-purple-900/20 border ${
                  errors.lastName ? 'border-red-500' : 'border-purple-500/30'
                } focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 text-white`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg bg-purple-900/20 border ${
                  errors.email ? 'border-red-500' : 'border-purple-500/30'
                } focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 text-white`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg bg-purple-900/20 border ${
                  errors.phone ? 'border-red-500' : 'border-purple-500/30'
                } focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 text-white`}
                placeholder="Enter your phone number with country code"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Trigger Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Trigger Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-500/30 border-dashed rounded-lg hover:border-purple-400/50 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-400">
                  <label htmlFor="triggerImage" className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input
                      id="triggerImage"
                      name="triggerImage"
                      type="file"
                      className="sr-only"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-400">
                  PNG, JPG, JPEG up to 10MB
                </p>
                {formData.triggerImage && (
                  <p className="text-sm text-purple-400">
                    Selected: {formData.triggerImage.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Media Preferences */}
          <div>
            <label htmlFor="mediaPreferences" className="block text-sm font-medium text-gray-300 mb-2">
              Preferences
            </label>
            <textarea
              id="mediaPreferences"
              value={formData.mediaPreferences}
              onChange={(e) => setFormData({ ...formData, mediaPreferences: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg bg-purple-900/20 border ${
                errors.mediaPreferences ? 'border-red-500' : 'border-purple-500/30'
              } focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 text-white`}
              placeholder="Describe your preferences for images and videos"
            ></textarea>
            {errors.mediaPreferences && (
              <p className="mt-1 text-sm text-red-400">{errors.mediaPreferences}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Continue
              <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
