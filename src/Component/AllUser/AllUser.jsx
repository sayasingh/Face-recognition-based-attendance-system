import React, { useEffect, useState } from "react";
import "./AllUSer.css";
import axios from "axios";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null); // store user being edited
  const [formData, setFormData] = useState({ fullName: "", email: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/getAll");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      alert("User deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user); // open modal
    setFormData({
      fullName: user.fullName,
      email: user.email,
    });
  };

  const closeEditModal = () => {
    setEditingUser(null); // close modal
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/user/${editingUser._id}`,
        formData
      );
      alert(res.data.message || "User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error updating the user");
    }
  };

  return (
    <div className="table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>FullName</th>
            <th>Username</th>
            <th>Email Address</th>
            <th>RegisterDate</th>
            <th>Present Rate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.fullName}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toISOString().split("T")[0]}</td>
              <td>{user.presentCount}</td>
              <td className="action-btns">
                <button
                  onClick={() => openEditModal(user)}
                  style={{
                    backgroundColor: "white",
                    color: "#C93C33",
                    border: "1px solid #C93C33",
                    padding: "5px",
                    width: "75px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginRight: "5px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  style={{
                    backgroundColor: "#C93C33",
                    color: "white",
                    border: "none",
                    padding: "5px",
                    width: "75px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing user */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              style={{ display: "block", margin: "10px 0", width: "100%" }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style={{ display: "block", margin: "10px 0", width: "100%" }}
            />

            <div style={{ marginTop: "15px" }}>
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={closeEditModal}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUser;


