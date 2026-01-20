import { useEffect, useState } from 'react';
import { Plus, UserPlus, Users } from 'lucide-react';
import { Header } from '../components/dashboard/Header';
import { Button } from '../components/common/Button';
import { CircleCard } from '../components/circles/CircleCard';
import { CreateCircleModal } from '../components/circles/CreateCircleModal';
import { InviteMemberModal } from '../components/circles/InviteMemberModal';
import { EmptyState } from '../components/common/EmptyState';
import { Loader } from '../components/common/Loader';
import { circleService } from '../services/circleService';
import { useSocket } from '../hooks/useSocket';

export const Circles = () => {
    const [circles, setCircles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [selectedCircle, setSelectedCircle] = useState(null);
    const { joinCircles } = useSocket();

    useEffect(() => {
        loadCircles();
    }, []);

    useEffect(() => {
        if (circles.length > 0) {
            joinCircles(circles.map(c => c._id));
        }
    }, [circles]);

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

    const handleCircleClick = (circle) => {
        setSelectedCircle(circle);
        setInviteModalOpen(true);
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
            <Header title="My Circles" />

            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                        Manage your location sharing circles
                    </p>
                    <Button icon={Plus} onClick={() => setCreateModalOpen(true)}>
                        Create Circle
                    </Button>
                </div>

                {circles.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No circles yet"
                        description="Create your first circle to start sharing locations with friends and family"
                        action={
                            <Button icon={Plus} onClick={() => setCreateModalOpen(true)}>
                                Create Circle
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {circles.map((circle) => (
                            <CircleCard
                                key={circle._id}
                                circle={circle}
                                onClick={() => handleCircleClick(circle)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateCircleModal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={loadCircles}
            />

            <InviteMemberModal
                isOpen={inviteModalOpen}
                onClose={() => {
                    setInviteModalOpen(false);
                    setSelectedCircle(null);
                }}
                circleId={selectedCircle?._id}
                onSuccess={loadCircles}
            />
        </div>
    );
};
