import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { getMeeting, createMeeting, updateMeeting } from '../services/api';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiLink, FiX, FiSave } from 'react-icons/fi';

const MeetingForm = () => {
  const { id } = useParams();
  const isAddMode = !id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const formik = useFormik({
    initialValues: {
      status: 'UP',
      agenda: '',
      date: '',
      startTime: '',
      website: '',
    },
    validationSchema: Yup.object({
      status: Yup.string().required('Status is required'),
      agenda: Yup.string().required('Agenda is required').max(60),
      date: Yup.date().required('Date is required'),
      startTime: Yup.string().required('Time is required'),
      website: Yup.string().url('Invalid URL').nullable(),
    }),
    onSubmit: async (values) => {
      try {
        if (isAddMode) {
          await createMeeting(values);
          toast.success('Meeting created successfully');
        } else {
          await updateMeeting(id, values);
          toast.success('Meeting updated successfully');
        }
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    },
  });

  useEffect(() => {
    if (!isAddMode) {
      const fetchMeeting = async () => {
        try {
          const { data } = await getMeeting(id);
          formik.setValues(data);
        } catch (error) {
          toast.error('Meeting not found');
          navigate('/');
        }
      };
      fetchMeeting();
    }
  }, [id, isAddMode, navigate]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'UP': return 'bg-blue-100 text-blue-800';
      case 'IR': return 'bg-amber-100 text-amber-800';
      case 'CA': return 'bg-red-100 text-red-800';
      case 'CO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 w-screen">
      {/* Sidebar would be here if you're using the same layout as Meetings.jsx */}
      
      <div className="flex-1 overflow-auto p-8 mx-auto">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h1 className="text-2xl font-bold">
              {isAddMode ? 'Create New Meeting' : 'Edit Meeting'}
            </h1>
            <p className="text-blue-100">
              {isAddMode ? 'Fill in the details to schedule a new meeting' : 'Update the meeting details'}
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Status
              </label>
              <select
                id="status"
                name="status"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${getStatusColor(formik.values.status)}`}
              >
                <option value="UP">Upcoming</option>
                <option value="IR">In Review</option>
                <option value="CA">Cancelled</option>
                <option value="CO">Completed</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.status}</p>
              )}
            </div>

            <div>
              <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-1">
                Agenda
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  id="agenda"
                  name="agenda"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.agenda}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md h-[40px]"
                  placeholder="Meeting agenda"
                />
              </div>
              {formik.touched.agenda && formik.errors.agenda && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.agenda}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.date}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-[40px]"
                  />
                </div>
                {formik.touched.date && formik.errors.date && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.date}</p>
                )}
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.startTime}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-[40px]"
                  />
                </div>
                {formik.touched.startTime && formik.errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.startTime}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Link (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLink className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="website"
                  name="website"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.website || ''}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-[40px]"
                  placeholder="https://meet.example.com/your-meeting"
                />
              </div>
              {formik.touched.website && formik.errors.website && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.website}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiX className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '1rem', borderRadius: '0.5rem' }}
              >
                <FiSave className="mr-2" />
                {isAddMode ? 'Create Meeting' : 'Update Meeting'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeetingForm;