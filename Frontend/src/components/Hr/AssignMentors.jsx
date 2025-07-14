import React, { useEffect, useState } from "react";
import {
  Eye,
  User,
  Mail,
  Building,
  Calendar,
  MapPin,
  FileText,
  X,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const AssignMentors = ({
  loading = false,
  onAssignMentor,
  onReassignMentor,
}) => {
  const user = useSelector((state) => state.auth);

  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState("lolu");
  const [showModal, setShowModal] = useState(false);
  const fetchIntern = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      const response = (await axios.get(`${API_URL}/hr/fetchInterns`)).data;
      setInterns(response.data);
    } catch (error) {
      console.error("❌ InternFetch error:", error.message);
      if (error.response) {
        error.response.data.message;
      } else {
        console.error("fetch intern failed. Please try again.");
      }
    }
  };
  useEffect(() => {
    fetchIntern();
  }, []);
  const handleViewIntern = (intern) => {
    setSelectedIntern(intern);
    setShowModal(true);
  };

  const handleAssignMentor = async (intern) => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${API_URL}/hr/assignMentor`, {
        intern: intern._id,
        mentor: selectedMentor,
        sender: user.userId,
      });
      fetchIntern();
    } catch (error) {
      console.error("Error assigning mentor:", error.response || error.message);
    }
  };

  const handleReassignMentor = (intern) => {
    if (onReassignMentor) {
      onReassignMentor(intern);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedIntern(null);
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Assign Mentor</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage mentor assignments for interns
        </p>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Table Container */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading interns...</span>
            </div>
          ) : interns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No interns found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Mentor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interns.map((intern) => (
                  <tr
                    key={intern._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {intern.firstName} {intern.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {intern.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {intern.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {intern.university}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {intern.startDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full  
                         ${
                           intern.status === "notAssigned" &&
                           "bg-red-100 text-red-800 border border-red-200"
                         }
                         ${
                           intern.status === "pending" &&
                           "bg-blue-100 text-blue-800 border border-blue-200"
                         } 
                         ${
                           intern.status === "accepted" &&
                           "bg-green-100 text-green-800 border border-green-200"
                         }
                       `}
                      >
                        {intern.status === "notAssigned" && "Not Assigned"}
                        {intern.status === "pending" && "Pending"}
                        {intern.status === "accepted" && "Assigned"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewIntern(intern)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View
                        </button>
                        {intern.currentMentor === "Not Assigned" ||
                        !intern.currentMentor ? (
                          <button
                            onClick={() => handleAssignMentor(intern)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
                          >
                            Assign Mentor
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReassignMentor(intern)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all shadow-sm"
                          >
                            Reassign Mentor
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Intern Details */}
      {showModal && selectedIntern && (
        <div className="fixed inset-0  backdrop-blur-lg bg-[#00000050]  flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Intern Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">
                        {selectedIntern.firstName} {selectedIntern.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedIntern.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium text-gray-900">
                        {selectedIntern.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium text-gray-900">
                        {selectedIntern.startDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {(selectedIntern.phone ||
                selectedIntern.address ||
                selectedIntern.emergencyContact) && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedIntern.phone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">
                          {selectedIntern.phone}
                        </p>
                      </div>
                    )}
                    {selectedIntern.address && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium text-gray-900">
                            {selectedIntern.address}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedIntern.emergencyContact && (
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-sm text-gray-600">
                          Emergency Contact
                        </p>
                        <p className="font-medium text-gray-900">
                          {selectedIntern.emergencyContact}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Academic Information */}
              {(selectedIntern.university || selectedIntern.gpa) && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Academic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedIntern.university && (
                      <div>
                        <p className="text-sm text-gray-600">University</p>
                        <p className="font-medium text-gray-900">
                          {selectedIntern.university}
                        </p>
                      </div>
                    )}
                    {selectedIntern.gpa && (
                      <div>
                        <p className="text-sm text-gray-600">GPA</p>
                        <p className="font-medium text-gray-900">
                          {selectedIntern.gpa}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedIntern.skills && selectedIntern.skills.length > 0 && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntern.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Information */}
              {selectedIntern.projectTitle && (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    Project Information
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Project Title</p>
                      <p className="font-medium text-gray-900">
                        {selectedIntern.projectTitle}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mentor Status */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Mentor Status
                </h4>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                      selectedIntern.currentMentor === "Not Assigned" ||
                      !selectedIntern.currentMentor
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {selectedIntern.currentMentor || "Not Assigned"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
              >
                Close
              </button>
              {selectedIntern.currentMentor === "Not Assigned" ||
              !selectedIntern.currentMentor ? (
                <button
                  onClick={() => {
                    handleAssignMentor(selectedIntern);
                    closeModal();
                  }}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
                >
                  Assign Mentor
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleReassignMentor(selectedIntern);
                    closeModal();
                  }}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all shadow-sm"
                >
                  Reassign Mentor
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignMentors;
