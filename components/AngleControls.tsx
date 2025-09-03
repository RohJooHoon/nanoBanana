
import React from 'react';
import type { Angle, AngleOption } from '../types';
import { Icon } from './Icon';

const angleOptions: AngleOption[] = [
    { id: 'zoom-in', label: 'Zoom In', icon: (cn) => <Icon.ZoomIn className={cn} /> },
    { id: 'zoom-out', label: 'Zoom Out', icon: (cn) => <Icon.ZoomOut className={cn} /> },
    { id: 'low-angle', label: 'Low Angle', icon: (cn) => <Icon.ArrowUp className={cn} /> },
    { id: 'high-angle', label: 'High Angle', icon: (cn) => <Icon.ArrowDown className={cn} /> },
    { id: 'turn-around', label: 'Turn Around', icon: (cn) => <Icon.RotateCw className={cn} /> },
];

interface AngleControlsProps {
    activeAngle: Angle;
    onAngleChange: (angle: Angle) => void;
}

export const AngleControls: React.FC<AngleControlsProps> = ({ activeAngle, onAngleChange }) => {
    
    const handleAngleClick = (angle: Angle) => {
        if (activeAngle === angle) {
            onAngleChange(null); // Deselect if clicked again
        } else {
            onAngleChange(angle);
        }
    };
    
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {angleOptions.map((option) => (
                <button
                    key={option.id}
                    onClick={() => handleAngleClick(option.id)}
                    className={`p-2 rounded-lg border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-200
                        ${activeAngle === option.id 
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                            : 'bg-gray-700 border-gray-600 hover:border-gray-500 text-gray-300'
                        }`}
                >
                    {option.icon("w-6 h-6")}
                    <span className="text-xs font-semibold">{option.label}</span>
                </button>
            ))}
        </div>
    );
};
