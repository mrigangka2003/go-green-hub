import React, { useState, useEffect } from "react";
import {
    Users,
    Building2,
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Eye,
    EyeOff,
    Check,
    AlertCircle,
    Sparkles,
    UserPlus,
} from "lucide-react";

interface FormData {
    type: "org" | "emp";
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
}

interface ValidationState {
    isValid: boolean;
    message: string;
}

const AddManagement: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        type: "org",
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validation, setValidation] = useState<{ [key: string]: ValidationState }>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Real-time validation (unchanged logic)
    useEffect(() => {
        const validateField = (name: string, value: string): ValidationState => {
            switch (name) {
                case "name":
                    return value.length >= 2
                        ? { isValid: true, message: "Valid name" }
                        : { isValid: false, message: "Name must be at least 2 characters" };
                case "email":
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value)
                        ? { isValid: true, message: "Valid email address" }
                        : { isValid: false, message: "Please enter a valid email address" };
                case "phone":
                    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
                    return phoneRegex.test(value)
                        ? { isValid: true, message: "Valid phone number" }
                        : { isValid: false, message: "Please enter a valid phone number" };
                case "password":
                    const hasUpper = /[A-Z]/.test(value);
                    const hasLower = /[a-z]/.test(value);
                    const hasNumber = /\d/.test(value);
                    const isLongEnough = value.length >= 8;

                    if (isLongEnough && hasUpper && hasLower && hasNumber) {
                        return { isValid: true, message: "Strong password" };
                    } else {
                        return {
                            isValid: false,
                            message: "Password must be 8+ chars with uppercase, lowercase, and number",
                        };
                    }
                default:
                    return { isValid: true, message: "" };
            }
        };

        const newValidation: { [key: string]: ValidationState } = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (value && key !== "type") {
                newValidation[key] = validateField(key, value);
            }
        });
        setValidation(newValidation);
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise((r) => setTimeout(r, 900));
        console.log("Form submitted:", formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);

        setTimeout(() => {
            setFormData({ type: "org", name: "", email: "", phone: "", address: "", password: "" });
            setSubmitSuccess(false);
            setValidation({});
        }, 1200);
    };

    const getFieldIcon = (fieldName: string) => {
        const iconProps = { size: 16, className: "text-[#6C584C]" };
        switch (fieldName) {
            case "name":
                return <User {...iconProps} />;
            case "email":
                return <Mail {...iconProps} />;
            case "phone":
                return <Phone {...iconProps} />;
            case "address":
                return <MapPin {...iconProps} />;
            case "password":
                return <Lock {...iconProps} />;
            default:
                return null;
        }
    };

    const isFormValid =
        Object.values(validation).every((v) => v.isValid) &&
        Object.keys(formData).every((key) => formData[key as keyof FormData] !== "" || key === "type");

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#EBF2FA] via-[#EBF2FA] to-[#F0EAD2]/30 flex items-start sm:items-center justify-center p-3">
            <style>{`:root{--primary:#38B000;--secondary:#F0EAD2;--tertiary:#EBF2FA;--dark:#141414;--accent:#6C584C}`}</style>

            <div className="relative w-full max-w-lg mx-auto">
                {/* Header (compact) */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#38B000] to-[#2E8B00] rounded-lg shadow-sm mb-2 relative">
                        <UserPlus size={18} className="text-white" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Sparkles size={8} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#141414]">Add Management</h1>
                    <p className="text-xs sm:text-sm text-[#6C584C]">Create an organization or employee account</p>
                </div>

                {/* Card with constrained height and internal scroll */}
                <div
                    className="bg-white/98 backdrop-blur-sm rounded-xl shadow-md border border-[#6C584C]/8 p-3 sm:p-5"
                    style={{
                        // limit card height so small screens don't overflow the viewport
                        maxHeight: "calc(100vh - 120px)",
                        overflow: "hidden",
                    }}
                >
                    {/* inner scroll area */}
                    <div
                        className="space-y-4 pr-1"
                        style={{
                            // scroll the form area if content exceeds the card maxHeight
                            maxHeight: "calc(100vh - 200px)",
                            overflowY: "auto",
                            paddingRight: 6,
                        }}
                    >
                        {/* Success small centered overlay (does not block full screen) */}
                        {submitSuccess && (
                            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                                <div className="w-56 sm:w-64 bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#38B000] to-[#2E8B00] rounded-full flex items-center justify-center mb-2">
                                        <Check size={22} className="text-white" />
                                    </div>
                                    <div className="text-sm font-semibold text-[#141414] mb-1">Success!</div>
                                    <div className="text-xs text-[#6C584C]">Account created successfully</div>
                                </div>
                            </div>
                        )}

                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-[#141414] mb-2">Account Type</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData((p) => ({ ...p, type: "org" }))}
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-shadow border ${formData.type === "org"
                                            ? "border-[#38B000] bg-gradient-to-br from-[#38B000]/8 to-[#2E8B00]/6 shadow-sm"
                                            : "border-[#6C584C]/20 bg-white"
                                        }`}
                                >
                                    <div className={`w-9 h-9 rounded-md flex items-center justify-center ${formData.type === "org" ? "bg-gradient-to-br from-[#38B000] to-[#2E8B00] text-white" : "bg-[#6C584C]/10 text-[#6C584C]"}`}>
                                        <Building2 size={14} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="font-medium text-sm text-[#141414]">Organization</div>
                                        <div className="text-xs text-[#6C584C]">Company account</div>
                                    </div>
                                    {formData.type === "org" && <Check size={12} className="text-[#38B000] hidden sm:block" />}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData((p) => ({ ...p, type: "emp" }))}
                                    className={`flex items-center gap-3 p-2 rounded-lg transition-shadow border ${formData.type === "emp"
                                            ? "border-[#38B000] bg-gradient-to-br from-[#38B000]/8 to-[#2E8B00]/6 shadow-sm"
                                            : "border-[#6C584C]/20 bg-white"
                                        }`}
                                >
                                    <div className={`w-9 h-9 rounded-md flex items-center justify-center ${formData.type === "emp" ? "bg-gradient-to-br from-[#38B000] to-[#2E8B00] text-white" : "bg-[#6C584C]/10 text-[#6C584C]"}`}>
                                        <Users size={14} />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="font-medium text-sm text-[#141414]">Employee</div>
                                        <div className="text-xs text-[#6C584C]">Staff account</div>
                                    </div>
                                    {formData.type === "emp" && <Check size={12} className="text-[#38B000] hidden sm:block" />}
                                </button>
                            </div>
                        </div>

                        {/* Inputs - compact spacing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* Name */}
                            <div>
                                <label className="text-sm font-medium text-[#141414]">Full name</label>
                                <div className="relative mt-1">
                                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">{getFieldIcon("name")}</div>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField("name")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Enter full name"
                                        className={`w-full pl-10 pr-2 py-2 rounded-md border text-sm ${focusedField === "name" || formData.name ? "border-[#38B000]" : "border-[#6C584C]/20"}`}
                                    />
                                    {validation.name && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            {validation.name.isValid ? <Check size={14} className="text-[#38B000]" /> : <AlertCircle size={14} className="text-red-500" />}
                                        </div>
                                    )}
                                </div>
                                {validation.name && <p className={`text-xs mt-1 ${validation.name.isValid ? "text-[#38B000]" : "text-red-500"}`}>{validation.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-sm font-medium text-[#141414]">Email</label>
                                <div className="relative mt-1">
                                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">{getFieldIcon("email")}</div>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField("email")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Enter email"
                                        className={`w-full pl-10 pr-2 py-2 rounded-md border text-sm ${focusedField === "email" || formData.email ? "border-[#38B000]" : "border-[#6C584C]/20"}`}
                                    />
                                    {validation.email && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            {validation.email.isValid ? <Check size={14} className="text-[#38B000]" /> : <AlertCircle size={14} className="text-red-500" />}
                                        </div>
                                    )}
                                </div>
                                {validation.email && <p className={`text-xs mt-1 ${validation.email.isValid ? "text-[#38B000]" : "text-red-500"}`}>{validation.email.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* Phone */}
                            <div>
                                <label className="text-sm font-medium text-[#141414]">Phone</label>
                                <div className="relative mt-1">
                                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">{getFieldIcon("phone")}</div>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField("phone")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Enter phone"
                                        className={`w-full pl-10 pr-2 py-2 rounded-md border text-sm ${focusedField === "phone" || formData.phone ? "border-[#38B000]" : "border-[#6C584C]/20"}`}
                                    />
                                    {validation.phone && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            {validation.phone.isValid ? <Check size={14} className="text-[#38B000]" /> : <AlertCircle size={14} className="text-red-500" />}
                                        </div>
                                    )}
                                </div>
                                {validation.phone && <p className={`text-xs mt-1 ${validation.phone.isValid ? "text-[#38B000]" : "text-red-500"}`}>{validation.phone.message}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-[#141414]">Password</label>
                                <div className="relative mt-1">
                                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">{getFieldIcon("password")}</div>
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField("password")}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Create password"
                                        className={`w-full pl-10 pr-10 py-2 rounded-md border text-sm ${focusedField === "password" || formData.password ? "border-[#38B000]" : "border-[#6C584C]/20"}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={14} className="text-[#6C584C]" /> : <Eye size={14} className="text-[#6C584C]" />}
                                    </button>
                                </div>
                                {validation.password && <p className={`text-xs mt-1 ${validation.password.isValid ? "text-[#38B000]" : "text-red-500"}`}>{validation.password.message}</p>}
                            </div>
                        </div>

                        {/* Address (full width) */}
                        <div>
                            <label className="text-sm font-medium text-[#141414]">Address</label>
                            <div className="relative mt-1">
                                <div className="absolute left-2 top-3 z-10">{getFieldIcon("address")}</div>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField("address")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Enter address"
                                    className={`w-full pl-10 pr-2 py-2 rounded-md border text-sm ${focusedField === "address" || formData.address ? "border-[#38B000]" : "border-[#6C584C]/20"}`}
                                />
                            </div>
                        </div>

                        {/* Submit (large touch target) */}
                        <div className="pt-1 pb-2">
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                className={`w-full py-2 rounded-md font-semibold text-sm transition-colors ${isFormValid && !isSubmitting ? "bg-gradient-to-r from-[#38B000] to-[#2E8B00] text-white shadow" : "bg-[#6C584C]/30 text-[#6C584C] cursor-not-allowed"
                                    }`}
                                aria-disabled={!isFormValid || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <UserPlus size={14} />
                                        <span>Add Management</span>
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Progress */}
                        <div className="pt-2 border-t border-[#6C584C]/10">
                            <div className="flex items-center justify-between text-xs text-[#6C584C]">
                                <span>Form Completion</span>
                                <span className="font-semibold">
                                    {Math.round((Object.values(formData).filter((v) => v !== "").length / Object.keys(formData).length) * 100)}%
                                </span>
                            </div>
                            <div className="mt-2 h-2 bg-[#6C584C]/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#38B000] to-[#2E8B00] rounded-full transition-width duration-300"
                                    style={{
                                        width: `${(Object.values(formData).filter((v) => v !== "").length / Object.keys(formData).length) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddManagement;
