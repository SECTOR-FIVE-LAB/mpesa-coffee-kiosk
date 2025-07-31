{showLogoutModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-4">Are you sure you want to log out?</h2>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleLogoutConfirm}
          >
            Yes, Log Out
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            onClick={() => setShowLogoutModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
  