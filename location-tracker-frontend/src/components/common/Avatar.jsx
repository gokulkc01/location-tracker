import clsx from 'clsx';

export const Avatar = ({ src, name, size = 'md', online = false }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-block">
      <div
        className={clsx(
          'rounded-full flex items-center justify-center font-semibold',
          'bg-gradient-to-br from-primary-400 to-primary-600 text-white',
          sizes[size]
        )}
      >
        {src ? (
          <img src={src} alt={name} className="rounded-full w-full h-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
      )}
    </div>
  );
};