const FeatureCard = ({ icon: Icon, title, description, gradient }) => {
  const gradientClasses = {
    primary: 'from-blue-500 to-purple-600',
    secondary: 'from-purple-500 to-pink-600',
    accent: 'from-green-500 to-blue-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientClasses[gradient]} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;