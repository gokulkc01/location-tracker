import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Users } from 'lucide-react';
import { circleService } from '../../services/circleService';

export const CreateCircleModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await circleService.createCircle(name);
      onSuccess();
      onClose();
      setName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create circle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Circle">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Circle Name"
          icon={Users}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Family, Friends, Work Team"
          required
        />

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Create Circle
          </Button>
        </div>
      </form>
    </Modal>
  );
};