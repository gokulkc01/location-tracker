import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Inbox } from 'lucide-react';
import { Header } from '../components/dashboard/Header';
import { InvitationCard } from '../components/invitations/InvitationCard';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { invitationService } from '../services/invitationService';
import { useNavigate } from 'react-router-dom';

export const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      const data = await invitationService.getMyInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    setActionLoading(true);
    try {
      await invitationService.acceptInvitation(invitationId);
      setInvitations(prev => prev.filter(inv => inv._id !== invitationId));
      // Redirect to circles page to see the new circle
      setTimeout(() => navigate('/circles'), 1000);
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      alert('Failed to accept invitation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (invitationId) => {
    setActionLoading(true);
    try {
      await invitationService.rejectInvitation(invitationId);
      setInvitations(prev => prev.filter(inv => inv._id !== invitationId));
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      alert('Failed to reject invitation');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Invitations" />
      
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-600">
            Manage your circle invitations
          </p>
        </div>

        {invitations.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No pending invitations"
            description="When someone invites you to a circle, it will appear here"
          />
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation._id}
                invitation={invitation}
                onAccept={handleAccept}
                onReject={handleReject}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};