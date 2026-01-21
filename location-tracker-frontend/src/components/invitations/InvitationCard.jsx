import { motion } from 'framer-motion';
import { Users, Check, X, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { formatDistanceToNow } from 'date-fns';

export const InvitationCard = ({ invitation, onAccept, onReject, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-soft p-6 border-l-4 border-blue-500"
    >
      <div className="flex items-start gap-4">
        <Avatar
          name={invitation.invitedBy.name}
          src={invitation.invitedBy.profilePicture}
          size="lg"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {invitation.invitedBy.name}
            </h3>
            <span className="text-sm text-gray-500">invited you to join</span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-primary-600" />
            <span className="font-medium text-primary-600">
              {invitation.circleId.name}
            </span>
          </div>

          {invitation.message && (
            <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
              "{invitation.message}"
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(invitation.createdAt), {
              addSuffix: true
            })}
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={() => onAccept(invitation._id)}
              loading={loading}
              className="flex-1"
            >
              Accept
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={X}
              onClick={() => onReject(invitation._id)}
              disabled={loading}
              className="flex-1"
            >
              Decline
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};