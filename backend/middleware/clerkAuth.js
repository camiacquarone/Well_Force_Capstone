// backend/middleware/clerkAuth.js
const { ClerkExpressRequireAuth, clerkClient } = require('@clerk/clerk-sdk-node');

// Middleware 1: Requires authentication. If not authenticated, returns 401 Unauthorized.
// This is the core protection for your routes.
const requireAuth = ClerkExpressRequireAuth({
  // You can add options here, e.g., authorizedParties, custom JWT templates
  // For basic protection, no options are strictly needed here initially.
});

// Middleware 2: Fetches the full Clerk user object and attaches it to the request.
// This is useful if you need user's email, name, image_url etc. in your controller.
const populateClerkUser = async (req, res, next) => {
  // ClerkExpressRequireAuth (or ClerkExpressWithAuth) has already run and populated req.auth
  if (req.auth && req.auth.userId) {
    try {
      const clerkUser = await clerkClient.users.getUser(req.auth.userId);
      req.clerkUser = clerkUser; // Attach the full Clerk user object
    } catch (error) {
      console.error("Clerk Middleware Error: Failed to fetch full Clerk user data.", error);
      // Don't necessarily fail the request if user data fetch fails, but log it.
      // The request should still proceed if requireAuth passed.
      req.clerkUser = null; // Ensure it's null if fetch failed
    }
  } else {
    // This case usually means requireAuth did not run or user is not authenticated,
    // but defensive coding.
    req.clerkUser = null;
  }
  next(); // Pass control to the next middleware or route handler
};

module.exports = { requireAuth, populateClerkUser };