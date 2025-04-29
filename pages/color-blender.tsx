import React, { useState } from 'react';

const colorSwatches = [
  { name: 'Red', value: '#FF0000' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Purple', value: '#800080' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Pink', value: '#FFC0CB' },
];

export default function ColorBlender() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [blendedColor, setBlendedColor] = useState('#FFFFFF');

  const handleColorSelect = (color: string) => {
    let newSelectedColors;
    if (selectedColors.includes(color)) {
      newSelectedColors = selectedColors.filter(c => c !== color);
    } else {
      newSelectedColors = [...selectedColors, color];
    }
    setSelectedColors(newSelectedColors);

    if (newSelectedColors.length === 0) {
      setBlendedColor('#FFFFFF');
      return;
    }

    // Blend colors
    const r = Math.round(newSelectedColors.reduce((sum, color) => sum + parseInt(color.slice(1, 3), 16), 0) / newSelectedColors.length);
    const g = Math.round(newSelectedColors.reduce((sum, color) => sum + parseInt(color.slice(3, 5), 16), 0) / newSelectedColors.length);
    const b = Math.round(newSelectedColors.reduce((sum, color) => sum + parseInt(color.slice(5, 7), 16), 0) / newSelectedColors.length);
    
    setBlendedColor(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Color Blender</h1>
      
      {/* Color display square */}
      <div 
        className="w-64 h-64 mb-8 rounded-lg shadow-lg transition-colors duration-300"
        style={{ backgroundColor: blendedColor }}
      />

      {/* Color swatches */}
      <div className="grid grid-cols-4 gap-4">
        {colorSwatches.map((color) => (
          <button
            key={color.value}
            className={`w-16 h-16 rounded-lg shadow-md transition-transform hover:scale-110 ${
              selectedColors.includes(color.value) ? 'ring-2 ring-offset-2 ring-blue-500' : ''
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => handleColorSelect(color.value)}
          >
            <span className="sr-only">{color.name}</span>
          </button>
        ))}
      </div>

      {/* Selected colors display */}
      <div className="mt-8 text-center">
        <p className="text-lg font-semibold mb-2">Selected Colors:</p>
        <div className="flex gap-2 justify-center">
          {selectedColors.map((color) => (
            <div
              key={color}
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 