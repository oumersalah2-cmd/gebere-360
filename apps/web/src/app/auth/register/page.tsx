"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, Globe, AlertCircle, CheckCircle2, Info, Wheat } from "lucide-react";
import { ZoneItem } from "@gebere/shared";
import { setAuthToken, setDemoMode, apiClient } from "@/lib/api-client";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useApp } from "@/context/AppContext";
import { platformTranslations, SUPPORTED_LANGUAGES, Language } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const { language: appLanguage, setLanguage: setAppLanguage } = useApp();
  const t = platformTranslations[appLanguage];
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [zones, setZones] = useState<ZoneItem[]>([]);
  const [farmLocation, setFarmLocation] = useState("");
  const [role, setRole] = useState<"farmer" | "buyer" | "agronomist" | "cooperative_manager">("farmer");
  const [language, setLanguage] = useState("");
  const [topLanguage, setTopLanguage] = useState("English");
  const [isTopLangOpen, setIsTopLangOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const hasSupabaseKeys = isSupabaseConfigured();

  useEffect(() => {
    async function loadZones() {
      try {
        const list = await apiClient.getZones();
        if (list && list.length > 0) {
          setZones(list);
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Unable to load farm locations.");
      }
    }
    loadZones();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const email = identifier.trim().toLowerCase();
    if (!fullName.trim() || !email.includes("@") || password.length < 8 || !farmLocation || !language) {
      setErrorMsg("Enter your full name, a valid email, a farm location, a language, and a password of at least 8 characters.");
      setLoading(false);
      return;
    }

    if (!hasSupabaseKeys) {
      setErrorMsg("Sign-up is unavailable until Supabase authentication is configured.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName: fullName.trim(),
            zone: farmLocation,
            language,
            role,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        setAuthToken(data.session.access_token);
        setDemoMode(false);

        await apiClient.updateProfile({
          fullName: fullName.trim(),
          zone: farmLocation,
        });

        router.push("/farms");
        return;
      }

      if (data.user) {
        setSuccessMsg("Registration successful! If confirmation is required, please check your email inbox to verify your account before logging in.");
        setLoading(false);
        return;
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to create Supabase account.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B4332]/90 md:bg-[#23533E] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Split Auth Modal Card */}
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Green Brand Panel */}
        <div className="md:w-1/2 bg-[#1B4332] p-8 sm:p-10 text-white flex flex-col justify-between relative">

          {/* Top Language Dropdown */}
          <div className="flex justify-end relative">
            <button
              type="button"
              onClick={() => setIsTopLangOpen(!isTopLangOpen)}
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-1.5 text-xs text-white/90 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{SUPPORTED_LANGUAGES.find((l) => l.code === appLanguage)?.nativeLabel || "Language"}</span>
              <ChevronDown className="h-3 w-3 opacity-70" />
            </button>
            {isTopLangOpen && (
              <div className="absolute top-10 right-0 bg-[#163628] border border-white/20 rounded-xl py-1 w-36 shadow-xl z-20 text-xs">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setAppLanguage(l.code);
                      setTopLanguage(l.label);
                      setLanguage(l.label);
                      setIsTopLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-white/10 flex items-center justify-between ${
                      appLanguage === l.code ? "text-[#d9f99d] font-bold" : "text-white/90"
                    }`}
                  >
                    <span>{l.nativeLabel}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center Brand Title & Tagline */}
          <div className="my-8 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-[#d9f99d]">
              <Wheat className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">{topLanguage}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white font-sans">Gebere 360</h1>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xs mx-auto">
              Know Your Farm. Control Your Costs.
              <br />
              Grow Your Profits.
            </p>
          </div>

          {/* Farmer Terraced Fields Illustration */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-emerald-950/40">
            <Image
              src="/images/ethiopian_farmer_terrace.jpg"
              alt="Ethiopian farmer cultivating terraced crop fields"
              width={800}
              height={500}
              className="w-full h-52 sm:h-64 object-cover object-center"
            />
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B4332] mb-6">
            {t.auth.createAccount}
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}
            {hasSupabaseKeys ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Connected to Supabase Auth GoTrue</span>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Connect Supabase to create a secure account</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
            </div>

            {/* Phone Number or Email */}
            <div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email address"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1 pl-1">
                Use an email address you can access to confirm your account.
              </p>
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] transition-all"
                required
              />
            </div>

            {/* Farm Location */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Farm Location</label>
              <div className="relative">
                <select
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                  <option value="" disabled>Select your farm zone</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.name}>
                      {z.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Account Role */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">{t.auth.accountRole}</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "farmer" | "buyer" | "agronomist" | "cooperative_manager")}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                  <option value="farmer">{t.auth.roles.farmer}</option>
                  <option value="buyer">{t.auth.roles.buyer}</option>
                  <option value="agronomist">{t.auth.roles.agronomist}</option>
                  <option value="cooperative_manager">{t.auth.roles.cooperative_manager}</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Preferred Language */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">{t.auth.preferredLang}</label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLanguage(val);
                    const codeMap: Record<string, Language> = {
                      "Afaan Oromoo": "om",
                      Amharic: "am",
                      English: "en",
                    };
                    if (codeMap[val]) setAppLanguage(codeMap[val]);
                  }}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-800 appearance-none pr-10 focus:outline-none focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
                >
                  <option value="" disabled>{t.auth.selectLang}</option>
                  <option value="Afaan Oromoo">Afaan Oromoo</option>
                  <option value="Amharic">Amharic (አማርኛ)</option>
                  <option value="English">English</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#40916C] hover:bg-[#2D6A4F] text-white font-medium py-3 rounded-xl text-sm transition-all shadow-md shadow-[#2D6A4F]/20 active:scale-[0.99]"
              >
                {loading ? t.auth.creatingAccount : t.auth.registerBtn}
              </button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <span>{t.auth.hasAccount} </span>
            <Link
              href="/auth/login"
              className="text-[#2D6A4F] font-semibold hover:underline"
            >
              {t.auth.loginBtn}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
