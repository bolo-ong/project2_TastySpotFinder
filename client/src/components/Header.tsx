import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogInForm from "./LogInForm";
import { useGetUserDataQuery } from "../queries/useGetUserDataQuery";
import { useQuery } from "@tanstack/react-query";

const Header: React.FC = () => {
  const [logInFormOpen, setLogInFormOpen] = useState(false);
  const [dropBoxOpen, setDropBoxOpen] = useState(false);

  const { userData, getUserDataLoading } = useGetUserDataQuery();
  console.log(userData);

  return (
    <>
      {logInFormOpen === true && <LogInForm setLogInForm={setLogInFormOpen} />}

      <header className=" w-full flex justify-around items-center p-3 text-gray-600 sticky z-20 border-b border-b-gray-300 shadow">
        <Link to="/" className="title-font font-medium">
          Title
        </Link>
        <nav className="">
          <ul className="flex">
            <li className="mx-3">
              <Link to="/recommendationboard">맛집 추천</Link>
            </li>
            <li className="mx-3">
              <Link to="/about">맛집vs</Link>
            </li>
          </ul>
        </nav>
        {userData ? (
          <div>
            <img
              className="h-8 w-8 rounded-full cursor-pointer"
              src={userData.profile_image}
              alt="profile_image"
              onClick={() => setDropBoxOpen(!dropBoxOpen)}
            />
            {dropBoxOpen && (
              <div className="absolute z-30 bg-white border border-gray-300 p-1 mt-1 text-sm rounded-full shadow hover:bg-gray-200 transition duration-150 ease-in-out">
                <Link
                  to={`http://localhost:8080/api/auth/logout/${userData.provider}`}
                >
                  Log Out
                </Link>
              </div>
            )}
          </div>
        ) : (
          <button
            className="h-8"
            onClick={() => setLogInFormOpen(!logInFormOpen)}
            disabled={logInFormOpen}
          >
            LogIn
          </button>
        )}
      </header>
    </>
  );
};

export default Header;
