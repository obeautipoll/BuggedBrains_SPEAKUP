import React, { useState, useEffect } from "react";
import "../../styles-admin/monitor-admin.css";
import SideBar from "./components/SideBar";
import AdminNavbar from "./components/NavBar";
import { db } from "../../firebase/firebase";
import { collection, getDocs, orderBy, query, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../../contexts/authContext";

const AdminMonitorComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showModal, setShowModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    search: "",
  });

  

  // Form states
  const [feedback, setFeedback] = useState("");
  const [feedbackFiles, setFeedbackFiles] = useState([]);
  const [assignTo, setAssignTo] = useState("");
  const [assignMessage, setAssignMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [noteModalComplaint, setNoteModalComplaint] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteError, setNoteError] = useState("");
  const [staffRole, setStaffRole] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const normalizedRole = storedUser?.role?.toLowerCase() || "";
      if (normalizedRole === "staff" || normalizedRole === "kasama") {
        setStaffRole(normalizedRole);
      } else {
        setStaffRole("");
      }
    } catch (error) {
      console.error("Error determining staff role:", error);
      setStaffRole("");
    }
  }, []);

  // 🔥 Fetch complaints from Firestore
  useEffect(() => {
    if (staffRole === null) return;
    const fetchComplaints = async () => {
      try {
        const q = query(collection(db, "complaints"), orderBy("submissionDate", "desc"));
        const snapshot = await getDocs(q);

        const fetchedComplaints = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        let scopedComplaints = fetchedComplaints;
        if (staffRole) {
          scopedComplaints = fetchedComplaints.filter(
            (complaint) => (complaint.assignedRole || "").toLowerCase() === staffRole
          );
        }

        setComplaints(scopedComplaints);
        setFilteredComplaints(scopedComplaints);
      } catch (error) {
        console.error("❌ Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, [staffRole]);

  // 🔎 Filtering logic
  useEffect(() => {
    let filtered = complaints;

    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((c) => c.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(
        (c) =>
          (c.id && c.id.toLowerCase().includes(filters.search.toLowerCase())) ||
          (c.category && c.category.toLowerCase().includes(filters.search.toLowerCase())) ||
          (c.college && c.college.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    setFilteredComplaints(filtered);
  }, [filters, complaints]);

  // 📄 Modal logic
  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
    setActiveTab("details");
    setFeedback("");
    setFeedbackFiles([]);
    setAssignTo(complaint.assignedTo || "");
    setAssignMessage("");
    setNewStatus(complaint.status || "pending");
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
    setActiveTab("details");
  };

  

  // 💬 Feedback & Admin actions (same as before)
  const getAdminIdentifier = () => currentUser?.uid || currentUser?.email || "admin-user";

  const getAdminDisplayName = () =>
    currentUser?.displayName || currentUser?.email || "Admin User";

  const getSharedNote = (complaint) =>
    (complaint?.adminNotes && complaint.adminNotes[0]) || null;

  const openNoteModal = (complaint) => {
    if (!currentUser) {
      alert("You must be logged in to manage notes.");
      return;
    }

    if (!staffRole) {
      alert("We cannot determine your role yet. Please try again shortly.");
      return;
    }

    const existingNote = getSharedNote(complaint);
    setNoteModalComplaint(complaint);
    setNoteInput(existingNote?.note || "");
    setNoteError("");
  };

  const closeNoteModal = () => {
    setNoteModalComplaint(null);
    setNoteInput("");
    setNoteError("");
    setIsSavingNote(false);
  };

  const handleSaveAdminNote = async () => {
    if (!noteModalComplaint || !currentUser) return;
    if (!staffRole) {
      setNoteError("Your staff role is not set. Please reload and try again.");
      return;
    }

    if (!noteInput.trim()) {
      setNoteError("Please enter a note before saving.");
      return;
    }

    setIsSavingNote(true);
    setNoteError("");

    try {
      const adminId = getAdminIdentifier();
      const adminName = getAdminDisplayName();

      const updatedNote = {
        adminId,
        adminName,
        adminRole: staffRole || "staff",
        note: noteInput.trim(),
        updatedAt: new Date().toISOString(),
      };

      const updatedNotes = [updatedNote];

      const complaintRef = doc(db, "complaints", noteModalComplaint.id);
      await updateDoc(complaintRef, { adminNotes: updatedNotes });

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === noteModalComplaint.id
            ? { ...complaint, adminNotes: updatedNotes }
            : complaint
        )
      );

      if (selectedComplaint?.id === noteModalComplaint.id) {
        setSelectedComplaint((prev) =>
          prev ? { ...prev, adminNotes: updatedNotes } : prev
        );
      }

      closeNoteModal();
    } catch (error) {
      console.error("Error saving admin note:", error);
      setNoteError("Unable to save note right now. Please try again.");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      alert("Please enter feedback");
      return;
    }

    const newFeedback = {
      feedback,
      admin: "Current Admin",
      date: new Date().toISOString(),
      files: feedbackFiles.map((f) => f.name),
    };

    const updated = complaints.map((c) =>
      c.id === selectedComplaint.id
        ? { ...c, feedbackHistory: [...(c.feedbackHistory || []), newFeedback] }
        : c
    );

    setComplaints(updated);
    setSelectedComplaint({
      ...selectedComplaint,
      feedbackHistory: [...(selectedComplaint.feedbackHistory || []), newFeedback],
    });

    setFeedback("");
    setFeedbackFiles([]);
  };

  const openModalForStatusChange = (complaint) => {
  setSelectedComplaint(complaint);  // Set the selected complaint
  setNewStatus(complaint.status);   // Set the current status in the dropdown
  setShowModal(true);               // Show the modal
};
  const handleAssignComplaint = () => {
    if (!assignTo) {
      alert("Please select who to assign to");
      return;
    }

    const updated = complaints.map((c) =>
      c.id === selectedComplaint.id
        ? { ...c, assignedTo: assignTo }
        : c
    );

    setComplaints(updated);
    setSelectedComplaint({ ...selectedComplaint, assignedTo: assignTo });
  };

const handleUpdateStatus = async (newStatus) => {
  if (!newStatus || newStatus === selectedComplaint.status) return;

  // Add confirmation before update
  const confirmed = window.confirm(
    `Are you sure you want to change the status to "${newStatus}"?`
  );
  if (!confirmed) return; // If not confirmed, do nothing

  try {
    // Update the status in Firestore
    const complaintRef = doc(db, "complaints", selectedComplaint.id);
    await updateDoc(complaintRef, { status: newStatus });

    // Update the status in the UI (locally)
    const updatedComplaints = complaints.map((complaint) =>
      complaint.id === selectedComplaint.id
        ? { ...complaint, status: newStatus }
        : complaint
    );

    setComplaints(updatedComplaints);
    setSelectedComplaint({ ...selectedComplaint, status: newStatus });

  } catch (error) {
    console.error("❌ Error updating complaint status:", error);
  }
};

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "status-pending"; // CSS class for Pending status color
    case "in progress":
      return "status-in-progress"; // CSS class for In Progress status color
    case "resolved":
      return "status-resolved"; // CSS class for Resolved status color
    case "closed":
      return "status-closed"; // CSS class for Closed status color
    default:
      return "status-pending"; // Default to pending if no status is available
  }
};

  // 🧹 Utility helpers
  const formatDateTime = (date) => {
    if (!date) return "—";
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleString();
  };

  const getCategoryLabel = (category) => {
    const labels = {
      academic: "Academic",
      "faculty-conduct": "Faculty Conduct",
      facilities: "Facilities",
      "administrative-student-services": "Admin/Student Services",
      other: "Other",
    };
    return labels[category] || "—";
  };

  return (
    <div className="monitor-complaints-page">
      <SideBar />
      <AdminNavbar />

      <div className="main-content">
        <div className="page-header">
          <div>
            <h2>Monitor Student Complaints</h2>
            <p>View and manage all student complaints</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search by ID or College..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="all">All</option>
              <option value="academic">Academic</option>
              <option value="faculty-conduct">Faculty Conduct</option>
              <option value="facilities">Facilities</option>
              <option value="administrative-student-services">Admin/Student Services</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="filter-group">
           <p><strong>Status:</strong> 
            <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </p>
          </div>
        </div>

       {/* Table */} 
          <div className="table-container">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>College</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.college || "—"}</td>
                      <td>{getCategoryLabel(c.category)}</td>
                      <td>
                      <span 
                        className={`status-badge ${getStatusClass(c.status)}`}
                        onClick={() => openModalForStatusChange(c)}  // Open modal to change status
                        style={{ cursor: "pointer" }}  // Show pointer cursor on hover
                      >
                        {c.status || "Pending"}
                      </span>
                    </td>
                      <td>{formatDateTime(c.submissionDate)}</td>
                     
                      <td>
                        <button
                          className="btn-note"
                          onClick={() => openNoteModal(c)}
                          disabled={!currentUser}
                          title={
                            getSharedNote(c)
                              ? "Update the note for this assignment"
                              : "Add a note for this assignment"
                          }
                        >
                          {getSharedNote(c) ? "Update Note" : "Add Note"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

              {showModal && selectedComplaint && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Complaint #{selectedComplaint.id}</h3>
                <button className="btn-close" onClick={closeModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Category:</strong> {getCategoryLabel(selectedComplaint.category)}</p>
                <p><strong>Status:</strong> 
                  <select
                    value={newStatus}
                    onChange={(e) => handleUpdateStatus(e.target.value)}  // Handle status change immediately
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </p>
                <p><strong>Description:</strong></p>
                <p>
                  {selectedComplaint.concernDescription ||
                    selectedComplaint.incidentDescription ||
                    selectedComplaint.facilityDescription ||
                    selectedComplaint.otherDescription ||
                    "No description provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}
        {noteModalComplaint && (
          <div className="modal-overlay" onClick={closeNoteModal}>
            <div className="modal-container note-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  {getSharedNote(noteModalComplaint) ? "Update" : "Add"} Note - {noteModalComplaint.id}
                </h3>
                <button className="btn-close" onClick={closeNoteModal}>
                  ×
                </button>
              </div>
              <div className="modal-body">
                <textarea
                  className="note-textarea"
                  placeholder="Write a quick update for this complaint..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                {noteError && <p className="error-text">{noteError}</p>}
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={closeNoteModal} disabled={isSavingNote}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSaveAdminNote}
                  disabled={isSavingNote}
                >
                  {isSavingNote
                    ? "Saving..."
                    : getSharedNote(noteModalComplaint)
                    ? "Update Note"
                    : "Add Note"}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
    </div>
  );
};

export default AdminMonitorComplaints;
