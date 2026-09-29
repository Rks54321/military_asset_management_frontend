import React from "react";

function Sidebar({ user, page, setPage, logout }) {
  const pages = [
    "dashboard",
    "purchases",
    "transfers",
    "assignments",
    "expenditures",
    "audit",
  ];

  return (
    <aside>
      <h2>MAMS</h2>

      <div className="role">
        {user.role.replaceAll("_", " ")}
      </div>

      {pages.map((x) => (
        <button
          key={x}
          className={page === x ? "active" : ""}
          onClick={() => setPage(x)}
        >
          {x}
        </button>
      ))}

      <button onClick={logout}>Logout</button>
    </aside>
  );
}

export default Sidebar;