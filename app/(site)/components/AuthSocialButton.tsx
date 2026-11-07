import { IconType } from "react-icons";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  label?: string;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  label,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-slate-900/80
        hover:bg-slate-800/90
        px-4
        py-2.5
        text-sm
        font-medium
        text-slate-200
        border
        border-slate-800
        hover:border-slate-700
        shadow-sm
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500/20
        cursor-pointer
        active:scale-[0.98]
      "
    >
      <Icon size={18} className="text-slate-300" />
      {label && <span>{label}</span>}
    </button>
  );
};

export default AuthSocialButton;
