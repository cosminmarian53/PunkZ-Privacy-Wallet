import React from 'react';
import { Html } from '@react-three/drei';

const ThreeLoader: React.FC = () => {
  return (
    <Html center>
      <div className="flex justify-center items-center w-full h-full">
        <div 
          className="w-12 h-12 rounded-full animate-spin"
          style={{
            border: '5px solid rgba(0, 255, 255, 0.3)',
            borderTop: '5px solid rgba(255, 0, 255, 0.8)',
          }} 
        />
      </div>
    </Html>
  );
};

export default ThreeLoader;
