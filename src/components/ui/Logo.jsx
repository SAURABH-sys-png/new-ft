import { Link } from 'react-router-dom';

export const Logo = ({ className = '', size = 'md', link = true, dark = false, textColor = '', onClick }) => {
  const sizeClasses = {
    sm: { badge: 'w-7 h-7 text-xs', text: 'text-base' },
    md: { badge: 'w-9 h-9 text-base', text: 'text-xl' },
    lg: { badge: 'w-11 h-11 text-xl', text: 'text-2xl sm:text-3xl' },
  }[size] || { badge: 'w-9 h-9 text-base', text: 'text-xl' };

  const activeTextColor = textColor || (dark ? 'text-white' : 'text-slate-900');
  const rogerColor = dark ? 'text-blue-400' : 'text-blue-600';

  const content = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      <div className={`${sizeClasses.badge} rounded-full bg-blue-600 text-white font-black font-sans flex items-center justify-center italic shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300 shrink-0`}>
        D
      </div>
      <span className={`font-sans font-black tracking-tight leading-none ${activeTextColor} ${sizeClasses.text}`}>
        Defence<span className={rogerColor}>Roger</span>
      </span>
    </div>
  );

  if (link) {
    return (
      <Link to="/" onClick={onClick} className="shrink-0">
        {content}
      </Link>
    );
  }

  return content;
};
