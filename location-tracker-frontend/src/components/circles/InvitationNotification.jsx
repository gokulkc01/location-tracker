import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Check, X, Users } from 'lucide-react';
import { invitationService } from '../../services/invitationService';
import { useSocket } from '../../hooks/useSocket';

export const InvitationNotification = ({ invitation, onResponse }) => {
    const [loading, setLoading] = useState(false);
    const { clearInvitation, loadPendingInvitations } = useSocket();

    // Get the invitation ID - handle both formats (from API and socket)
    const invitationId = invitation._id || invitation.id;

    // Get inviter name - handle both populated object and string
    const inviterName = typeof invitation.invitedBy === 'object'
        ? invitation.invitedBy?.name
        : invitation.invitedBy;

    // Get circle name - handle both populated object and string
    const circleName = typeof invitation.circleId === 'object'
        ? invitation.circleId?.name
        : invitation.circleName;

    const handleAccept = async () => {
        setLoading(true);
        try {
            await invitationService.acceptInvitation(invitationId);
            clearInvitation(invitationId);
            onResponse?.('accepted', invitation);
            // Refresh invitations list
            loadPendingInvitations?.();
        } catch (error) {
            console.error('Failed to accept invitation:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        setLoading(true);
        try {
            await invitationService.rejectInvitation(invitationId);
            clearInvitation(invitationId);
            onResponse?.('declined', invitation);
            // Refresh invitations list
            loadPendingInvitations?.();
        } catch (error) {
            console.error('Failed to decline invitation:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm"
        >
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">Circle Invitation</h4>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">{inviterName || 'Someone'}</span> invited you to join
                    </p>
                    <div className="flex items-center gap-2 mt-2 bg-gray-50 rounded-lg px-3 py-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{circleName || 'a circle'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <button
                    onClick={handleDecline}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Decline
                </button>
                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Check className="w-4 h-4" />
                    Accept
                </button>
            </div>
        </motion.div>
    );
};

// Container component to show all pending invitations
export const InvitationsList = () => {
    const { pendingInvitations } = useSocket();

    const handleResponse = (action, invitation) => {
        console.log(`Invitation ${action}:`, invitation.circleName);
    };

    if (pendingInvitations.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 space-y-3">
            <AnimatePresence>
                {pendingInvitations.map((invitation) => (
                    <InvitationNotification
                        key={invitation._id || invitation.id || invitation.circleId}
                        invitation={invitation}
                        onResponse={handleResponse}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
