const AnimatedFloatingSquares = () => {
  return (
    <>
      <div
        className="-top-12 -right-14 absolute bg-glass-surface-light bg-opacity-10 shadow-2xl shadow-black/10 backdrop-blur-xs border border-white/50 border-r-white/20 border-b-white/20 rounded-lg w-24 h-24 animate-[floatingSquares_10s_linear_infinite] [animation-delay:calc(-1s*var(--i))]"
        style={
          {
            "--i": 0,
          } as React.CSSProperties
        }
      ></div>
      <div
        className="top-36 -left-24 z-10 absolute bg-glass-surface-light bg-opacity-10 shadow-2xl shadow-black/10 backdrop-blur-xs border border-white/50 border-r-white/20 border-b-white/20 rounded-lg w-32 h-32 animate-[floatingSquares_10s_linear_infinite] [animation-delay:calc(-1s*var(--i))]"
        style={
          {
            "--i": 1,
          } as React.CSSProperties
        }
      ></div>
      <div
        className="-right-14 bottom-12 z-10 absolute bg-glass-surface-light bg-opacity-10 shadow-2xl shadow-black/10 backdrop-blur-xs border border-white/50 border-r-white/20 border-b-white/20 rounded-lg w-20 h-20 animate-[floatingSquares_10s_linear_infinite] [animation-delay:calc(-1s*var(--i))]"
        style={
          {
            "--i": 2,
          } as React.CSSProperties
        }
      ></div>
      <div
        className="-bottom-20 left-24 absolute bg-glass-surface-light bg-opacity-10 shadow-2xl shadow-black/10 backdrop-blur-xs border border-white/50 border-r-white/20 border-b-white/20 rounded-lg w-12 h-12 animate-[floatingSquares_10s_linear_infinite] [animation-delay:calc(-1s*var(--i))]"
        style={
          {
            "--i": 3,
          } as React.CSSProperties
        }
      ></div>
      <div
        className="-top-20 left-36 z-10 absolute bg-glass-surface-light bg-opacity-10 shadow-2xl shadow-black/10 backdrop-blur-xs border border-white/50 border-r-white/20 border-b-white/20 rounded-lg w-14 h-14 animate-[floatingSquares_10s_linear_infinite] [animation-delay:calc(-1s*var(--i))]"
        style={
          {
            "--i": 4,
          } as React.CSSProperties
        }
      ></div>
    </>
  );
};

export default AnimatedFloatingSquares;
