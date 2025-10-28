import { useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  useEffect(() => {
    const socket = io("http://localhost:5000"); // backend URL

    socket.on("newEvent", (event) => {
      alert(`🎉 New Event: ${event.name} at ${event.location}`);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Volunteer Events</h1>
    </div>
  );
}

export default App;
