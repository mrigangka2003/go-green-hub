// CommonDashboard.tsx

import { Sparkles } from "lucide-react";

const CommonDashboard = () => {
    return (
        <div className="p-6 md:p-10">
            <div className="bg-gradient-to-r from-[#F0EAD2] to-[#EBF2FA] rounded-3xl shadow-xl border border-[#6C584C]/10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 backdrop-blur-md">

                {/* Icon */}
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#38B000] text-white shadow-lg">
                    <Sparkles size={32} />
                </div>

                {/* Greeting */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#141414]">
                        Hi John 👋
                    </h1>
                    <p className="text-[#6C584C] mt-2 text-lg">
                        How’s your day going?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CommonDashboard;
