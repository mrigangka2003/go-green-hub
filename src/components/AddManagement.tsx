import { useState, useEffect } from "react";
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
    ChevronDown
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

const AddManagement = () => {
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
    const [validation, setValidation] = useState<{[key: string]: ValidationState}>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Real-time validation
    useEffect(() => {
        const validateField = (name: string, value: string): ValidationState => {
            switch (name) {
                case 'name':
                    return value.length >= 2 
                        ? { isValid: true, message: 'Valid name' }
                        : { isValid: false, message: 'Name must be at least 2 characters' };
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value)
                        ? { isValid: true, message: 'Valid email address' }
                        : { isValid: false, message: 'Please enter a valid email address' };
                case 'phone':
                    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
                    return phoneRegex.test(value)
                        ? { isValid: true, message: 'Valid phone number' }
                        : { isValid: false, message: 'Please enter a valid phone number' };
                case 'password':
                    const hasUpper = /[A-Z]/.test(value);
                    const hasLower = /[a-z]/.test(value);
                    const hasNumber = /\d/.test(value);
                    const isLongEnough = value.length >= 8;
                    
                    if (isLongEnough && hasUpper && hasLower && hasNumber) {
                        return { isValid: true, message: 'Strong password' };
                    } else {
                        return { 
                            isValid: false, 
                            message: 'Password must be 8+ chars with uppercase, lowercase, and number' 
                        };
                    }
                default:
                    return { isValid: true, message: '' };
            }
        };

        const newValidation: {[key: string]: ValidationState} = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (value && key !== 'type') {
                newValidation[key] = validateField(key, value);
            }
        });
        setValidation(newValidation);
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log("Form submitted:", formData);
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
            setFormData({
                type: "org",
                name: "",
                email: "",
                phone: "",
                address: "",
                password: "",
            });
            setSubmitSuccess(false);
            setValidation({});
        }, 2000);
    };

    const getFieldIcon = (fieldName: string) => {
        const iconProps = { size: 20, className: "text-[#6C584C]" };
        switch (fieldName) {
            case 'name': return <User {...iconProps} />;
            case 'email': return <Mail {...iconProps} />;
            case 'phone': return <Phone {...iconProps} />;
            case 'address': return <MapPin {...iconProps} />;
            case 'password': return <Lock {...iconProps} />;
            default: return null;
        }
    };

    const isFormValid = Object.values(validation).every(v => v.isValid) && 
                       Object.keys(formData).every(key => formData[key as keyof FormData] !== '' || key === 'type');

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-[#EBF2FA] via-[#EBF2FA] to-[#F0EAD2]/30 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#38B000]/10 to-[#2E8B00]/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#6C584C]/10 to-[#F0EAD2]/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#38B000] to-[#2E8B00] rounded-2xl shadow-lg mb-4 relative">
                        <UserPlus size={28} className="text-white" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Sparkles size={12} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-[#141414] mb-2">Add Management</h1>
                    <p className="text-[#6C584C] text-lg">Create new organization or employee accounts</p>
                </div>

                {/* Main Form Container */}
                <div className="bg-[#F0EAD2]/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-[#6C584C]/10 p-8 relative">
                    {/* Success Animation */}
                    {submitSuccess && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#38B000]/20 to-[#2E8B00]/10 rounded-3xl flex items-center justify-center backdrop-blur-sm z-10">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#38B000] to-[#2E8B00] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <Check size={40} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#141414] mb-2">Success!</h3>
                                <p className="text-[#6C584C]">Management account created successfully</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Type Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#141414] mb-3">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'org' }))}
                                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${
                                        formData.type === 'org'
                                            ? 'border-[#38B000] bg-gradient-to-br from-[#38B000]/10 to-[#2E8B00]/5 shadow-lg'
                                            : 'border-[#6C584C]/20 bg-white/60 hover:border-[#6C584C]/40'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                            formData.type === 'org'
                                                ? 'bg-gradient-to-br from-[#38B000] to-[#2E8B00] text-white'
                                                : 'bg-[#6C584C]/10 text-[#6C584C] group-hover:bg-[#6C584C]/20'
                                        }`}>
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#141414]">Organization</h3>
                                            <p className="text-sm text-[#6C584C]">Company account</p>
                                        </div>
                                    </div>
                                    {formData.type === 'org' && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-[#38B000] to-[#2E8B00] rounded-full flex items-center justify-center">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'emp' }))}
                                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${
                                        formData.type === 'emp'
                                            ? 'border-[#38B000] bg-gradient-to-br from-[#38B000]/10 to-[#2E8B00]/5 shadow-lg'
                                            : 'border-[#6C584C]/20 bg-white/60 hover:border-[#6C584C]/40'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                            formData.type === 'emp'
                                                ? 'bg-gradient-to-br from-[#38B000] to-[#2E8B00] text-white'
                                                : 'bg-[#6C584C]/10 text-[#6C584C] group-hover:bg-[#6C584C]/20'
                                        }`}>
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#141414]">Employee</h3>
                                            <p className="text-sm text-[#6C584C]">Staff account</p>
                                        </div>
                                    </div>
                                    {formData.type === 'emp' && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-[#38B000] to-[#2E8B00] rounded-full flex items-center justify-center">
                                            <Check size={14} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#141414]">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                        {getFieldIcon('name')}
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/80 backdrop-blur-sm text-[#141414] placeholder-[#6C584C]/60 transition-all duration-300 focus:outline-none ${
                                            focusedField === 'name' || formData.name
                                                ? 'border-[#38B000] shadow-lg shadow-[#38B000]/20'
                                                : 'border-[#6C584C]/20 hover:border-[#6C584C]/40'
                                        }`}
                                    />
                                    {validation.name && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {validation.name.isValid ? (
                                                <Check size={20} className="text-[#38B000]" />
                                            ) : (
                                                <AlertCircle size={20} className="text-red-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {validation.name && (
                                    <p className={`text-sm ${validation.name.isValid ? 'text-[#38B000]' : 'text-red-500'}`}>
                                        {validation.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#141414]">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                        {getFieldIcon('email')}
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/80 backdrop-blur-sm text-[#141414] placeholder-[#6C584C]/60 transition-all duration-300 focus:outline-none ${
                                            focusedField === 'email' || formData.email
                                                ? 'border-[#38B000] shadow-lg shadow-[#38B000]/20'
                                                : 'border-[#6C584C]/20 hover:border-[#6C584C]/40'
                                        }`}
                                    />
                                    {validation.email && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {validation.email.isValid ? (
                                                <Check size={20} className="text-[#38B000]" />
                                            ) : (
                                                <AlertCircle size={20} className="text-red-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {validation.email && (
                                    <p className={`text-sm ${validation.email.isValid ? 'text-[#38B000]' : 'text-red-500'}`}>
                                        {validation.email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#141414]">
                                    Phone Number
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                        {getFieldIcon('phone')}
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/80 backdrop-blur-sm text-[#141414] placeholder-[#6C584C]/60 transition-all duration-300 focus:outline-none ${
                                            focusedField === 'phone' || formData.phone
                                                ? 'border-[#38B000] shadow-lg shadow-[#38B000]/20'
                                                : 'border-[#6C584C]/20 hover:border-[#6C584C]/40'
                                        }`}
                                    />
                                    {validation.phone && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            {validation.phone.isValid ? (
                                                <Check size={20} className="text-[#38B000]" />
                                            ) : (
                                                <AlertCircle size={20} className="text-red-500" />
                                            )}
                                        </div>
                                    )}
                                </div>
                                {validation.phone && (
                                    <p className={`text-sm ${validation.phone.isValid ? 'text-[#38B000]' : 'text-red-500'}`}>
                                        {validation.phone.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-[#141414]">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                        {getFieldIcon('password')}
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Create password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 bg-white/80 backdrop-blur-sm text-[#141414] placeholder-[#6C584C]/60 transition-all duration-300 focus:outline-none ${
                                            focusedField === 'password' || formData.password
                                                ? 'border-[#38B000] shadow-lg shadow-[#38B000]/20'
                                                : 'border-[#6C584C]/20 hover:border-[#6C584C]/40'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-[#6C584C]/10 rounded-lg transition-all duration-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} className="text-[#6C584C]" />
                                        ) : (
                                            <Eye size={20} className="text-[#6C584C]" />
                                        )}
                                    </button>
                                </div>
                                {validation.password && (
                                    <p className={`text-sm ${validation.password.isValid ? 'text-[#38B000]' : 'text-red-500'}`}>
                                        {validation.password.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address Field - Full Width */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#141414]">
                                Address
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-4 z-10">
                                    {getFieldIcon('address')}
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Enter complete address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('address')}
                                    onBlur={() => setFocusedField(null)}
                                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white/80 backdrop-blur-sm text-[#141414] placeholder-[#6C584C]/60 transition-all duration-300 focus:outline-none ${
                                        focusedField === 'address' || formData.address
                                            ? 'border-[#38B000] shadow-lg shadow-[#38B000]/20'
                                            : 'border-[#6C584C]/20 hover:border-[#6C584C]/40'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid || isSubmitting}
                                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 relative overflow-hidden group ${
                                    isFormValid && !isSubmitting
                                        ? 'bg-gradient-to-r from-[#38B000] to-[#2E8B00] text-white shadow-lg hover:shadow-xl hover:shadow-[#38B000]/30 hover:scale-[1.02] transform'
                                        : 'bg-[#6C584C]/30 text-[#6C584C] cursor-not-allowed'
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Creating Account...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <UserPlus size={20} />
                                        <span>Add Management</span>
                                    </div>
                                )}
                                
                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </button>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-6 pt-6 border-t border-[#6C584C]/10">
                        <div className="flex items-center justify-between text-sm text-[#6C584C]">
                            <span>Form Completion</span>
                            <span className="font-semibold">
                                {Math.round((Object.values(formData).filter(v => v !== '').length / Object.keys(formData).length) * 100)}%
                            </span>
                        </div>
                        <div className="mt-2 h-2 bg-[#6C584C]/10 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[#38B000] to-[#2E8B00] transition-all duration-500 rounded-full"
                                style={{ 
                                    width: `${(Object.values(formData).filter(v => v !== '').length / Object.keys(formData).length) * 100}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddManagement;