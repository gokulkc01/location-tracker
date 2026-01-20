import { useState, useEffect } from 'react';
import { Header } from '../components/dashboard/Header';
import { Card } from '../components/common/Card';
import { Toggle } from '../components/common/Toggle';
import { Button } from '../components/common/Button';
import { permissionService } from '../services/permissionService';

export const Settings = () => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const data = await permissionService.getMyPermissions();
      setPermissions(data);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  const handleToggleSharing = async (circleId, enabled) => {
    try {
      await permissionService.toggleSharing(circleId, enabled);
      loadPermissions();
    } catch (error) {
      console.error('Failed to toggle sharing:', error);
    }
  };

  return (
    <div>
      <Header title="Settings" />
      
      <div className="p-6 max-w-4xl space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Sharing</h3>
          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{permission.circleId?.name}</p>
                  <p className="text-sm text-gray-500">
                    {permission.sharingEnabled ? 'Currently sharing' : 'Sharing paused'}
                  </p>
                </div>
                <Toggle
                  enabled={permission.sharingEnabled}
                  onChange={(enabled) => handleToggleSharing(permission.circleId._id, enabled)}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy</h3>
          <p className="text-gray-600 mb-4">
            You have full control over your location data. You can pause sharing at any time.
          </p>
          <Button variant="secondary">View Activity Log</Button>
        </Card>
      </div>
    </div>
  );
};
