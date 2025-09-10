import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    LogOut,
    Camera,
    Save,
    X,
    Eye,
    EyeOff,
    Lock,
} from "lucide-react";

// Define TypeScript interfaces
interface ProfileData {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    type: "org" | "emp";
    profilePic?: string;
}

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const Profile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [formData, setFormData] = useState<Partial<ProfileData>>({});
    const [passwordData, setPasswordData] = useState<PasswordData>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Mock profile data
    const mockProfile: ProfileData = {
        id: "user-123",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St, New York, NY 10001",
        type: "emp",
        profilePic: ""
    };

    useEffect(() => {
        // Simulate API fetch with mock data
        const fetchProfile = async () => {
            try {
                setLoading(true);
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setProfile(mockProfile);
                setFormData(mockProfile);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handlePasswordChange = (field: keyof PasswordData, value: string) => {
        setPasswordData({ ...passwordData, [field]: value });
    };

    const handleSave = async () => {
        try {
            // Simulate API update
            await new Promise(resolve => setTimeout(resolve, 500));
            setProfile(formData as ProfileData);
            setIsEditing(false);
        } catch (err) {
            setError("Failed to update profile");
        }
    };

    const handlePasswordSave = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        try {
            // Simulate API update
            await new Promise(resolve => setTimeout(resolve, 500));
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setIsChangingPassword(false);
            setError("");
            alert("Password changed successfully!");
        } catch (err) {
            setError("Failed to change password");
        }
    };

    const handleLogout = () => {
        // Replace with actual logout logic
        alert("Logged out successfully!");
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => prev ? {
                    ...prev,
                    profilePic: reader.result as string
                } : null);
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-[#EBF2FA]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38B000]"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-[#EBF2FA]">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                    onClick={() => setError("")}
                    className="mt-4 bg-[#38B000] text-white px-4 py-2 rounded-md hover:bg-[#2E8B00] transition"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-[#EBF2FA] py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Profile Card */}
                <div className="bg-[#F0EAD2] rounded-2xl shadow-xl p-6 md:p-8 border border-[#6C584C]/20">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Profile Pic */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-[#6C584C] flex items-center justify-center text-white text-4xl font-bold border-4 border-[#38B000] shadow-lg">
                                {profile.profilePic ? (
                                    <img
                                        src={profile.profilePic}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    profile.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-1 right-1 bg-[#38B000] p-2 rounded-full shadow-md hover:bg-[#2E8B00] transition cursor-pointer">
                                    <Camera size={16} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-[#141414]">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formData.name || ""}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="bg-transparent border-b-2 border-[#38B000] outline-none text-center md:text-left"
                                    />
                                ) : (
                                    profile.name
                                )}
                            </h2>
                            <p className="text-[#6C584C] capitalize flex items-center justify-center md:justify-start gap-1 mt-1">
                                <Shield size={16} /> {profile.type} Account
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 flex-wrap justify-center">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center gap-2 bg-[#38B000] text-white px-4 py-2 rounded-xl shadow hover:bg-[#2E8B00] transition"
                                    >
                                        <Save size={18} /> Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center gap-2 bg-[#6C584C] text-white px-4 py-2 rounded-xl shadow hover:bg-[#4e4237] transition"
                                    >
                                        <X size={18} /> Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-[#38B000] text-white px-4 py-2 rounded-xl shadow hover:bg-[#2E8B00] transition"
                                >
                                    <User size={18} /> Edit Profile
                                </button>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-[#6C584C] text-white px-4 py-2 rounded-xl shadow hover:bg-[#4e4237] transition"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Info Fields */}
                    <div className="mt-8 grid gap-6">
                        {[
                            { label: "Email", value: "email", icon: <Mail size={18} /> },
                            { label: "Phone", value: "phone", icon: <Phone size={18} /> },
                            { label: "Address", value: "address", icon: <MapPin size={18} /> },
                        ].map((field) => (
                            <div key={field.value}>
                                <label className="block text-sm font-medium text-[#6C584C] mb-1">
                                    {field.label}
                                </label>
                                {isEditing ? (
                                    <div className="flex items-center gap-2 bg-white rounded-xl border border-[#6C584C]/20 px-4 py-3">
                                        {field.icon}
                                        <input
                                            type="text"
                                            value={(formData as any)[field.value] || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    field.value as keyof ProfileData,
                                                    e.target.value
                                                )
                                            }
                                            className="flex-1 outline-none text-[#141414] bg-transparent"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 bg-white rounded-xl border border-[#6C584C]/20 px-4 py-3 text-[#141414]">
                                        {field.icon}
                                        <span className="flex-1">{(profile as any)[field.value]}</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Password Section */}
                        <div>
                            <label className="block text-sm font-medium text-[#6C584C] mb-1">
                                Password
                            </label>
                            {isChangingPassword ? (
                                <div className="space-y-4 bg-white rounded-xl border border-[#6C584C]/20 p-4">
                                    <div className="flex items-center gap-2">
                                        <Lock size={18} className="text-[#6C584C]" />
                                        <input
                                            type={showPassword.current ? "text" : "password"}
                                            placeholder="Current Password"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                                            className="flex-1 outline-none text-[#141414] bg-transparent"
                                        />
                                        <button
                                            onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                                            className="text-[#6C584C] hover:text-[#38B000]"
                                        >
                                            {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Lock size={18} className="text-[#6C584C]" />
                                        <input
                                            type={showPassword.new ? "text" : "password"}
                                            placeholder="New Password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                                            className="flex-1 outline-none text-[#141414] bg-transparent"
                                        />
                                        <button
                                            onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                                            className="text-[#6C584C] hover:text-[#38B000]"
                                        >
                                            {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Lock size={18} className="text-[#6C584C]" />
                                        <input
                                            type={showPassword.confirm ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                                            className="flex-1 outline-none text-[#141414] bg-transparent"
                                        />
                                        <button
                                            onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                                            className="text-[#6C584C] hover:text-[#38B000]"
                                        >
                                            {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={handlePasswordSave}
                                            className="flex items-center gap-2 bg-[#38B000] text-white px-4 py-2 rounded-xl shadow hover:bg-[#2E8B00] transition"
                                        >
                                            <Save size={18} /> Save Password
                                        </button>
                                        <button
                                            onClick={() => setIsChangingPassword(false)}
                                            className="flex items-center gap-2 bg-[#6C584C] text-white px-4 py-2 rounded-xl shadow hover:bg-[#4e4237] transition"
                                        >
                                            <X size={18} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-white rounded-xl border border-[#6C584C]/20 px-4 py-3 text-[#141414]">
                                    <Lock size={18} />
                                    <span className="flex-1">••••••••</span>
                                    <button
                                        onClick={() => setIsChangingPassword(true)}
                                        className="text-[#38B000] hover:text-[#2E8B00] font-medium"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="bg-[#F0EAD2] rounded-2xl shadow-xl p-6 md:p-8 border border-[#6C584C]/20 mt-6">
                    <h3 className="text-xl font-bold text-[#141414] mb-4">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-[#6C584C]">Account Type</p>
                            <p className="font-medium text-[#141414] capitalize">{profile.type}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-[#6C584C]">Member Since</p>
                            <p className="font-medium text-[#141414]">January 2023</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-[#6C584C]">Last Updated</p>
                            <p className="font-medium text-[#141414]">2 days ago</p>
                        </div>
                        <div className="bg-white rounded-xl p-4">
                            <p className="text-sm text-[#6C584C]">Status</p>
                            <p className="font-medium text-[#38B000]">Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;