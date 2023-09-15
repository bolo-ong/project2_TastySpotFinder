import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogInForm from "./LogInForm";
import { useGetUserDataQuery } from "../queries/useGetUserDataQuery";

const Header: React.FC = () => {
  const [logInForm, setLogInForm] = useState(false);

  const { getUserDataError, userData, getUserDataSuccess } =
    useGetUserDataQuery();
  console.log(userData);

  return (
    <>
      {logInForm === true && <LogInForm setLogInForm={setLogInForm} />}

      <header className="w-full flex justify-around items-center p-3 text-gray-600 sticky z-20 border-b border-b-gray-300">
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
        <button onClick={() => setLogInForm(!logInForm)} disabled={logInForm}>
          logIn
        </button>
      </header>
    </>
  );
};

export default Header;
