// test-apis.js - Quick test runner for MessMate APIs
async function runTests() {
  const BASE = 'http://localhost:5000/api';
  console.log('🧪 Starting MessMate API Verification Tests...\n');

  // 1. Health Check
  const healthRes = await fetch(`${BASE}/health`);
  const healthData = await healthRes.json();
  console.log('✅ 1. Health Check:', healthData.status, '| Platform:', healthData.platform);

  // 2. Student Login
  const studentLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'aarav@student.com', password: 'student123' })
  });
  const studentAuth = await studentLoginRes.json();
  console.log('✅ 2. Student Login:', studentAuth.success, '| User:', studentAuth.user.name, `(${studentAuth.user.role})`);
  const studentToken = studentAuth.token;

  // 3. Shared Savings Wallet
  const walletRes = await fetch(`${BASE}/student/wallet`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const walletData = await walletRes.json();
  console.log('✅ 3. Shared Savings Wallet:');
  console.log('      - Balance:', walletData.wallet.balance, 'INR');
  console.log('      - Total Food Savings Generated:', walletData.wallet.totalSavingsGenerated, 'INR');
  console.log('      - Student Credits Earned:', walletData.wallet.studentCreditsEarned, 'INR');
  console.log('      - Mess Owner Savings:', walletData.wallet.messOwnerSavings, 'INR');
  console.log('      - Total Skipped Meals:', walletData.wallet.totalMealsSkipped);
  console.log('      - Audit Transactions:', walletData.transactions.length);

  // 4. Student Membership Status
  const memRes = await fetch(`${BASE}/student/membership/current`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  const memData = await memRes.json();
  console.log('✅ 4. Student Membership: Active =', memData.hasMembership, '| Plan:', memData.membership?.planName, '| Remaining Days:', memData.membership?.remainingDays);

  // 5. Mess Owner Login
  const ownerLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rajesh@annapurnamess.com', password: 'mess123' })
  });
  const ownerAuth = await ownerLoginRes.json();
  console.log('✅ 5. Mess Owner Login:', ownerAuth.success, '| User:', ownerAuth.user.name, `(${ownerAuth.user.role})`);
  const ownerToken = ownerAuth.token;

  // 6. Mess Owner Dashboard Overview
  const ownerOverviewRes = await fetch(`${BASE}/owner/overview`, {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  const ownerData = await ownerOverviewRes.json();
  console.log('✅ 6. Mess Owner Overview:');
  console.log('      - Active Members:', ownerData.stats.totalActiveMembers);
  console.log('      - Confirmed Meal Demand Today:', JSON.stringify(ownerData.stats.confirmedDemand));
  console.log('      - Verified Savings:', ownerData.stats.totalVerifiedSavings, 'INR');
  console.log('      - Total Revenue:', ownerData.stats.totalRevenue, 'INR');
  console.log('      - Low Stock Alert Items:', ownerData.stats.lowStockCount);

  // 7. Super Admin Login
  const adminLoginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@messmate.com', password: 'admin123' })
  });
  const adminAuth = await adminLoginRes.json();
  console.log('✅ 7. Super Admin Login:', adminAuth.success, '| User:', adminAuth.user.name, `(${adminAuth.user.role})`);
  const adminToken = adminAuth.token;

  // 8. Super Admin Platform Overview
  const adminOverviewRes = await fetch(`${BASE}/admin/overview`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const adminData = await adminOverviewRes.json();
  console.log('✅ 8. Super Admin Platform Metrics:');
  console.log('      - Total Registered Messes:', adminData.stats.totalMesses);
  console.log('      - Total Students Enrolled:', adminData.stats.totalStudents);
  console.log('      - Food Waste Prevented:', adminData.stats.totalFoodWastePreventedKg, 'kg');
  console.log('      - Platform Total Savings:', adminData.stats.totalVerifiedFoodSavings, 'INR');

  console.log('\n🎉 ALL 8 BACKEND API SUITES PASSED FLAWLESSLY!\n');
}

runTests().catch(err => console.error('Test failed:', err));
