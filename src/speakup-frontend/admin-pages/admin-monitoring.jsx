import React, { useState, useEffect } from "react";
import "../styles-admin/monitor-admin.css";
import SideBar from "./components/SideBar";
import AdminNavbar from "./components/NavBar";

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
    search: ""
  });

  // Form states
  const [feedback, setFeedback] = useState("");
  const [feedbackFiles, setFeedbackFiles] = useState([]);
  const [notes, setNotes] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [assignMessage, setAssignMessage] = useState("");
  const [newStatus, setNewStatus] = useState("");

  // Mock data - Replace with API call
  useEffect(() => {
    // Fetch complaints from backend
    const mockComplaints = [
      {
        complaintID: "C1021",
        college: "CCS",
        category: "academic",
        status: "pending",
        dateSubmitted: "2025-10-19T10:30:00",
        courseTitle: "ITE184 - Social, Legal, and Professional Issues",
        instructor: "Prof. Santos",
        concernDescription: "The grading system seems unfair. Several students received grades that don't reflect their actual performance.",
        impactExperience: "This has caused significant stress and demotivation.",
        gradingFairness: "unfair",
        lessonSatisfaction: "unsatisfied",
        workloadStress: "often",
        attachment: "proof.pdf",
        adminNotes: [],
        feedbackHistory: [],
        assignedTo: null,
        priority: "high"
      },
      {
        complaintID: "C1022",
        college: "CSM",
        category: "facilities",
        status: "in-progress",
        dateSubmitted: "2025-10-18T14:20:00",
        facilityLocation: "CSM Building, Room 102",
        facilityDescription: "The air conditioning system is broken and the room temperature is unbearable during afternoon classes.",
        observedDateTime: "2025-10-18T13:00",
        facilitySatisfaction: "very-unsatisfied",
        facilityFrequency: "frequently",
        facilitySafety: "unsafe",
        attachment: "facility_photo.jpg",
        adminNotes: [
          { note: "Forwarded to maintenance", admin: "Admin 1", date: "2025-10-18T15:00:00" }
        ],
        feedbackHistory: [
          { feedback: "We have received your complaint and are working on it.", admin: "Admin 1", date: "2025-10-18T15:30:00" }
        ],
        assignedTo: "Maintenance Dept.",
        priority: "medium"
      },
      {
        complaintID: "C1023",
        college: "CED",
        category: "faculty-conduct",
        status: "resolved",
        dateSubmitted: "2025-10-15T09:15:00",
        departmentOffice: "College of Engineering",
        incidentDescription: "The instructor consistently arrives 20-30 minutes late to class.",
        incidentDate: "2025-10-14",
        incidentFrequency: "often",
        respectLevel: "disrespectful",
        professionalism: "unprofessional",
        similarBehavior: "sometimes",
        adminNotes: [
          { note: "Meeting scheduled with faculty member", admin: "Admin 2", date: "2025-10-15T10:00:00" },
          { note: "Issue resolved, faculty apologized", admin: "Admin 2", date: "2025-10-16T14:00:00" }
        ],
        feedbackHistory: [
          { feedback: "Thank you for reporting. We have addressed this with the faculty member.", admin: "Admin 2", date: "2025-10-16T14:30:00", files: ["resolution_memo.pdf"] }
        ],
        assignedTo: "Academic Affairs",
        priority: "high"
      },
      {
        complaintID: "C1024",
        college: "CHS",
        category: "administrative-student-services",
        status: "pending",
        dateSubmitted: "2025-10-20T11:00:00",
        officeInvolved: "Registrar's Office",
        concernFeedback: "The document processing is taking too long. I've been waiting for my transcript for 3 weeks.",
        transactionDate: "2025-09-29",
        serviceEfficiency: "very-inefficient",
        communicationSatisfaction: "unsatisfied",
        serviceAccessibility: "difficult",
        adminNotes: [],
        feedbackHistory: [],
        assignedTo: null,
        priority: "low"
      }
    ];

    setComplaints(mockComplaints);
    setFilteredComplaints(mockComplaints);
  }, []);

  // Filter complaints
  useEffect(() => {
    let filtered = complaints;

    if (filters.category !== "all") {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    if (filters.status !== "all") {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(c => 
        c.complaintID.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.college.toLowerCase().includes(filters.search.toLowerCase())      
      );
    }

    setFilteredComplaints(filtered);
  }, [filters, complaints]);

  const openModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
    setActiveTab("details");
    setNotes("");
    setFeedback("");
    setFeedbackFiles([]);
    setAssignTo(complaint.assignedTo || "");
    setAssignMessage("");
    setNewStatus(complaint.status);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
    setActiveTab("details");
  };

  const handleAddNote = () => {
    if (!notes.trim()) {
      alert("Please enter a note");
      return;
    }

    const newNote = {
      note: notes,
      admin: "Current Admin", // Replace with actual admin name
      date: new Date().toISOString()
    };

    const updatedComplaints = complaints.map(c => {
      if (c.complaintID === selectedComplaint.complaintID) {
        return {
          ...c,
          adminNotes: [...c.adminNotes, newNote]
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    setSelectedComplaint({
      ...selectedComplaint,
      adminNotes: [...selectedComplaint.adminNotes, newNote]
    });
    setNotes("");
    alert("Note added successfully!");
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      alert("Please enter feedback");
      return;
    }

    const newFeedback = {
      feedback: feedback,
      admin: "Current Admin",
      date: new Date().toISOString(),
      files: feedbackFiles.map(f => f.name)
    };

    const updatedComplaints = complaints.map(c => {
      if (c.complaintID === selectedComplaint.complaintID) {
        return {
          ...c,
          feedbackHistory: [...c.feedbackHistory, newFeedback]
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    setSelectedComplaint({
      ...selectedComplaint,
      feedbackHistory: [...selectedComplaint.feedbackHistory, newFeedback]
    });
    setFeedback("");
    setFeedbackFiles([]);
    alert("Feedback sent successfully!");
  };

  const handleAssignComplaint = () => {
    if (!assignTo) {
      alert("Please select who to assign to");
      return;
    }

    const updatedComplaints = complaints.map(c => {
      if (c.complaintID === selectedComplaint.complaintID) {
        return {
          ...c,
          assignedTo: assignTo,
          adminNotes: [
            ...c.adminNotes,
            {
              note: `Assigned to ${assignTo}. Message: ${assignMessage || "No message"}`,
              admin: "Current Admin",
              date: new Date().toISOString()
            }
          ]
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    setSelectedComplaint({
      ...selectedComplaint,
      assignedTo: assignTo
    });
    setAssignMessage("");
    alert(`Complaint assigned to ${assignTo}!`);
  };

  const handleUpdateStatus = () => {
    if (newStatus === selectedComplaint.status) {
      alert("Status is already set to this value");
      return;
    }

    const updatedComplaints = complaints.map(c => {
      if (c.complaintID === selectedComplaint.complaintID) {
        return {
          ...c,
          status: newStatus,
          adminNotes: [
            ...c.adminNotes,
            {
              note: `Status changed from ${c.status} to ${newStatus}`,
              admin: "Current Admin",
              date: new Date().toISOString()
            }
          ]
        };
      }
      return c;
    });

    setComplaints(updatedComplaints);
    setSelectedComplaint({
      ...selectedComplaint,
      status: newStatus
    });
    alert("Status updated successfully!");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFeedbackFiles([...feedbackFiles, ...files]);
  };

  const removeFile = (index) => {
    setFeedbackFiles(feedbackFiles.filter((_, i) => i !== index));
  };

  const exportCSV = () => {
    const headers = ["ID", "College", "Category", "Status", "Date", "Priority"];
    const csvData = filteredComplaints.map(c => [
      c.complaintID,
      c.college,
      c.category,
      c.status,
      new Date(c.dateSubmitted).toLocaleDateString(),
      c.priority
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaints_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      academic: "Academic",
      "faculty-conduct": "Faculty Conduct",
      facilities: "Facilities",
      "administrative-student-services": "Administrative/Student Services",
      other: "Other"
    };
    return labels[category] || category;
  };

  const renderComplaintDetails = () => {
    if (!selectedComplaint) return null;

    const commonFields = (
      <>
        <div className="detail-item">
          <strong>Complaint ID:</strong>
          <span>{selectedComplaint.complaintID}</span>
        </div>
        <div className="detail-item">
          <strong>College:</strong>
          <span>{selectedComplaint.college}</span>
        </div>
        <div className="detail-item">
          <strong>Category:</strong>
          <span className="category-badge">{getCategoryLabel(selectedComplaint.category)}</span>
        </div>
        <div className="detail-item">
          <strong>Status:</strong>
          <span className={`status-badge ${selectedComplaint.status}`}>
            {selectedComplaint.status}
          </span>
        </div>
        <div className="detail-item">
          <strong>Priority:</strong>
          <span className={`priority-badge ${selectedComplaint.priority}`}>
            {selectedComplaint.priority}
          </span>
        </div>
        <div className="detail-item">
          <strong>Date Submitted:</strong>
          <span>{formatDateTime(selectedComplaint.dateSubmitted)}</span>
        </div>
        <div className="detail-item">
          <strong>Assigned To:</strong>
          <span>{selectedComplaint.assignedTo || "Unassigned"}</span>
        </div>
      </>
    );

    // Render category-specific fields
    let categoryFields = null;

    switch (selectedComplaint.category) {
      case "academic":
        categoryFields = (
          <>
            <div className="detail-section">
              <h4>Academic Details</h4>
              <div className="detail-item">
                <strong>Course/Subject:</strong>
                <span>{selectedComplaint.courseTitle}</span>
              </div>
              <div className="detail-item">
                <strong>Instructor:</strong>
                <span>{selectedComplaint.instructor || "Not specified"}</span>
              </div>
              <div className="detail-item full-width">
                <strong>Concern Description:</strong>
                <p>{selectedComplaint.concernDescription}</p>
              </div>
              <div className="detail-item full-width">
                <strong>Impact on Experience:</strong>
                <p>{selectedComplaint.impactExperience}</p>
              </div>
              <div className="detail-item">
                <strong>Grading Fairness:</strong>
                <span className="rating">{selectedComplaint.gradingFairness}</span>
              </div>
              <div className="detail-item">
                <strong>Lesson Satisfaction:</strong>
                <span className="rating">{selectedComplaint.lessonSatisfaction}</span>
              </div>
              <div className="detail-item">
                <strong>Workload Stress:</strong>
                <span className="rating">{selectedComplaint.workloadStress}</span>
              </div>
            </div>
          </>
        );
        break;

      case "faculty-conduct":
        categoryFields = (
          <>
            <div className="detail-section">
              <h4>Faculty Conduct Details</h4>
              <div className="detail-item">
                <strong>Department/Office:</strong>
                <span>{selectedComplaint.departmentOffice}</span>
              </div>
              <div className="detail-item full-width">
                <strong>Incident Description:</strong>
                <p>{selectedComplaint.incidentDescription}</p>
              </div>
              <div className="detail-item">
                <strong>Incident Date:</strong>
                <span>{selectedComplaint.incidentDate}</span>
              </div>
              <div className="detail-item">
                <strong>Frequency:</strong>
                <span>{selectedComplaint.incidentFrequency}</span>
              </div>
              <div className="detail-item">
                <strong>Respect Level:</strong>
                <span className="rating">{selectedComplaint.respectLevel}</span>
              </div>
              <div className="detail-item">
                <strong>Professionalism:</strong>
                <span className="rating">{selectedComplaint.professionalism}</span>
              </div>
              <div className="detail-item">
                <strong>Similar Behavior:</strong>
                <span>{selectedComplaint.similarBehavior}</span>
              </div>
              {selectedComplaint.additionalContext && (
                <div className="detail-item full-width">
                  <strong>Additional Context:</strong>
                  <p>{selectedComplaint.additionalContext}</p>
                </div>
              )}
            </div>
          </>
        );
        break;

      case "facilities":
        categoryFields = (
          <>
            <div className="detail-section">
              <h4>Facility Details</h4>
              <div className="detail-item">
                <strong>Location:</strong>
                <span>{selectedComplaint.facilityLocation}</span>
              </div>
              <div className="detail-item">
                <strong>Observed Date/Time:</strong>
                <span>{formatDateTime(selectedComplaint.observedDateTime)}</span>
              </div>
              <div className="detail-item full-width">
                <strong>Issue Description:</strong>
                <p>{selectedComplaint.facilityDescription}</p>
              </div>
              <div className="detail-item">
                <strong>Facility Satisfaction:</strong>
                <span className="rating">{selectedComplaint.facilitySatisfaction}</span>
              </div>
              <div className="detail-item">
                <strong>Issue Frequency:</strong>
                <span>{selectedComplaint.facilityFrequency}</span>
              </div>
              <div className="detail-item">
                <strong>Safety Rating:</strong>
                <span className="rating">{selectedComplaint.facilitySafety}</span>
              </div>
            </div>
          </>
        );
        break;

      case "administrative-student-services":
        categoryFields = (
          <>
            <div className="detail-section">
              <h4>Administrative Service Details</h4>
              <div className="detail-item">
                <strong>Office Involved:</strong>
                <span>{selectedComplaint.officeInvolved}</span>
              </div>
              <div className="detail-item">
                <strong>Transaction Date:</strong>
                <span>{selectedComplaint.transactionDate}</span>
              </div>
              <div className="detail-item full-width">
                <strong>Concern/Feedback:</strong>
                <p>{selectedComplaint.concernFeedback}</p>
              </div>
              {selectedComplaint.additionalNotes && (
                <div className="detail-item full-width">
                  <strong>Additional Notes:</strong>
                  <p>{selectedComplaint.additionalNotes}</p>
                </div>
              )}
              <div className="detail-item">
                <strong>Service Efficiency:</strong>
                <span className="rating">{selectedComplaint.serviceEfficiency}</span>
              </div>
              <div className="detail-item">
                <strong>Communication:</strong>
                <span className="rating">{selectedComplaint.communicationSatisfaction}</span>
              </div>
              <div className="detail-item">
                <strong>Accessibility:</strong>
                <span className="rating">{selectedComplaint.serviceAccessibility}</span>
              </div>
            </div>
          </>
        );
        break;

      default:
        categoryFields = (
          <div className="detail-section">
            <h4>Other Details</h4>
            <div className="detail-item full-width">
              <strong>Description:</strong>
              <p>{selectedComplaint.otherDescription}</p>
            </div>
          </div>
        );
    }

    return (
      <>
        <div className="detail-section">
          <h4>General Information</h4>
          {commonFields}
        </div>
        {categoryFields}
        {selectedComplaint.attachment && (
          <div className="detail-section">
            <h4>Attachments</h4>
            <div className="attachment-item">
              <span>📎 {selectedComplaint.attachment}</span>
              <button className="btn-link">Download</button>
            </div>
          </div>
        )}
      </>
    );
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
          <div className="header-actions">
            <button className="btn-export" onClick={exportCSV}>
              📊 Export CSV
            </button>
            <button className="btn-export" onClick={() => alert("PDF export coming soon")}>
              📄 Download PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search by ID, Keywords name..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="filter-group">
            <label>Category:</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="faculty-conduct">Faculty Conduct</option>
              <option value="facilities">Facilities</option>
              <option value="administrative-student-services">Admin/Student Services</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{complaints.length}</h3>
            <p>Total Complaints</p>
          </div>
          <div className="stat-card pending">
            <h3>{complaints.filter(c => c.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card progress">
            <h3>{complaints.filter(c => c.status === 'in-progress').length}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card resolved">
            <h3>{complaints.filter(c => c.status === 'resolved').length}</h3>
            <p>Resolved</p>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="table-container">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>College</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">No complaints found</td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.complaintID}>
                    <td className="id-cell">{complaint.complaintID}</td>
                    <td>
                      <div className="student-cell">
                        <div className="student-name">{complaint.college}</div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{getCategoryLabel(complaint.category)}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${complaint.status}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${complaint.priority}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(complaint.dateSubmitted).toLocaleDateString()}
                    </td>
                    <td>{complaint.assignedTo || <span className="unassigned">Unassigned</span>}</td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => openModal(complaint)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedComplaint && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Complaint #{selectedComplaint.complaintID}</h3>
                <p className="modal-subtitle">{selectedComplaint.college} • {getCategoryLabel(selectedComplaint.category)}</p>
              </div>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-tabs">
              <button
                className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                📋 Details
              </button>
              <button
                className={`tab-btn ${activeTab === "feedback" ? "active" : ""}`}
                onClick={() => setActiveTab("feedback")}
              >
                💬 Feedback
              </button>
              <button
                className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
                onClick={() => setActiveTab("notes")}
              >
                📝 Notes
              </button>
              <button
                className={`tab-btn ${activeTab === "assign" ? "active" : ""}`}
                onClick={() => setActiveTab("assign")}
              >
                👤 Assign
              </button>
              <button
                className={`tab-btn ${activeTab === "status" ? "active" : ""}`}
                onClick={() => setActiveTab("status")}
              >
                🔄 Status
              </button>
            </div>

            <div className="modal-body">
              {activeTab === "details" && (
                <div className="tab-content">
                  {renderComplaintDetails()}
                </div>
              )}

              {activeTab === "feedback" && (
                <div className="tab-content">
                  <h4>Feedback History</h4>
                  {selectedComplaint.feedbackHistory.length === 0 ? (
                    <p className="empty-state">No feedback sent yet</p>
                  ) : (
                    <div className="feedback-history">
                      {selectedComplaint.feedbackHistory.map((fb, index) => (
                        <div key={index} className="feedback-item">
                          <div className="feedback-header">
                            <strong>{fb.admin}</strong>
                            <span className="feedback-date">{formatDateTime(fb.date)}</span>
                          </div>
                          <p>{fb.feedback}</p>
                          {fb.files && fb.files.length > 0 && (
                            <div className="feedback-files">
                              {fb.files.map((file, i) => (
                                <span key={i} className="file-tag">📎 {file}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="feedback-form">
                    <h4>Send New Feedback (Visible to Student)</h4>
                    <textarea
                      rows="4"
                      placeholder="Write your feedback to the student..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>
                    
                    <div className="file-upload-section">
                      <label className="file-upload-label">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        📎 Attach Files
                      </label>
                      {feedbackFiles.length > 0 && (
                        <div className="selected-files">
                          {feedbackFiles.map((file, index) => (
                            <div key={index} className="file-chip">
                              <span>{file.name}</span>
                              <button onClick={() => removeFile(index)}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button className="btn-primary" onClick={handleSendFeedback}>
                      Send Feedback
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="tab-content">
                  <h4>Admin Notes (Private - Not visible to student)</h4>
                  
                  {selectedComplaint.adminNotes.length === 0 ? (
                    <p className="empty-state">No notes added yet</p>
                  ) : (
                    <div className="notes-history">
                      {selectedComplaint.adminNotes.map((note, index) => (
                        <div key={index} className="note-item">
                          <div className="note-header">
                            <strong>{note.admin}</strong>
                            <span className="note-date">{formatDateTime(note.date)}</span>
                          </div>
                          <p>{note.note}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="notes-form">
                    <h4>Add New Note</h4>
                    <textarea
                      rows="4"
                      placeholder="Add internal notes here (only visible to admins)..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                    <button className="btn-primary" onClick={handleAddNote}>
                      Save Note
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "assign" && (
                <div className="tab-content">
                  <h4>Assignment Details</h4>
                  
                  {selectedComplaint.assignedTo && (
                    <div className="current-assignment">
                      <p><strong>Currently Assigned To:</strong> {selectedComplaint.assignedTo}</p>
                    </div>
                  )}

                  <div className="assign-form">
                    <h4>Assign or Reassign Complaint</h4>
                    <div className="form-group">
                      <label>Assign To:</label>
                      <select
                        value={assignTo}
                        onChange={(e) => setAssignTo(e.target.value)}
                      >
                        <option value="">Select admin/department</option>
                        <option value="Admin 1">Admin 1</option>
                        <option value="Admin 2">Admin 2</option>
                        <option value="Admin 3">Admin 3</option>
                        <option value="Academic Affairs">Academic Affairs</option>
                        <option value="Maintenance Dept.">Maintenance Dept.</option>
                        <option value="Registrar's Office">Registrar's Office</option>
                        <option value="Student Services">Student Services</option>
                        <option value="IT Department">IT Department</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Message/Instructions (Optional):</label>
                      <textarea
                        rows="3"
                        placeholder="Add any notes or instructions for the assignee..."
                        value={assignMessage}
                        onChange={(e) => setAssignMessage(e.target.value)}
                      ></textarea>
                    </div>

                    <button className="btn-primary" onClick={handleAssignComplaint}>
                      {selectedComplaint.assignedTo ? "Reassign" : "Assign"} Complaint
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "status" && (
                <div className="tab-content">
                  <h4>Status Management</h4>
                  
                  <div className="current-status-display">
                    <p><strong>Current Status:</strong></p>
                    <span className={`status-badge ${selectedComplaint.status}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>

                  <div className="status-form">
                    <h4>Update Status</h4>
                    <div className="form-group">
                      <label>New Status:</label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div className="status-descriptions">
                      <div className="status-desc">
                        <strong>Pending:</strong> Complaint has been received and is awaiting review
                      </div>
                      <div className="status-desc">
                        <strong>In Progress:</strong> Complaint is being actively addressed
                      </div>
                      <div className="status-desc">
                        <strong>Resolved:</strong> Issue has been addressed and resolved
                      </div>
                      <div className="status-desc">
                        <strong>Closed:</strong> Complaint has been finalized and archived
                      </div>
                    </div>

                    <button className="btn-primary" onClick={handleUpdateStatus}>
                      Update Status
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMonitorComplaints;