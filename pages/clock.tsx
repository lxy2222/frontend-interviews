import React, { useState, useEffect, useMemo } from "react";

const angles = Array(12).fill(1).map((_, index) => (index + 1) * 30 - 90);

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours + minutes / 60) * 30; // 每小时30度
  const minuteDegrees = minutes * 6; // 每分钟6度
  const secondDegrees = seconds * 6; // 每秒6度

  const hourString = useMemo(() => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  }, [time])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Clock</h1>
      <h2 className="text-2xl font-semibold">{hourString}</h2>
      <div className="mt-6 w-[200px] h-[200px] relative
      bg-gray-100 shadow-lg flex items-center justify-center rounded-full" 
      data-id="dialPlate">
        {angles.map((angle, index) => {
          const radius = 80;
          const x = (Math.cos(angle * Math.PI / 180) * radius).toFixed(0);
          const y = (Math.sin(angle * Math.PI / 180) * radius).toFixed(0);
          // to make the clock align with the center, we need to first translate first and then rotate
          // transfirm origin is the center of the clock
          return (
            <div key={`clock-${index}`} className="absolute" style={{
              transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
              transformOrigin: "center",
            }}>
              <div className="w-1 h-4 bg-gray-500" />
            </div>
          )
        })}

        <div className="absolute left-[99px] top-[50px] w-1 h-12 bg-gray-800 origin-bottom" 
          style={{ transform: `rotate(${hourDegrees}deg)` }} data-id="hourpointer"/>
        <div className="absolute left-[99px] top-[38px] w-0.5 h-16 bg-blue-600 origin-bottom" 
          style={{ transform: `rotate(${minuteDegrees}deg)` }} data-id="minute-pointer" />
        <div className="absolute left-[99px] top-[28px] w-0.5 h-20 bg-red-500 origin-bottom" data-id="second-pointer"
          style={{ transform: `rotate(${secondDegrees}deg)` }} />
        
        <div className="absolute w-3 h-3 bg-gray-800 rounded-full" />
      </div>
    </div>
  )
}