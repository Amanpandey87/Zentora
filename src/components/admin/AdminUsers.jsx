import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash, FaBan } from "react-icons/fa";

const AdminUsers = () => {
  const [data, setData] = useState([]);

  async function fetchData() {
    const res = await axios.get("http://localhost:9000/admin-users-list");
      setData(res?.data?.result);
  }

  const updateStatus = async (item) => {
    await axios.put("http://localhost:9000/admin-user-status", {
      userId: item._id,
      status: !item.status,
    });
    fetchData();
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:9000/admin-delete-user/${id}`);
    fetchData();
  };

  useEffect(() => {
    void Promise.resolve().then(fetchData);
  }, []);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <span className="dash-eyebrow">Zentora Admin</span>
          <h2 className="dash-heading">Manage Freelancers / Users</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="dash-card">
            <div className="table-responsive">
              <table className="table dash-table mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Credits</th>
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
                        <td>{item.type}</td>
                        <td>{item.credit}</td>
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
                            className="action-btn action-btn-block"
                            onClick={() => updateStatus(item)}
                          >
                            <FaBan /> {item.status ? "Block" : "Activate"}
                          </button>

                          <button
                            type="button"
                            className="action-btn action-btn-delete ms-2"
                            onClick={() => deleteUser(item._id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-3">
                        No Users Found
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

export default AdminUsers;