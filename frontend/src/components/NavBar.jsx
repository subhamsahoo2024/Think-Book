import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">
            ThinkBoard
          </h1>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-base-content">
                  {currentUser.name || currentUser.email}
                </span>
                <div className="divider divider-horizontal mx-1"></div>
              </div>
            )}
            <Link to={"/create"} className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
            {currentUser && (
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-error"
              >
                <LogOut className="size-5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
