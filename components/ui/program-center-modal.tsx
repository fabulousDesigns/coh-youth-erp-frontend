import React from "react";
import {
  Building2,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  X,
  Clock,
  Info,
} from "lucide-react";

interface ProgramCenterDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  programCenter: {
    name: string;
    location: string;
    coordinator: {
      name: string;
      email: string;
      phone: string;
    };
    totalVolunteers?: number;
    operatingHours?: string;
  } | null;
}

const ProgramCenterModal = ({
  isOpen,
  onClose,
  programCenter,
}: ProgramCenterDetailsProps) => {
  if (!isOpen || !programCenter) return null;

  const IconWrapper = ({
    children,
    color,
  }: {
    children: React.ReactNode;
    color: string;
  }) => (
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}
    >
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl m-4 relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <IconWrapper color="bg-white bg-opacity-20">
                <Building2 className="w-5 h-5 text-white" />
              </IconWrapper>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {programCenter.name}
                </h2>
                <p className="text-primary-100 mt-1">Program Center Details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Location Section */}
          <div className="flex items-start space-x-4">
            <IconWrapper color="bg-blue-50">
              <MapPin className="w-5 h-5 text-blue-600" />
            </IconWrapper>
            <div>
              <h3 className="text-sm font-medium text-secondary-600">
                Location
              </h3>
              <p className="mt-1 text-base text-secondary-900">
                {programCenter.location}
              </p>
            </div>
          </div>

          {/* Coordinator Section */}
          <div className="border-t border-secondary-200 pt-6">
            <div className="flex items-start space-x-4">
              <IconWrapper color="bg-green-50">
                <User className="w-5 h-5 text-green-600" />
              </IconWrapper>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-sm font-medium text-secondary-600">
                    Coordinator
                  </h3>
                  <p className="mt-1 text-base text-secondary-900">
                    {programCenter.coordinator.name}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600">
                      {programCenter.coordinator.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600">
                      {programCenter.coordinator.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-secondary-200 pt-6">
            <div className="flex items-start space-x-4">
              <IconWrapper color="bg-purple-50">
                <Users className="w-5 h-5 text-purple-600" />
              </IconWrapper>
              <div>
                <h3 className="text-sm font-medium text-secondary-600">
                  Total Volunteers
                </h3>
                <p className="mt-1 text-base text-secondary-900">
                  {programCenter.totalVolunteers || 0}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <IconWrapper color="bg-orange-50">
                <Clock className="w-5 h-5 text-orange-600" />
              </IconWrapper>
              <div>
                <h3 className="text-sm font-medium text-secondary-600">
                  Operating Hours
                </h3>
                <p className="mt-1 text-base text-secondary-900">
                  {programCenter.operatingHours || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-secondary-50 rounded-lg p-4 mt-6 flex items-start space-x-3">
            <Info className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary-600">
              This program center is actively supporting community development
              and volunteer engagement. For any queries or support, please
              contact the coordinator directly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-secondary-200 p-4 bg-secondary-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-secondary-300 rounded-lg text-secondary-700 hover:bg-secondary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCenterModal;
