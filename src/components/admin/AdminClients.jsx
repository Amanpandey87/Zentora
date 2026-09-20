import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const AdminClients = () => {
  const [data, setData] = useState([]);

  async function fetchData() {
    const res = await axios.get('/admin-clients-list');
      setData(res?.data?.result);
  }

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, []);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <span className="dash-eyebrow">Zentora Admin</span>
          <h2 className="dash-heading">Manage Clients</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="dash-card">
            <div className="table-responsive">
              <table className="table dash-table mb-0">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    data.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>
                          <span
                            className={
                              item.status ? "status-ok" : "status-danger"
                            }
                          >
                            {item.status ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="action-btn action-btn-delete"
                          >
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-3">
                        No Clients Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClients;