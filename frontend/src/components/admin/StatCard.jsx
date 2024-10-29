export const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
    <div className="rounded-full bg-blue-100 p-3 mr-4">
      <Icon className="h-8 w-8 text-blue-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);
