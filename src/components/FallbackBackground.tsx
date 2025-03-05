'use client';

import React from 'react';

export default function FallbackBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        background: 'transparent',
        pointerEvents: 'none'
      }}
    >
      {/* Static SVG roots as fallback */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: 0, left: 0 }}
      >
        {/* Root 1 - Left side */}
        <path
          d="M100,1000 C100,800 150,700 200,600 C250,500 300,450 250,350 C200,250 220,200 250,150"
          fill="none"
          stroke="rgba(20, 90, 60, 0.75)"
          strokeWidth="18"
          strokeLinecap="round"
          style={{
            strokeWidth: 'calc(18px - (18px * 0.7 * 0.9))'
          }}
        />

        {/* Leaf for Root 1 */}
        <path
          d="M250,150 C280,130 320,140 350,160 C330,180 290,190 250,150"
          fill="rgba(60, 145, 60, 0.85)"
          stroke="rgba(20, 90, 60, 0.5)"
          strokeWidth="1"
        />

        {/* Root 2 - Left-center */}
        <path
          d="M300,1000 C300,850 350,750 400,650 C450,550 480,500 450,400 C420,300 450,250 480,200"
          fill="none"
          stroke="rgba(35, 110, 45, 0.75)"
          strokeWidth="16"
          strokeLinecap="round"
          style={{
            strokeWidth: 'calc(16px - (16px * 0.7 * 0.8))'
          }}
        />

        {/* Leaf for Root 2 */}
        <path
          d="M480,200 C510,180 550,190 580,220 C560,240 520,250 480,200"
          fill="rgba(85, 160, 45, 0.85)"
          stroke="rgba(35, 110, 45, 0.5)"
          strokeWidth="1"
        />

        {/* Root 3 - Center */}
        <path
          d="M500,1000 C500,850 520,700 550,600 C580,500 600,400 550,350 C500,300 520,250 550,200"
          fill="none"
          stroke="rgba(70, 100, 25, 0.75)"
          strokeWidth="20"
          strokeLinecap="round"
          style={{
            strokeWidth: 'calc(20px - (20px * 0.7 * 0.7))'
          }}
        />

        {/* Leaves for Root 3 */}
        <path
          d="M550,200 C580,180 620,190 650,220 C630,240 590,250 550,200"
          fill="rgba(120, 180, 70, 0.85)"
          stroke="rgba(70, 100, 25, 0.5)"
          strokeWidth="1"
        />

        <path
          d="M550,350 C520,330 490,340 470,360 C490,380 520,380 550,350"
          fill="rgba(95, 165, 55, 0.85)"
          stroke="rgba(70, 100, 25, 0.5)"
          strokeWidth="1"
        />

        {/* Root 4 - Right-center (longer) */}
        <path
          d="M700,1000 C700,800 720,650 750,500 C780,350 800,250 770,150 C750,100 770,80 800,50"
          fill="none"
          stroke="rgba(105, 85, 35, 0.75)"
          strokeWidth="18"
          strokeLinecap="round"
          style={{
            strokeWidth: 'calc(18px - (18px * 0.7 * 0.6))'
          }}
        />

        {/* Leaves for Root 4 */}
        <path
          d="M800,50 C830,30 870,40 900,70 C880,90 840,100 800,50"
          fill="rgba(60, 145, 60, 0.85)"
          stroke="rgba(105, 85, 35, 0.5)"
          strokeWidth="1"
        />

        <path
          d="M770,150 C740,130 710,140 690,160 C710,180 740,190 770,150"
          fill="rgba(85, 160, 45, 0.85)"
          stroke="rgba(105, 85, 35, 0.5)"
          strokeWidth="1"
        />

        {/* Root 5 - Right side (longest) */}
        <path
          d="M900,1000 C900,800 880,650 850,500 C820,350 840,200 870,100 C890,50 880,20 850,0"
          fill="none"
          stroke="rgba(150, 120, 65, 0.75)"
          strokeWidth="22"
          strokeLinecap="round"
          style={{
            strokeWidth: 'calc(22px - (22px * 0.7 * 0.5))'
          }}
        />

        {/* Leaves for Root 5 */}
        <path
          d="M850,0 C820,-20 790,-10 770,10 C790,30 820,40 850,0"
          fill="rgba(120, 180, 70, 0.85)"
          stroke="rgba(150, 120, 65, 0.5)"
          strokeWidth="1"
        />

        <path
          d="M870,100 C900,80 940,90 970,120 C950,140 910,150 870,100"
          fill="rgba(95, 165, 55, 0.85)"
          stroke="rgba(150, 120, 65, 0.5)"
          strokeWidth="1"
        />

        {/* Additional smaller roots */}
        <path
          d="M200,1000 C200,900 220,800 240,700 C260,600 280,500 260,400"
          fill="none"
          stroke="rgba(35, 110, 45, 0.65)"
          strokeWidth="14"
          strokeLinecap="round"
          style={{
            strokeWidth: 'calc(14px - (14px * 0.7 * 0.8))'
          }}
        />

        <path
          d="M600,1000 C600,850 620,750 640,650 C660,550 680,450 660,350 C640,250 660,200 690,150"
          fill="none"
          stroke="rgba(20, 90, 60, 0.65)"
          strokeWidth="16"
          strokeLinecap="round"
          style={{
            strokeWidth: 'calc(16px - (16px * 0.7 * 0.7))'
          }}
        />

        {/* Leaf for additional root */}
        <path
          d="M690,150 C720,130 760,140 790,160 C770,180 730,190 690,150"
          fill="rgba(40, 130, 40, 0.85)"
          stroke="rgba(20, 90, 60, 0.5)"
          strokeWidth="1"
        />

        <path
          d="M800,1000 C800,900 780,800 760,700 C740,600 720,500 740,400 C760,300 740,250 720,200"
          fill="none"
          stroke="rgba(70, 100, 25, 0.65)"
          strokeWidth="15"
          strokeLinecap="round"
          style={{
            strokeWidth: 'calc(15px - (15px * 0.7 * 0.6))'
          }}
        />

        {/* Leaf for last root */}
        <path
          d="M720,200 C690,180 650,190 620,210 C640,230 680,240 720,200"
          fill="rgba(60, 145, 60, 0.85)"
          stroke="rgba(70, 100, 25, 0.5)"
          strokeWidth="1"
        />
      </svg>

      {/* Subtle info message */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '20px',
          fontSize: '11px',
          opacity: 0.7,
          zIndex: 5
        }}
      >
        Using static background
      </div>
    </div>
  );
}