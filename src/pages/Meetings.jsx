import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMeeting, deleteMeeting } from '../services/api';
import { toast } from 'react-toastify';
import { STATUS_CHOICES } from '../utils/constants';
import { 
  FiHome, 
  FiCalendar, 
  FiClipboard, 
  FiCheckSquare, 
  FiClock, 
  FiMessageSquare, 
  FiLogOut,
  FiEdit2,
  FiTrash2,
  FiPlus
} from 'react-icons/fi';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await getMeeting();
        setMeetings(data);
      } catch (error) {
        toast.error('Failed to load meetings');
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await deleteMeeting(id);
        setMeetings(meetings.filter(m => m.id !== id));
        toast.success('Meeting deleted successfully');
      } catch (error) {
        toast.error('Failed to delete meeting');
      }
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case 'UP':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'IR':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'CA':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'CO':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 bg-gray-800 text-white p-4">
          {/* Sidebar skeleton */}
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/4 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-200">
      {/* Sidebar */}
      <div className="w-64 bg-white text-gray-950 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-8 mt-4 px-2">ToDoi</h2>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="#" 
                className="flex items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <FiHome className="mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="#" 
                className="flex items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <FiClipboard className="mr-3" />
                Boards
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="#" 
                className="flex items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <FiCheckSquare className="mr-3" />
                Tasks
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/" 
                className="flex items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <FiCalendar className="mr-3" />
                Meetings
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="#" 
                className="flex items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <FiClock className="mr-3" />
                Timesheets
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="#" 
                className="flex items-center p-2 rounded-lg hover:bg-blue-50"
              >
                <FiMessageSquare className="mr-3" />
                Chat
              </NavLink>
            </li>
          </ul>
        </nav>

        <button 
          onClick={logout}
          className="flex items-center p-2 text-gray-950 hover:bg-gray-200 rounded-lg mt-auto"
        >
          <FiLogOut className="mr-3" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
          <Link
            to="/meetings/new"
            className="flex items-center px-4 py-2 bg-purple-600  rounded-lg hover:bg-blue-700 transition-colors"
            style={{ color: 'white' }}
          >
            <FiPlus className="mr-2 text-white" />
            Add New Meeting
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agenda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting URL</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meetings.map((meeting) => (
                <tr key={meeting.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{meeting.agenda}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(meeting.status)}>
                      {STATUS_CHOICES[meeting.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(meeting.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {meeting.startTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {meeting.website ? (
                      <a 
                        href={meeting.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Join Meeting
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(meeting.id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {meetings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No meetings found. Create your first meeting!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Meetings;