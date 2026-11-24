import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Clock,
  ChefHat,
  GraduationCap,
  Scale,
  Award,
  ChevronRight,
  CalendarCheck,
  PackageCheck,
  Flame,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const { quickLogin } = useAuth();
  const navigate = useNavigate();
  const [calcSkips, setCalcSkips] = useState(6);
  const [activeTab, setActiveTab] = useState('student');

  const handleQuickLogin = async (role) => {
    const res = await quickLogin(role);
    if (res.success) {
      if (role === 'student') navigate('/student');
      else if (role === 'mess_owner') navigate('/owner');
      else if (role === 'super_admin') navigate('/admin');
    }
  };

  // Shared Savings Calculator math:
  // ₹35 raw food cost saved per skip
  // 50% shared with student = ₹17.50 to ₹35 depending on meal
  const savingsPerMeal = 35;
  const totalVerifiedSaved = calcSkips * savingsPerMeal;
  const studentWalletReward = Math.round(totalVerifiedSaved * 0.5);
  const messOwnerRetained = totalVerifiedSaved - studentWalletReward;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Banner */}
      <div className="bg-emerald-900 text-emerald-200 px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Introducing <strong>Shared Savings Wallet</strong>: Save food waste, get direct meal credits!</span>
        <a href="#shared-savings" className="underline font-semibold text-white ml-1">
          Learn How It Works &rarr;
        </a>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-emerald-50/30 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-xs font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Next-Gen Smart Mess & Kitchen Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Save Food. <span className="text-emerald-600">Save Money.</span><br />
                Manage Smartly.
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
                MessMate digitizes hostel mess operations from end to end. Students skip meals in advance and earn verified food cost credits in their shared savings wallet. Mess owners eliminate food waste with confirmed kitchen demand planning.
              </p>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-sm max-w-xl flex items-center gap-3 text-xs text-slate-600">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  Tagline
                </span>
                <span className="italic font-medium text-slate-700">
                  "One Platform. Two-Sided Convenience. Complete Smart Mess Management."
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3.5">
                <Link
                  to="/register"
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => handleQuickLogin('student')}
                  className="px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Demo as Student</span>
                </button>

                <button
                  onClick={() => handleQuickLogin('mess_owner')}
                  className="px-5 py-3.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <ChefHat className="w-4 h-4 text-emerald-600" />
                  <span>Demo as Mess Owner</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified 50/50 Savings Split</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Double-Credit Guard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Live Kitchen Headcount</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card / Visual */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Decorative glow */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-400 opacity-20 blur-xl"></div>

                <div className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Exclusive Innovation
                        </div>
                        <div className="text-base font-bold text-slate-900">
                          Shared Savings Wallet
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                      Live Preview
                    </span>
                  </div>

                  {/* Wallet Card preview */}
                  <div className="mt-5 p-5 rounded-xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-emerald-200">Aarav Sharma • Hostel Block A</div>
                        <div className="text-2xl font-black mt-1">₹155.00</div>
                        <div className="text-[11px] text-emerald-300">Available Meal Credits</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-semibold">
                        3 Skips Verified
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-600/50 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-emerald-300 block text-[10px]">Total Food Saved:</span>
                        <span className="font-bold">₹210.00</span>
                      </div>
                      <div>
                        <span className="text-emerald-300 block text-[10px]">Mess Owner Benefit:</span>
                        <span className="font-bold">₹105.00 retained</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculator Simulation */}
                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                      <span>Simulate Skipped Meals / Month:</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-sm">
                        {calcSkips} meals
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={calcSkips}
                      onChange={(e) => setCalcSkips(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-left">
                        <div className="text-[11px] text-slate-500 font-medium">Student Credit</div>
                        <div className="text-lg font-bold text-emerald-700">+₹{studentWalletReward}</div>
                        <div className="text-[10px] text-slate-400">Credited to wallet</div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-left">
                        <div className="text-[11px] text-slate-500 font-medium">Mess Owner Saves</div>
                        <div className="text-lg font-bold text-slate-800">+₹{messOwnerRetained}</div>
                        <div className="text-[10px] text-slate-400">Raw cost prevented</div>
                      </div>
                    </div>

                    <div className="text-center pt-1">
                      <span className="text-[11px] font-semibold text-emerald-600">
                        "Save Together, Benefit Together!"
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Metrics Platform Bar */}
      <section className="bg-slate-900 text-white py-10 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
                Transparent Meal Accounting
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">~350g</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
                Food Saved Per Skipped Meal
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">50 / 50</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
                Fair Shared Savings Ratio
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">Zero</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
                Double-Reward Calculation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Simple 5-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              How MessMate Eliminates Waste & Rewards Everyone
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              A transparent feedback loop between students and the kitchen that turns avoided food waste into financial credits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md mb-4 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Advance Skip
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Student notifies the mess before the cutoff hour (e.g. 2h before breakfast, 3h before lunch/dinner).
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-md mb-4 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Kitchen Alert
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mess owner & head chef receive live confirmed headcount on the kitchen demand dashboard.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-md mb-4 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Prep Adjusted
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kitchen reduces raw grain, vegetable, and dairy quantities to cook only what will be consumed.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-md mb-4 group-hover:scale-110 transition-transform">
                04
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">
                Savings Verified
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mess owner verifies actual raw food material savings. Estimated savings are never treated as actuals.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-md mb-4 group-hover:scale-110 transition-transform">
                05
              </div>
              <h3 className="font-bold text-emerald-950 text-base mb-1.5">
                Wallet Credited
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Student wallet is credited with the configured share (50%). Mess owner retains remaining 50%!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Savings Deep Dive Section */}
      <section id="shared-savings" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5 text-left">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold uppercase tracking-wider">
                  The MessMate Breakthrough
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  "Save Together, Benefit Together!"
                </h2>
                <p className="text-emerald-100 text-base leading-relaxed">
                  Traditional messes force students to pay for meals they never eat, while mess owners still throw away surplus cooked food. MessMate creates a win-win financial model by splitting verified kitchen raw material savings.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-emerald-400 font-bold text-sm mb-1">
                      Strict Verification Standard
                    </div>
                    <div className="text-xs text-slate-300">
                      Rewards are never calculated on estimated assumptions. The mess owner logs actual saved raw procurement.
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-emerald-400 font-bold text-sm mb-1">
                      Anti-Double-Reward Engine
                    </div>
                    <div className="text-xs text-slate-300">
                      Cryptographically protected transaction ledger prevents any meal skip from ever being credited twice.
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleQuickLogin('student')}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
                  >
                    Experience Student Wallet
                  </button>
                  <button
                    onClick={() => handleQuickLogin('mess_owner')}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all"
                  >
                    View Owner Savings Config
                  </button>
                </div>
              </div>

              {/* Breakdown Table Preview */}
              <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-emerald-500/30">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>Per-Meal Cost Economics</span>
                  <span className="text-emerald-400 text-xs font-normal">₹60 Total Cost</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Raw Ingredients (Saved when skipped):</span>
                    <span className="font-bold text-emerald-400">₹35.00</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Cook & Labor Cost (Fixed):</span>
                    <span className="font-medium text-slate-300">₹15.00</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                    <span className="text-slate-400">Rent, Gas & Utilities (Fixed):</span>
                    <span className="font-medium text-slate-300">₹10.00</span>
                  </div>
                  <div className="pt-2 bg-emerald-950/50 p-3 rounded-lg border border-emerald-800/60">
                    <div className="flex justify-between items-center font-bold text-emerald-300">
                      <span>Verified Net Saved Amount:</span>
                      <span>₹35.00</span>
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] text-slate-300 pt-2 border-t border-emerald-900">
                      <span>Student Wallet Credit (50%): <strong className="text-emerald-400">₹17.50</strong></span>
                      <span>Owner Savings (50%): <strong className="text-emerald-400">₹17.50</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Sided Convenience: Student vs Owner Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Two-Sided Convenience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Built Specifically for Students & Mess Owners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 text-left hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">For Students</h3>
                  <p className="text-xs text-slate-500">Flexibility, financial returns & transparency</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic Day Counting:</strong> Track remaining membership days live with clear expiry dates.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Pause & Resume:</strong> Taking a leave for exams or home visits? Pause membership without losing money.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Shared Savings Wallet:</strong> Earn direct credits whenever you skip meals with advance notice.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Daily Menus & Feedback:</strong> View daily breakfast, lunch and dinner menus and rate food quality.</span>
                </li>
              </ul>
            </div>

            {/* Mess Owner Card */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 text-left hover:shadow-lg transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-sm">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">For Mess Owners</h3>
                  <p className="text-xs text-slate-500">Zero wastage, smart procurement & profitability</p>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Confirmed Kitchen Demand:</strong> Know the exact number of dining students before cooking begins.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Smart Ingredient Quantities:</strong> Automatic raw material calculator for grains, vegetables & dairy.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Configurable Savings Sharing:</strong> Set student reward percentage (e.g. 50/50 or 40/60) to fit your margins.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Inventory & Low-Stock Alerts:</strong> Real-time threshold warnings and transparent purchase logs.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans Preview */}
      <section id="plans" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Campus Dining Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Affordable, Flexible Plans with Shared Savings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="rounded-3xl bg-white p-7 border border-slate-200 shadow-sm flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Essential</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Silver Lunch & Dinner</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹2,800</span>
                  <span className="text-xs text-slate-500">/ 30 days</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Ideal for students with morning classes who only dine for lunch and dinner.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>2 Meals / Day (Lunch + Dinner)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Shared Savings Wallet Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Up to 7 Days Flexible Pause</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleQuickLogin('student')}
                className="mt-8 w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Choose Plan
              </button>
            </div>

            {/* Plan 2: Popular */}
            <div className="rounded-3xl bg-white p-7 border-2 border-emerald-600 shadow-xl relative flex flex-col justify-between text-left">
              <div className="absolute -top-3.5 right-6 px-3 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase">Full Board</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Gold 3 Meals / Day</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹3,600</span>
                  <span className="text-xs text-slate-500">/ 30 days</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Complete balanced dining: hot homestyle breakfast, lunch, and dinner daily.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>All 3 Daily Meals Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>50% Shared Savings Credit on Skips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Up to 10 Days Pause Policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Special Festival Feasts Included</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleQuickLogin('student')}
                className="mt-8 w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-colors"
              >
                Subscribe Now
              </button>
            </div>

            {/* Plan 3 */}
            <div className="rounded-3xl bg-white p-7 border border-slate-200 shadow-sm flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Semester Saver</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Platinum Semester</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">₹9,800</span>
                  <span className="text-xs text-slate-500">/ 90 days</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Maximum savings for semester hostelers with 60% student reward share.
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>90 Days Complete Meal Coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Higher 60% Student Reward Share</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Up to 20 Days Exam/Leave Pause</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleQuickLogin('student')}
                className="mt-8 w-full py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
              >
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 bg-emerald-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Revolutionize Your Campus Mess?
          </h2>
          <p className="text-emerald-100 text-base max-w-2xl mx-auto">
            Experience how MessMate transforms dining halls into zero-waste, financially transparent hubs.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-7 py-3.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold shadow-lg transition-all"
            >
              Register Your Mess
            </Link>
            <button
              onClick={() => handleQuickLogin('super_admin')}
              className="px-7 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white border border-emerald-600 rounded-xl font-semibold transition-all"
            >
              Demo as Super Admin
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
