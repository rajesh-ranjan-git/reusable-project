const Orb = () => {
  return (
    <div className="z-(--z-base) fixed inset-0 overflow-hidden pointer-events-none">
      <div className="-top-25 -left-37.5 w-150 h-150 orb orb-blue" />
      <div className="-right-25 bottom-0 w-125 h-125 orb orb-purple" />
      <div className="top-1/2 left-1/2 opacity-50 w-75 h-75 animate-delay-[8s] orb orb-blue" />
    </div>
  );
};

export default Orb;
