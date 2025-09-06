import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
    Camera,
    User,
    Mail,
    Phone,
    MapPin,
    LogOut,
    Trash,
    Plus,
    Home,
    Building,
    Edit,
    Save,
    X,
    Lock,
} from "lucide-react";

/* ---------- colour tokens ---------- */
const COLOR = {
    primary: "#38B000", // brand green
    secondary: "#F0EAD2", // cream cards
    bg: "#EBF2FA", // page background
    ink: "#141414", // high-contrast text
    muted: "#6C584C", // low-contrast text / borders
};

/* ---------- helpers ---------- */
const style = {
    bg: `bg-[#EBF2FA]`,
    sidebar: `bg-[#38B000] text-white`,
    card: `bg-[#F0EAD2] border border-[#6C584C]/20 rounded-2xl shadow-lg`,
    textPrimary: `text-[#141414]`,
    textSecondary: `text-[#6C584C]`,
    accent: `bg-[#38B000] hover:bg-[#38B000]/90 text-white`,
    border: `border border-[#6C584C]/30`,
    focus: `focus:ring-2 focus:ring-[#38B000] focus:outline-none`,
};

/* ---------- types ---------- */
interface Address {
    locality: string;
    city: string;
    state: string;
    pin: string;
    landmark: string;
}

/* ---------- page ---------- */
export default function ProfilePage() {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [name, setName] = useState("John Abraham");
    const [email, setEmail] = useState("john@example.com");
    const [phone, setPhone] = useState("+91 98765 43210");
    const [phone2, setPhone2] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([
        {
            locality: "Andheri East",
            city: "Mumbai",
            state: "Maharashtra",
            pin: "400069",
            landmark: "Near Metro Station",
        },
    ]);

    const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setAvatar(URL.createObjectURL(file));
    };

    const addAddress = () =>
        setAddresses([
            ...addresses,
            { locality: "", city: "", state: "", pin: "", landmark: "" },
        ]);

    const removeAddress = (index: number) =>
        setAddresses(addresses.filter((_, i) => i !== index));

    const updateAddress = (
        index: number,
        field: keyof Address,
        value: string
    ) => {
        const next = [...addresses];
        next[index][field] = value;
        setAddresses(next);
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            // Save logic would go here
            console.log("Saving changes...");
        }
    };

    const togglePasswordForm = () => {
        setShowPasswordForm(!showPasswordForm);
    };

    /* ---------- render ---------- */
    return (
        <div className={`min-h-screen ${style.bg} flex`}>
            {/* ------ desktop sidebar ------ */}
            <aside
                className={`hidden md:flex flex-col items-center w-64 p-6 ${style.sidebar} shrink-0`}
            >
                <label className="relative cursor-pointer mb-8">
                    <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePhoto}
                    />
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/90 shadow-lg grid place-items-center bg-white/20">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-10 h-10 text-white/80" />
                        )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-white shadow-md">
                        <Camera className="w-4 h-4" style={{ color: COLOR.primary }} />
                    </div>
                </label>

                <nav className="flex flex-col gap-3 text-sm font-semibold w-full">
                    {["Dashboard", "Reviews", "My Bookings", "Profile"].map((item) => (
                        <a
                            key={item}
                            className="px-3 py-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                        >
                            {item}
                        </a>
                    ))}
                    <a className="mt-auto flex items-center gap-2 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg">
                        <LogOut className="w-4 h-4" /> Logout
                    </a>
                </nav>
            </aside>

            {/* ------ content ------ */}
            <main className="flex-1 p-6 md:p-10 space-y-6">
                {/* Header with edit button */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold" style={{ color: COLOR.ink }}>
                        Profile Settings
                    </h1>
                    <Button
                        onClick={toggleEdit}
                        className={`gap-2 ${isEditing ? "bg-[#6C584C] hover:bg-[#6C584C]/90" : style.accent
                            }`}
                    >
                        {isEditing ? (
                            <>
                                <Save size={16} /> Save Changes
                            </>
                        ) : (
                            <>
                                <Edit size={16} /> Edit Profile
                            </>
                        )}
                    </Button>
                </div>

                {/* mobile avatar */}
                <div className="md:hidden flex justify-center mb-4">
                    <label className="relative cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handlePhoto}
                        />
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg grid place-items-center bg-white">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-8 h-8" style={{ color: COLOR.muted }} />
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-white shadow-md border border-black/10">
                            <Camera className="w-4 h-4" style={{ color: COLOR.primary }} />
                        </div>
                    </label>
                </div>

                {/* profile card */}
                <section className={`${style.card} p-6 space-y-5`}>
                    <h2 className="text-lg font-semibold" style={{ color: COLOR.ink }}>
                        Personal Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup
                            icon={<User size={18} />}
                            value={name}
                            onChange={setName}
                            placeholder="Full Name"
                            disabled={!isEditing}
                        />
                        <InputGroup
                            icon={<Mail size={18} />}
                            value={email}
                            onChange={setEmail}
                            placeholder="Email Address"
                            type="email"
                            disabled={!isEditing}
                        />
                        <InputGroup
                            icon={<Phone size={18} />}
                            value={phone}
                            onChange={setPhone}
                            placeholder="Primary Phone"
                            disabled={!isEditing}
                        />
                        <InputGroup
                            icon={<Phone size={18} />}
                            value={phone2}
                            onChange={setPhone2}
                            placeholder="Alternate Phone (optional)"
                            disabled={!isEditing}
                        />

                        <div className="md:col-span-2">
                            <Button
                                onClick={togglePasswordForm}
                                variant="outline"
                                className="gap-2 w-full md:w-auto"
                                style={{ borderColor: COLOR.muted, color: COLOR.muted }}
                            >
                                <Lock size={16} />
                                {showPasswordForm
                                    ? "Cancel Password Change"
                                    : "Change Password"}
                            </Button>

                            {showPasswordForm && (
                                <div className="mt-4 p-4 rounded-lg bg-white/50 space-y-4">
                                    <h3 className="font-medium" style={{ color: COLOR.ink }}>
                                        Change Password
                                    </h3>
                                    <InputGroup
                                        icon={<Lock size={18} />}
                                        value=""
                                        onChange={() => { }}
                                        placeholder="Current Password"
                                        type="password"
                                    />
                                    <InputGroup
                                        icon={<Lock size={18} />}
                                        value=""
                                        onChange={() => { }}
                                        placeholder="New Password"
                                        type="password"
                                    />
                                    <InputGroup
                                        icon={<Lock size={18} />}
                                        value=""
                                        onChange={() => { }}
                                        placeholder="Confirm New Password"
                                        type="password"
                                    />
                                    <Button className={style.accent}>Update Password</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* addresses card */}
                <section className={`${style.card} p-6`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-semibold ${style.textPrimary}`}>
                            Saved Addresses
                        </h3>
                        {isEditing && (
                            <Button
                                size="sm"
                                className={`${style.accent} gap-2`}
                                onClick={addAddress}
                            >
                                <Plus className="w-4 h-4" /> Add Address
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {addresses.map((addr, idx) => (
                            <AddressBlock
                                key={idx}
                                data={addr}
                                onChange={(f, v) => updateAddress(idx, f, v)}
                                onRemove={() => removeAddress(idx)}
                                editable={isEditing}
                            />
                        ))}
                    </div>
                </section>

                {/* mobile logout */}
                <div className="md:hidden">
                    <Button
                        variant="outline"
                        className="w-full gap-2"
                        style={{ borderColor: COLOR.muted, color: COLOR.muted }}
                    >
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </main>
        </div>
    );
}

/* ---------- sub-components ---------- */
function InputGroup(props: {
    icon: React.ReactNode;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    type?: string;
    disabled?: boolean;
}) {
    return (
        <div className="relative">
            <span
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: COLOR.muted }}
            >
                {props.icon}
            </span>
            <input
                type={props.type ?? "text"}
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
                placeholder={props.placeholder}
                disabled={props.disabled}
                className={`w-full pl-10 pr-3 py-2.5 rounded-lg ${style.border} ${style.textPrimary
                    } ${style.focus} transition-all ${props.disabled ? "bg-white/50 opacity-80" : "bg-white"
                    }`}
            />
        </div>
    );
}

function AddressBlock(props: {
    data: Address;
    onChange: (field: keyof Address, value: string) => void;
    onRemove: () => void;
    editable: boolean;
}) {
    const { data, onChange, onRemove, editable } = props;
    return (
        <div
            className={`p-4 rounded-xl border ${style.border
                } bg-white/70 space-y-3 relative transition-all ${editable ? "ring-2 ring-[#38B000]/20" : ""
                }`}
        >
            {editable && (
                <button
                    onClick={onRemove}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/5 transition-colors"
                    aria-label="Remove address"
                >
                    <Trash className="w-4 h-4" style={{ color: COLOR.muted }} />
                </button>
            )}

            <Label icon={<Home size={16} />} text="Locality / Street" />
            <input
                value={data.locality}
                onChange={(e) => onChange("locality", e.target.value)}
                placeholder="e.g. Andheri East"
                disabled={!editable}
                className={`w-full px-3 py-2 rounded-lg ${style.border} ${style.textPrimary
                    } ${style.focus} transition-all ${!editable ? "bg-transparent border-transparent" : "bg-white"
                    }`}
            />

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label icon={<Building size={16} />} text="City" />
                    <input
                        value={data.city}
                        onChange={(e) => onChange("city", e.target.value)}
                        placeholder="Mumbai"
                        disabled={!editable}
                        className={`w-full px-3 py-2 rounded-lg ${style.border} ${style.textPrimary
                            } ${style.focus} transition-all ${!editable ? "bg-transparent border-transparent" : "bg-white"
                            }`}
                    />
                </div>
                <div>
                    <Label icon={<MapPin size={16} />} text="State" />
                    <input
                        value={data.state}
                        onChange={(e) => onChange("state", e.target.value)}
                        placeholder="Maharashtra"
                        disabled={!editable}
                        className={`w-full px-3 py-2 rounded-lg ${style.border} ${style.textPrimary
                            } ${style.focus} transition-all ${!editable ? "bg-transparent border-transparent" : "bg-white"
                            }`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Label text="Pin Code" />
                    <input
                        value={data.pin}
                        onChange={(e) => onChange("pin", e.target.value)}
                        placeholder="400069"
                        disabled={!editable}
                        className={`w-full px-3 py-2 rounded-lg ${style.border} ${style.textPrimary
                            } ${style.focus} transition-all ${!editable ? "bg-transparent border-transparent" : "bg-white"
                            }`}
                    />
                </div>
                <div>
                    <Label text="Landmark" />
                    <input
                        value={data.landmark}
                        onChange={(e) => onChange("landmark", e.target.value)}
                        placeholder="Near Metro Station"
                        disabled={!editable}
                        className={`w-full px-3 py-2 rounded-lg ${style.border} ${style.textPrimary
                            } ${style.focus} transition-all ${!editable ? "bg-transparent border-transparent" : "bg-white"
                            }`}
                    />
                </div>
            </div>
        </div>
    );
}

function Label(props: { icon?: React.ReactNode; text: string }) {
    return (
        <div
            className={`flex items-center gap-2 text-xs font-semibold ${style.textSecondary} mb-1`}
        >
            {props.icon}
            <span>{props.text}</span>
        </div>
    );
}
