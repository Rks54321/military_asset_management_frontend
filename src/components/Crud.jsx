import React, { useEffect, useState } from "react";
import api from "../api/api";

function Crud({ page, user }) {
  const config = {
    purchases: {
      fields: [
        ["baseId", "Base"],
        ["equipmentId", "Equipment"],
        ["quantity", "Quantity"],
        ["reference", "Reference"],
      ],
      post: "/purchases",
      get: "/purchases",
    },

    transfers: {
      fields: [
        ["fromBaseId", "From Base"],
        ["toBaseId", "To Base"],
        ["equipmentId", "Equipment"],
        ["quantity", "Quantity"],
        ["reference", "Reference"],
      ],
      post: "/transfers",
      get: "/transfers",
    },

    assignments: {
      fields: [
        ["baseId", "Base"],
        ["equipmentId", "Equipment"],
        ["personnelName", "Personnel Name"],
        ["quantity", "Quantity"],
      ],
      post: "/assignments",
      get: "/assignments",
    },

    expenditures: {
      fields: [
        ["baseId", "Base"],
        ["equipmentId", "Equipment"],
        ["quantity", "Quantity"],
        ["reason", "Reason"],
      ],
      post: "/expenditures",
      get: "/expenditures",
    },

    audit: {
      fields: [],
      get: "/audit-logs",
    },
  }[page];

  const [data, setData] = useState([]);
  const [bases, setBases] = useState([]);
  const [eq, setEq] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    load();
  }, [page]);

  async function load() {
    const h = {
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    try {
      const r = await api.get(config.get, {
        headers: h,
      });

      setData(r.data);
    } catch (e) {
      setData([]);
    }

    try {
      const [b, e] = await Promise.all([
        api.get("/bases", { headers: h }),
        api.get("/equipment", { headers: h }),
      ]);

      setBases(b.data);
      setEq(e.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function submit(e) {
    e.preventDefault();

    const body = { ...form };

    for (const k of Object.keys(body)) {
      if (
        [
          "baseId",
          "toBaseId",
          "fromBaseId",
          "equipmentId",
          "quantity",
        ].includes(k)
      ) {
        body[k] = Number(body[k]);
      }
    }

    try {
      await api.post(config.post, body, {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("token"),
        },
      });

      setForm({});
      load();

      alert("Saved successfully");
    } catch (x) {
      alert(
        x.response?.data?.error ||
          "Operation failed"
      );
    }
  }

  const role = user.role;

  const can =
    page === "purchases" || page === "transfers"
      ? role === "ADMIN" ||
        role === "LOGISTICS_OFFICER"
      : page === "assignments" ||
        page === "expenditures"
      ? role === "ADMIN" ||
        role === "BASE_COMMANDER"
      : false;

  return (
    <>
      <div className="panel">
        {can && (
          <form onSubmit={submit}>
            <h2>
              New {page.slice(0, -1)}
            </h2>

            {config.fields.map(([k, l]) => (
              <div key={k}>
                {k.includes("baseId") ? (
                  <select
                    required
                    value={form[k] || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [k]: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select {l}
                    </option>

                    {bases.map((b) => (
                      <option
                        key={b.id}
                        value={b.id}
                      >
                        {b.name}
                      </option>
                    ))}
                  </select>
                ) : k === "equipmentId" ? (
                  <select
                    required
                    value={form[k] || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [k]: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select Equipment
                    </option>

                    {eq.map((x) => (
                      <option
                        key={x.id}
                        value={x.id}
                      >
                        {x.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    value={form[k] || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [k]: e.target.value,
                      })
                    }
                    placeholder={l}
                  />
                )}
              </div>
            ))}

            <button type="submit">
              Save
            </button>
          </form>
        )}

        {!can && page !== "audit" && (
          <p className="notice">
            Your role has read-only access to
            this section.
          </p>
        )}
      </div>

      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              {data.length ? (
                Object.keys(data[0])
                  .filter(
                    (k) => k !== "password"
                  )
                  .map((k) => (
                    <th key={k}>{k}</th>
                  ))
              ) : (
                <th>Data</th>
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                {Object.entries(r)
                  .filter(
                    ([k]) => k !== "password"
                  )
                  .map(([k, v]) => (
                    <td key={k}>
                      {typeof v === "object" && v
                        ? v.name ||
                          v.username ||
                          JSON.stringify(v)
                        : String(v ?? "")}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>

        {!data.length && (
          <p>No records found.</p>
        )}
      </div>
    </>
  );
}

export default Crud;