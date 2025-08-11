import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/server/auth/config';
import { connectToDatabase } from '@/server/db/connect';
import { User } from '@/server/db/models';

/**
 * Debug dashboard page to troubleshoot authentication issues
 * This will show us exactly what's happening with the session and user data
 */
export default async function DebugDashboardPage() {
  let debugInfo: any = {
    session: null,
    user: null,
    error: null,
    dbConnection: false,
  };

  try {
    // Step 1: Check session
    const session = await getServerSession(authOptions);
    debugInfo.session = session;

    if (!session) {
      debugInfo.error = 'No session found';
    } else {
      // Step 2: Check database connection
      try {
        await connectToDatabase();
        debugInfo.dbConnection = true;

        // Step 3: Try to find user in database
        if (session.user?.id) {
          const user = await User.findById(session.user.id);
          debugInfo.user = user ? {
            id: user._id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            role: user.role,
          } : null;

          if (!user) {
            debugInfo.error = 'User not found in database';
          } else if (!user.isActive) {
            debugInfo.error = 'User is not active';
          }
        } else {
          debugInfo.error = 'No user ID in session';
        }
      } catch (dbError) {
        debugInfo.error = `Database error: ${dbError}`;
      }
    }
  } catch (error) {
    debugInfo.error = `Session error: ${error}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🔍 Authentication Debug Information
          </h1>
          
          <div className="space-y-6">
            {/* Session Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Session Data
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo.session, null, 2)}
                </pre>
              </div>
            </div>

            {/* Database Connection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Database Connection
              </h2>
              <div className={`p-4 rounded ${
                debugInfo.dbConnection 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {debugInfo.dbConnection ? '✅ Connected' : '❌ Not Connected'}
              </div>
            </div>

            {/* User Data */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                User Data from Database
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo.user, null, 2)}
                </pre>
              </div>
            </div>

            {/* Error Info */}
            {debugInfo.error && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Error
                </h2>
                <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4 rounded">
                  {debugInfo.error}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Possible Solutions
              </h2>
              <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 p-4 rounded">
                <ul className="list-disc list-inside space-y-1">
                  <li>If no session: Check environment variables (NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, etc.)</li>
                  <li>If session but no user: The user might not exist in the database yet</li>
                  <li>If user inactive: Check user.isActive field in database</li>
                  <li>If database error: Check MONGODB_URI in .env.local</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
