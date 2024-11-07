import { useState } from 'react';

const ChatComponent = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Method 1: Using fetch with CORS headers
  const sendMessage = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost/chat-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add CORS headers
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        // Add credentials if needed (e.g., for cookies)
        // credentials: 'include',
        body: JSON.stringify({
          query: "Hii"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button 
        onClick={sendMessage}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>

      {error && (
        <div className="text-red-500 mt-4">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h3 className="font-bold">Response:</h3>
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;