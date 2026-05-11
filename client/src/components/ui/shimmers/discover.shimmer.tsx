const DiscoverShimmer = () => {
  return (
    <div className="w-full h-full overflow-hidden pointer-events-none glass-heavy">
      <div className="bottom-0 left-0 absolute p-6 w-full pointer-events-auto">
        <div className="skeleton"></div>

        <div className="mb-2 rounded-lg w-52 h-10 skeleton"></div>

        <div className="mb-3 rounded-md w-40 h-5 shimmer"></div>

        <div className="space-y-2 mb-4">
          <div className="rounded-md w-full h-4 skeleton"></div>
          <div className="rounded-md w-4/5 h-4 skeleton"></div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded-full w-16 h-8 skeleton"></span>
          <span className="rounded-full w-20 h-8 skeleton"></span>
          <span className="rounded-full w-14 h-8 skeleton"></span>
        </div>

        <div className="rounded-md w-32 h-4 skeleton"></div>
      </div>
    </div>
  );
};

export default DiscoverShimmer;
