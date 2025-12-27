import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, LogOut, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const {logout, authUser} = useAuthStore()
  return (
    <header
    className="bg-base-100 border-b border-[rgba(176,154,204,0.6)] fixed w-full top-0 z-40
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
      <div className="flex items-center justify-center h-full">
      {authUser && (
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 btn btn-sm">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[rgb(176,154,204)]"/>
              </div>
              <span className="font-medium text-sm">chatbox</span>
          </Link>
          </div>
      )}

        <div className="flex items-center gap-2">
        {authUser && (
          <>
            <Link
              to={"/settings"}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4 text-[rgb(176,154,204)]" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <Link to={"/profile"} className= {`btn btn-sm gap-2`}>
              <User className="size-5 text-[rgb(176,154,204)]"/>
              <span className="hidden sm:inline">Profile</span>
            </Link>

            <button className ="btn btn-sm gap-2" onClick={logout}>
              <LogOut className= "size-5 text-[rgb(176,154,204)]"/>
              <span className ="hidden sm:inline text-sm font-medium">logout</span>
            </button>
          </>
        )}
      </div>
    </div>
  </div>

    </header>
  )
}

export default Navbar;
