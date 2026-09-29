import React, { useState } from "react";
import api from "../api/api";

function Login({ onLogin }) {
  const [u, setU] = useState("admin");
  const [p, setP] = useState("Admin@123");
  const [err, setErr] = useState("");

  async function go(e) {
    e.preventDefault();

    try {
      const r = await api.post("/auth/login", {
        username: u,
        password: p,
      });

      localStorage.setItem("token", r.data.token);
      localStorage.setItem("user", JSON.stringify(r.data));

      onLogin(r.data);
    } catch (x) {
      setErr(x.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="login">
      <form onSubmit={go}>
        <h1>Military Asset Management</h1>

        <p>Secure logistics & accountability platform</p>

        <input
          value={u}
          onChange={(e) => setU(e.target.value)}
          placeholder="Username"
        />

        <input
          value={p}
          onChange={(e) => setP(e.target.value)}
          type="password"
          placeholder="Password"
        />

        {err && <div className="error">{err}</div>}

        <button type="submit">Sign In</button>

        <small>
          Demo: admin/Admin@123 · commander/Commander@123 ·
          logistics/Logistics@123
        </small>
      </form>
    </div>
  );
}

export default Login;