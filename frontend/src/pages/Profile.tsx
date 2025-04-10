import React, { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { UserProfile, UpdateProfileData } from '../types/profile';
import { useAuth } from '../contexts/AuthContext';

// Type definitions
type SettingsSection = keyof Pick<UserProfile['settings'], 'notifications' | 'privacy'>;
type SettingsKey = keyof (UserProfile['settings']['notifications'] | UserProfile['settings']['privacy']);
type Settings = UserProfile['settings'];

// Default values
const defaultSettings: Settings = {
  notifications: { email: false, push: false, inApp: false },
  privacy: { showEmail: false, showActivity: false, allowMessages: false },
  theme: 'light',
  language: 'en'
};

const defaultStats = {
  posts: 0,
  communities: 0,
  classrooms: 0,
  lastActive: new Date().toISOString()
};

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState<UpdateProfileData>({});

  const loadProfile = useCallback(async () => {
    try {
      if (!currentUser?.profileId) {
        throw new Error('No profile ID found');
      }
      setLoading(true);
      const profileData = await profileService.getProfile(currentUser.profileId);
      setProfile(profileData);
      // Initialize updateData with current profile settings
      setUpdateData({
        settings: profileData.settings
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.profileId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (currentUser?.profileId) {
      loadProfile();
    }
  }, [currentUser, loadProfile, isAuthenticated, navigate]);

  const handleSettingsChange = (
    name: SettingsKey,
    value: boolean,
    section: SettingsSection
  ): void => {
    setUpdateData((prev) => ({
      ...prev,
      settings: {
        ...(prev.settings || profile?.settings || defaultSettings),
        [section]: {
          ...(prev.settings?.[section] || profile?.settings?.[section] || defaultSettings[section]),
          [name]: value
        }
      }
    }));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section?: 'social'
  ): void => {
    const { name, value } = e.target;
    
    if (section === 'social') {
      setUpdateData((prev: UpdateProfileData) => ({
        ...prev,
        social: {
          ...prev.social,
          [name as keyof UserProfile['social']]: value
        }
      }));
    } else {
      setUpdateData((prev: UpdateProfileData) => ({
        ...prev,
        [name as keyof UpdateProfileData]: value
      }));
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!currentUser?.profileId) {
        throw new Error('No profile ID found');
      }
      const imageUrl = await profileService.uploadProfileImage(currentUser.profileId, file);
      setUpdateData((prev: UpdateProfileData) => ({
        ...prev,
        avatar: imageUrl
      }));
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to upload avatar');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      if (!currentUser?.profileId) {
        throw new Error('No profile ID found');
      }
      const updatedProfile = await profileService.updateProfile(currentUser.profileId, updateData);
      setProfile(updatedProfile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={profile?.avatar || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23E5E7EB'/%3E%3Cpath d='M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%236B7280'/%3E%3C/svg%3E"}
                  alt={profile?.name || 'Profile'}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23E5E7EB'/%3E%3Cpath d='M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' fill='%236B7280'/%3E%3C/svg%3E";
                  }}
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer shadow-lg">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <i className="fas fa-camera text-white"></i>
                  </label>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-3">
              {!isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await logout();
                        navigate('/login');
                      } catch (err) {
                        setError('Failed to logout');
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-colors flex items-center"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8 bg-white rounded-b-lg shadow-inner">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isEditing && (
                <div className="flex justify-end space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition-colors flex items-center"
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center"
                >
                  <i className="fas fa-check mr-2"></i>
                  Save Changes
                </button>
                </div>
              )}
              {/* Basic Information */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-inner">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <i className="fas fa-user mr-3 text-blue-600"></i>
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={profile?.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white transition-shadow hover:shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      name="username"
                      defaultValue={profile?.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white transition-shadow hover:shadow-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    defaultValue={profile?.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white transition-shadow hover:shadow-md resize-none"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-inner">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <i className="fas fa-share-nodes mr-3 text-blue-600"></i>
                  Social Links
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <i className="fab fa-github mr-2"></i>GitHub
                    </label>
                    <input
                      type="text"
                      name="github"
                      defaultValue={profile?.social?.github}
                      onChange={(e) => handleInputChange(e, 'social')}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white transition-shadow hover:shadow-md"
                      placeholder="Your GitHub profile URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <i className="fab fa-linkedin mr-2"></i>LinkedIn
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      defaultValue={profile?.social?.linkedin}
                      onChange={(e) => handleInputChange(e, 'social')}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white transition-shadow hover:shadow-md"
                      placeholder="Your LinkedIn profile URL"
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-inner">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <i className="fas fa-chart-line mr-3 text-blue-600"></i>
                  Activity
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-center transform hover:-translate-y-1">
                    <div className="text-3xl font-bold text-blue-600">{profile?.stats?.posts ?? defaultStats.posts}</div>
                    <div className="text-sm font-medium text-gray-600 mt-2">
                      <i className="fas fa-pen-to-square mr-2"></i>Posts
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-center transform hover:-translate-y-1">
                    <div className="text-3xl font-bold text-purple-600">{profile?.stats?.communities ?? defaultStats.communities}</div>
                    <div className="text-sm font-medium text-gray-600 mt-2">
                      <i className="fas fa-users mr-2"></i>Communities
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-center transform hover:-translate-y-1">
                    <div className="text-3xl font-bold text-indigo-600">{profile?.stats?.classrooms ?? defaultStats.classrooms}</div>
                    <div className="text-sm font-medium text-gray-600 mt-2">
                      <i className="fas fa-chalkboard-user mr-2"></i>Classrooms
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings */}
              {isEditing && (
                <div className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <i className="fas fa-gear mr-3 text-blue-600"></i>
                    Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="email"
                            checked={profile?.settings.notifications.email || false}
                            onChange={(e) => handleSettingsChange(e.target.name as SettingsKey, e.target.checked, 'notifications')}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 ease-in-out hover:border-blue-400"
                          />
                          <span className="ml-3 text-gray-700">Email Notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="push"
                            checked={profile?.settings.notifications.push || false}
                            onChange={(e) => handleSettingsChange(e.target.name as SettingsKey, e.target.checked, 'notifications')}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 ease-in-out hover:border-blue-400"
                          />
                          <span className="ml-3 text-gray-700">Push Notifications</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Privacy</h3>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="showEmail"
                            checked={profile?.settings.privacy.showEmail || false}
                            onChange={(e) => handleSettingsChange(e.target.name as SettingsKey, e.target.checked, 'privacy')}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 ease-in-out hover:border-blue-400"
                          />
                          <span className="ml-3 text-gray-700">Show Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="showActivity"
                            checked={profile?.settings.privacy.showActivity || false}
                            onChange={(e) => handleSettingsChange(e.target.name as SettingsKey, e.target.checked, 'privacy')}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200 ease-in-out hover:border-blue-400"
                          />
                          <span className="ml-3 text-gray-700">Show Activity</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;