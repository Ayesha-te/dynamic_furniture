import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CategoryBadgeProps {
  name: string;
  icon: LucideIcon;
  path: string;
}

const CategoryBadge = ({ name, icon: Icon, path }: CategoryBadgeProps) => {
  return (
    <Link
      to={path}
      className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border hover:border-primary hover:shadow-lg transition-all duration-300 group"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
        <Icon className="text-primary group-hover:text-primary-foreground transition-colors" size={32} />
      </div>
      <span className="font-semibold text-center text-sm">{name}</span>
    </Link>
  );
};

export default CategoryBadge;
