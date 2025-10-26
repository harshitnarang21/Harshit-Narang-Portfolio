import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Mail, MessageSquare, RefreshCw, Trash2, Pin, CheckCircle, Circle } from 'lucide-react';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [contactMessages, setContactMessages] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'comments'
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    totalComments: 0,
    pinnedComments: 0
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      // Fetch contact messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('portfolio_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      setContactMessages(messagesData || []);
      setComments(commentsData || []);

      // Calculate stats
      setStats({
        totalMessages: messagesData?.length || 0,
        unreadMessages: messagesData?.filter(m => !m.read).length || 0,
        totalComments: commentsData?.length || 0,
        pinnedComments: commentsData?.filter(c => c.is_pinned).length || 0
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mark message as read/unread
  const toggleMessageRead = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      
      Swal.fire({
        title: 'Success!',
        text: `Message marked as ${!currentStatus ? 'read' : 'unread'}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating message:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#6366f1'
      });
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await fetchData();
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Message has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting message:', error);
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonColor: '#6366f1'
        });
      }
    }
  };

  // Toggle pin comment
  const togglePinComment = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('portfolio_comments')
        .update({ is_pinned: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      
      Swal.fire({
        title: 'Success!',
        text: `Comment ${!currentStatus ? 'pinned' : 'unpinned'}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#6366f1'
      });
    }
  };

  // Delete comment
  const deleteComment = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('portfolio_comments')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await fetchData();
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Comment has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
        Swal.fire({
          title: 'Error!',
          text: error.message,
          icon: 'error',
          confirmButtonColor: '#6366f1'
        });
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
            Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage your contact messages and comments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Messages</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalMessages}</p>
              </div>
              <Mail className="w-10 h-10 text-[#6366f1]" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unread Messages</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.unreadMessages}</p>
              </div>
              <Circle className="w-10 h-10 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Comments</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.totalComments}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-[#a855f7]" />
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pinned Comments</p>
                <p className="text-3xl font-bold text-white mt-1">{stats.pinnedComments}</p>
              </div>
              <Pin className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'messages'
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Contact Messages
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'comments'
                    ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                Comments
              </button>
            </div>
            <button
              onClick={fetchData}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Contact Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {contactMessages.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No messages yet</p>
              ) : (
                contactMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-white/5 rounded-lg p-4 border ${
                      message.read ? 'border-white/5' : 'border-[#6366f1]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold">{message.name}</h3>
                          {!message.read && (
                            <span className="px-2 py-1 bg-[#6366f1] text-white text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{message.email}</p>
                        <p className="text-gray-300">{message.message}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => toggleMessageRead(message.id, message.read)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                          title={message.read ? 'Mark as unread' : 'Mark as read'}
                        >
                          {message.read ? (
                            <Circle className="w-5 h-5 text-gray-400" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`bg-white/5 rounded-lg p-4 border ${
                      comment.is_pinned ? 'border-green-500/30' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        {comment.profile_image ? (
                          <img
                            src={comment.profile_image}
                            alt={comment.user_name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white font-semibold">
                            {comment.user_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">{comment.user_name}</h3>
                            {comment.is_pinned && (
                              <Pin className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-gray-300">{comment.content}</p>
                          <p className="text-gray-500 text-xs mt-2">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => togglePinComment(comment.id, comment.is_pinned)}
                          className={`p-2 rounded-lg transition-all ${
                            comment.is_pinned
                              ? 'bg-green-500/20 hover:bg-green-500/30'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                          title={comment.is_pinned ? 'Unpin' : 'Pin'}
                        >
                          <Pin
                            className={`w-5 h-5 ${
                              comment.is_pinned ? 'text-green-500' : 'text-gray-400'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => deleteComment(comment.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
