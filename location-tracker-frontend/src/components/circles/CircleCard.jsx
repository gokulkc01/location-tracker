import { motion } from 'framer-motion';
import { Users, MapPin, MoreVertical } from 'lucide-react';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';

export const CircleCard = ({ circle, onClick }) => {
  const activeMembers = circle.members.filter((m) => m.status === 'active');
  const pendingMembers = circle.members.filter((m) => m.status === 'pending');

  return (
    <Card hover onClick={onClick} className="cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{circle.name}</h3>
            <p className="text-sm text-gray-500">
              {activeMembers.length} member{activeMembers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {activeMembers.slice(0, 4).map((member) => (
          <Avatar
            key={member.userId._id}
            name={member.userId.name}
            src={member.userId.profilePicture}
            size="sm"
          />
        ))}
        {activeMembers.length > 4 && (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            +{activeMembers.length - 4}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>Tracking active</span>
        </div>
        {pendingMembers.length > 0 && (
          <Badge variant="warning" size="sm">
            {pendingMembers.length} pending
          </Badge>
        )}
      </div>
    </Card>
  );
};
