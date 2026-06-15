const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = require('../app');
const User = require('../models/User');

const PORT = 5001;
const BASE_URL = `http://127.0.0.1:${PORT}/api`;

const testUsers = {
  user: {
    name: 'Test Regular User',
    email: 'testuser@example.com',
    password: 'Password123!',
    aadharNumber: '123456789012',
    role: 'user',
  },
  admin: {
    name: 'Test Admin User',
    email: 'testadmin@example.com',
    password: 'AdminPassword123!',
    aadharNumber: '987654321098',
    role: 'admin',
  },
};

let server;
let userToken = '';
let adminToken = '';
let regularUserId = '';
let adminUserId = '';

const runTests = async () => {
  console.log('--- Starting API Integration Tests ---');
  let passedCount = 0;
  let failedCount = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failedCount++;
    }
  };

  try {
    // 1. Clean up existing test users from database to ensure fresh state
    await User.deleteMany({
      email: { $in: [testUsers.user.email, testUsers.admin.email, 'duplicate@example.com'] },
    });
    await User.deleteMany({
      aadharNumber: { $in: [testUsers.user.aadharNumber, testUsers.admin.aadharNumber] },
    });

    console.log('Database cleaned up for test execution.');

    // 2. Test Register Validation (Weak password, short name, invalid Aadhar)
    console.log('\nTesting Registration Validation...');
    const invalidRegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ab', // short name
        email: 'invalid-email',
        password: '123', // weak password
        aadharNumber: '1234', // short aadhar
      }),
    });
    const invalidRegData = await invalidRegRes.json();
    assert(invalidRegRes.status === 400, `Should return 400 Bad Request for validation errors (got ${invalidRegRes.status})`);
    assert(invalidRegData.success === false, 'success field should be false');
    assert(Array.isArray(invalidRegData.errors) && invalidRegData.errors.length > 0, 'errors field should contain validation details');
    
    // Check if correct validation messages are returned
    const fieldsWithErrors = invalidRegData.errors.map(e => e.field);
    assert(fieldsWithErrors.includes('name'), 'Should identify name validation failure');
    assert(fieldsWithErrors.includes('email'), 'Should identify email validation failure');
    assert(fieldsWithErrors.includes('password'), 'Should identify password validation failure');
    assert(fieldsWithErrors.includes('aadharNumber'), 'Should identify aadharNumber validation failure');

    // 3. Test Successful Regular User Registration
    console.log('\nTesting Regular User Registration...');
    const regUserRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUsers.user),
    });
    const regUserData = await regUserRes.json();
    assert(regUserRes.status === 201, `Should return 201 Created (got ${regUserRes.status})`);
    assert(regUserData.success === true, 'success field should be true');
    assert(regUserData.message === 'User registered successfully', 'Correct registration message returned');
    assert(regUserData.data.user !== undefined, 'User data is returned');
    assert(regUserData.data.user.password === undefined, 'Password is NOT exposed in response');
    assert(regUserData.data.user.email === testUsers.user.email, 'Correct email returned');
    assert(regUserData.data.user.role === 'user', 'Default/assigned role is correct');
    regularUserId = regUserData.data.user._id;

    // 4. Test Duplicate Email Registration
    console.log('\nTesting Duplicate Email Registration...');
    const dupEmailRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testUsers.user,
        aadharNumber: '555555555555', // different aadhar to only trigger email duplicate
      }),
    });
    const dupEmailData = await dupEmailRes.json();
    assert(dupEmailRes.status === 409, `Should return 409 Conflict for duplicate email (got ${dupEmailRes.status})`);
    assert(dupEmailData.success === false, 'success field should be false');
    assert(dupEmailData.message.includes('Email'), 'Message should indicate email duplicate');

    // 5. Test Duplicate Aadhar Registration
    console.log('\nTesting Duplicate Aadhar Registration...');
    const dupAadharRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...testUsers.user,
        email: 'different-email@example.com', // different email to only trigger Aadhar duplicate
      }),
    });
    const dupAadharData = await dupAadharRes.json();
    assert(dupAadharRes.status === 409, `Should return 409 Conflict for duplicate Aadhar (got ${dupAadharRes.status})`);
    assert(dupAadharData.success === false, 'success field should be false');
    assert(dupAadharData.message.includes('Aadhar'), 'Message should indicate Aadhar duplicate');

    // 6. Test Admin Registration
    console.log('\nTesting Admin Registration...');
    const regAdminRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUsers.admin),
    });
    const regAdminData = await regAdminRes.json();
    assert(regAdminRes.status === 201, 'Admin registered successfully (201)');
    assert(regAdminData.data.user.role === 'admin', 'Role is set to admin');
    adminUserId = regAdminData.data.user._id;

    // 7. Test Login Validation
    console.log('\nTesting Login Validation...');
    const invalidLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '', password: '' }),
    });
    const invalidLoginData = await invalidLoginRes.json();
    assert(invalidLoginRes.status === 400, 'Should return 400 for empty login details');
    assert(invalidLoginData.success === false, 'Success should be false');

    // 8. Test Invalid Credentials Login
    console.log('\nTesting Invalid Credentials Login...');
    const wrongLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUsers.user.email, password: 'WrongPassword!' }),
    });
    const wrongLoginData = await wrongLoginRes.json();
    assert(wrongLoginRes.status === 401, 'Should return 401 for wrong credentials');
    assert(wrongLoginData.success === false, 'Success should be false');

    // 9. Test Successful User Login
    console.log('\nTesting Successful User Login...');
    const loginUserRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUsers.user.email, password: testUsers.user.password }),
    });
    const loginUserData = await loginUserRes.json();
    assert(loginUserRes.status === 200, 'Should return 200 OK for successful login');
    assert(loginUserData.success === true, 'Success should be true');
    assert(loginUserData.data.token !== undefined, 'Token should be returned');
    assert(loginUserData.data.user !== undefined, 'User details should be returned');
    assert(loginUserData.data.user.password === undefined, 'Password should not be exposed');
    userToken = loginUserData.data.token;

    // 10. Test Successful Admin Login
    console.log('\nTesting Successful Admin Login...');
    const loginAdminRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUsers.admin.email, password: testUsers.admin.password }),
    });
    const loginAdminData = await loginAdminRes.json();
    assert(loginAdminRes.status === 200, 'Should return 200 OK for successful admin login');
    adminToken = loginAdminData.data.token;

    // 11. Test Profile Route Protection (No Token)
    console.log('\nTesting Protected Profile Route (No Token)...');
    const profileNoTokenRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'GET',
    });
    const profileNoTokenData = await profileNoTokenRes.json();
    assert(profileNoTokenRes.status === 401, 'Should return 401 Unauthorized for no token');
    assert(profileNoTokenData.success === false, 'Success should be false');

    // 12. Test Profile Route Protection (Invalid Token)
    console.log('\nTesting Protected Profile Route (Invalid Token)...');
    const profileBadTokenRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer bad_token_here' },
    });
    const profileBadTokenData = await profileBadTokenRes.json();
    assert(profileBadTokenRes.status === 401, 'Should return 401 Unauthorized for bad token');
    assert(profileBadTokenData.success === false, 'Success should be false');

    // 13. Test Get Own Profile (Valid Token)
    console.log('\nTesting Get Profile (Valid User Token)...');
    const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    const profileData = await profileRes.json();
    assert(profileRes.status === 200, 'Should return 200 OK with valid user token');
    assert(profileData.success === true, 'Success should be true');
    assert(profileData.data.user.email === testUsers.user.email, 'Correct user profile returned');

    // 14. Test Update Own Profile (Valid Token)
    console.log('\nTesting Update Profile...');
    const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Updated User Name',
        aadharNumber: '222222222222', // updated aadhar
      }),
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, 'Should return 200 OK for profile update');
    assert(updateData.data.user.name === 'Updated User Name', 'Name should be updated');
    assert(updateData.data.user.aadharNumber === '222222222222', 'Aadhar should be updated');

    // 15. Test RBAC: User trying to access Admin Route
    console.log('\nTesting Authorization (User accessing admin route)...');
    const adminAccessRes = await fetch(`${BASE_URL}/admin/users`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${userToken}` },
    });
    const adminAccessData = await adminAccessRes.json();
    assert(adminAccessRes.status === 403, 'Should return 403 Forbidden for role unauthorized');
    assert(adminAccessData.success === false, 'Success should be false');
    assert(adminAccessData.message.includes('not authorized'), 'Should specify unauthorized role error');

    // 16. Test RBAC: Admin accessing Admin Routes (List Users)
    console.log('\nTesting Admin Access (List Users)...');
    const listUsersRes = await fetch(`${BASE_URL}/admin/users`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const listUsersData = await listUsersRes.json();
    assert(listUsersRes.status === 200, 'Should return 200 OK for admin viewing users');
    assert(listUsersData.success === true, 'Success is true');
    assert(Array.isArray(listUsersData.data.users) && listUsersData.data.users.length >= 2, 'Should return a list of users');

    // 17. Test RBAC: Admin accessing Admin Routes (Get User by ID)
    console.log('\nTesting Admin Access (Get User by ID)...');
    const getUserRes = await fetch(`${BASE_URL}/admin/users/${regularUserId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const getUserData = await getUserRes.json();
    assert(getUserRes.status === 200, 'Should return 200 OK for admin fetching user by id');
    assert(getUserData.data.user.email === testUsers.user.email, 'Should return the requested user details');

    // 18. Test RBAC: Admin accessing Admin Routes (Delete User)
    console.log('\nTesting Admin Access (Delete User)...');
    const deleteUserRes = await fetch(`${BASE_URL}/admin/users/${regularUserId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const deleteUserData = await deleteUserRes.json();
    assert(deleteUserRes.status === 200, 'Should return 200 OK for admin deleting user');
    assert(deleteUserData.message === 'User deleted successfully', 'Correct delete message returned');

    // Verify user is deleted
    const verifyDeleteRes = await fetch(`${BASE_URL}/admin/users/${regularUserId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    assert(verifyDeleteRes.status === 404, 'User should no longer exist (404 Not Found)');

    // 19. Clean up tests (Delete admin user)
    await User.findByIdAndDelete(adminUserId);
    console.log('Cleanup finished.');

  } catch (error) {
    console.error('Fatal test error encountered:', error);
    failedCount++;
  } finally {
    console.log(`\n--- Test Execution Summary ---`);
    console.log(`Total tests run: ${passedCount + failedCount}`);
    console.log(`Passed: ${passedCount}`);
    console.log(`Failed: ${failedCount}`);

    // Clean shut down
    if (server) {
      server.close(async () => {
        console.log('Server stopped.');
        try {
          await mongoose.connection.close();
          console.log('Mongoose connection closed.');
        } catch (err) {
          console.error('Error closing Mongoose connection:', err);
        }
        process.exit(failedCount > 0 ? 1 : 0);
      });
    } else {
      try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed.');
      } catch (err) {
        console.error('Error closing Mongoose connection:', err);
      }
      process.exit(failedCount > 0 ? 1 : 0);
    }
  }
};

// Start Express Server for Integration Tests
console.log('Connecting to database for test server...');
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Database connected.');
    server = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      runTests();
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
