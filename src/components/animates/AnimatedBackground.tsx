import React, { useEffect, useState } from 'react';

type Star = {
  left: string;
  top: string;
  delay: string;
  duration: string;
};

export default function AnimatedBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  // Hàm tạo random 1 mảng sao
  const generateStars = () =>
    Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));

  useEffect(() => {
    // Lần đầu sau khi hydrate → sinh sao
    setStars(generateStars());

    // Cứ mỗi X giây lại random lại
    const interval = setInterval(() => {
      setStars(generateStars());
    }, 1000); // 5 giây đổi vị trí

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10" />
      <div className="absolute top-0 left-0 h-full w-full">
        {stars.map((star, i) => (
          <div
            key={i}
            className="animate-twinkle absolute h-1 w-1 rounded-full bg-white opacity-20"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
