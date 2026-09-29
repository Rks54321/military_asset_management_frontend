import React, { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard({ user }) {
  const [data, setData] = useState({});
  const [bases, setBases] = useState([]);
  const [eq, setEq] = useState([]);

  const [base, setBase] = useState(user.baseId || "");
  const [equip, setEquip] = useState("");

  useEffect(() => {
    load();
  }, [base, equip]);

  async function load() {
    const h = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    try {
      const [d, b, e] = await Promise.all([
        api.get("/dashboard/summary", {
          params: {
            baseId: base || undefined,
            equipmentId: equip || undefined,
          },
          headers: h,
        }),

        api.get("/bases", {
          headers: h,
        }),

        api.get("/equipment", {
          headers: h,
        }),
      ]);

      setData(d.data);
      setBases(b.data);
      setEq(e.data);
    } catch (error) {
      console.error("Dashboard loading failed:", error);
    }
  }

  return (
    <>
      <div className="filters">
        <select
          value={base}
          onChange={(e) => setBase(e.target.value)}
        >
          <option value="">All Bases</option>

          {bases.map((b) => (
            <option value={b.id} key={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={equip}
          onChange={(e) => setEquip(e.target.value)}
        >
          <option value="">All Equipment</option>

          {eq.map((x) => (
            <option value={x.id} key={x.id}>
              {x.name}
            </option>
          ))}
        </select>
      </div>

      <div className="cards">
        {[
          ["Opening Balance", data.openingBalance],
          ["Net Movement", data.netMovement],
          ["Closing Balance", data.closingBalance],
          ["Assigned", data.assigned],
          ["Expended", data.expended],
        ].map(([a, v]) => (
          <div className="card" key={a}>
            <span>{a}</span>
            <strong>{v ?? 0}</strong>
          </div>
        ))}
      </div>

      <div className="movement">
        <h2>Net Movement Details</h2>

        <p>
          Purchases <b>+{data.purchases || 0}</b>
        </p>

        <p>
          Transfer In <b>+{data.transferIn || 0}</b>
        </p>

        <p>
          Transfer Out <b>-{data.transferOut || 0}</b>
        </p>
      </div>
    </>
  );
}

export default Dashboard;