const EmptyState = ({ icon: Icon, title, description, actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {Icon && (
        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
          <Icon className="w-10 h-10 text-on-surface-variant" />
        </div>
      )}
      <h3 className="font-headline-md text-xl text-on-surface mb-2">{title}</h3>
      <p className="text-on-surface-variant max-w-sm mb-8">{description}</p>
      {actionButton && (
        <div>{actionButton}</div>
      )}
    </div>
  );
};

export default EmptyState;
