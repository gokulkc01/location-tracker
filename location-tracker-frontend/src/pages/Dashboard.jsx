import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Activity, Shield } from 'lucide-react';
import { Header } from '../components/dashboard/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { circleService } from '../services/circleService';
import { Loader } from '../components/common/Loader';

export const Dashboard = () => {
  const [circles, setCircles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCircles();
  }, []);

  const loadCircles = async () => {
    try {
      const data = await circleService.getMyCircles();
      setCircles(data);
    } catch (error) {
      console.error('Failed to load circles:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: Users,
      label: 'Active Circles',
      value: circles.length,
      color: 'bg-blue-500',
    },
    {
      icon: MapPin,
      label: 'Locations Tracked',
      value: circles.reduce((acc, c) => acc + c.members.filter(m => m.status === 'active').length, 0),
      color: 'bg-green-500',
    },
    {
      icon: Activity,
      label: 'Active Today',
      value: circles.reduce((acc, c) => acc + c.members.filter(m => m.status === 'active').length, 0),
      color: 'bg-purple-500',
    },
    {
      icon: Shield,
      label: 'Geofences',
      value: 0,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div>
      <Header title="Dashboard" />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/circles')} variant="primary">
              View Circles
            </Button>
            <Button onClick={() => navigate('/map')} variant="secondary">
              Open Map
            </Button>
            <Button onClick={() => navigate('/settings')} variant="secondary">
              Settings
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Circles</h3>
          {circles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No circles yet</p>
              <Button onClick={() => navigate('/circles')}>Create Your First Circle</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {circles.slice(0, 5).map((circle) => (
                <div
                  key={circle._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate('/circles')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{circle.name}</p>
                      <p className="text-sm text-gray-500">
                        {circle.members.filter(m => m.status === 'active').length} members
                      </p>
                    </div>
                  </div>
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};