import React, { useState } from "react";

import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Crud from "./components/Crud";

function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(
      localStorage.getItem("user") || "null"
    )
  );

  const [page, setPage] = useState("dashboard");

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className="app">
      <Sidebar
        user={user}
        page={page}
        setPage={setPage}
        logout={logout}
      />

      <main>
        <header>
          <div>
            <h1>
              {page[0].toUpperCase() +
                page.slice(1)}
            </h1>

            <span>
              Welcome, {user.username}
            </span>
          </div>
        </header>

        {page === "dashboard" ? (
          <Dashboard user={user} />
        ) : (
          <Crud page={page} user={user} />
        )}
      </main>
    </div>
  );
}

export default App;