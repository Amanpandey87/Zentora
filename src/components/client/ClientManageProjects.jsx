import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import axios from 'axios'

const ClientManageProjects = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  async function fetchData() {
    const info = JSON.parse(localStorage.getItem('info'));
    const clientId = info?._id;
    const res = await axios.get(`/client-project-list?clientId=${clientId}`)
    setData(res?.data?.result)
  }
  useEffect(() => {
    void Promise.resolve().then(fetchData)
  }, [])
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <span className="dash-eyebrow">Zentora for Clients</span>
          <h2 className="dash-heading">Your Posted Projects</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="dash-card">
            <div className="row mb-3">
              <div className="col-12">
                <h4>Your Posted Projects</h4>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table dash-table mb-0">
                    <thead>
                      <tr>
                        <th>Project Title</th>
                        <th>Description</th>
                        <th>Budget</th>
                        <th>Timeline</th>
                        <th>Manage</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((item) => {
                        return (
                          <tr>
                            <td>{item?.title}</td>
                            <td>{item?.desc}</td>
                            <td>{item?.budget}</td>
                            <td>{item?.duration}</td>
                            <td><button
                              onClick={() => {
                                navigate('/client-review-bids',{state:item})
                              }}
                              type="button" className="action-btn action-btn-delete">Details</button> </td>
                            <td>
                              <button type="button" className="action-btn action-btn-delete"><FaTrash /> Delete</button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientManageProjects