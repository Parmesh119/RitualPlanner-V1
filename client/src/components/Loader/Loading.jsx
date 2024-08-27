const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-200 rounded-full animate-spin border-t-blue-500"></div>
        <span className="text-xl font-bold text-gray-700" style={{
          letterSpacing: "1.5px"
        }}>Loading ...</span>
      </div>
    </div>
  );
};

export default Loader;
