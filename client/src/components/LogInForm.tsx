import googleLogo from "../assets/logo/logo_google.png";
import kakaoLogo from "../assets/logo/logo_kakao.png";
import { useEscapeKeyHandler } from "../hooks/useEscapeKeyHandler";
import { Link } from "react-router-dom";
interface LogInModalProps {
  setLogInForm: React.Dispatch<React.SetStateAction<boolean>>;
}
const LogInModal: React.FC<LogInModalProps> = ({ setLogInForm }) => {
  // ESC 키로 폼 닫기
  useEscapeKeyHandler(() => {
    setLogInForm(false);
  });

  return (
    <>
      <div className="fixed w-full h-full z-30">
        <div
          className="w-full h-full bg-black opacity-80"
          onMouseDown={() => {
            setLogInForm(false);
          }}
        ></div>

        <div className="bg-gray-100 container w-5/6 sm:w-1/3 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 border-8 border-gray-100 rounded-lg">
          <button
            className="absolute w-5 h-5 -right-8 -top-10 m-1 mr-3 hover:scale-110 text-white border-2 rounded-full flex justify-center items-center"
            onMouseDown={() => {
              setLogInForm(false);
            }}
          >
            x
          </button>
          <Link
            to="http://localhost:8080/api/auth/google"
            className="h-11 bg-gray-100 flex flex-row items-center border-2 border-gray-300 my-1 rounded-lg"
          >
            <img
              className="w-10 h-10"
              src={googleLogo}
              alt="Google Logo"
              style={{ backgroundImage: `url(${googleLogo})` }}
            />
            <span className="mx-auto">구글 로그인</span>
          </Link>

          <Link
            to="http://localhost:8080/api/auth/kakao"
            className="h-10 bg-[#FEE500] flex flex-row items-center my-1 rounded-lg "
          >
            <img
              className="w-6 h-6 ml-2"
              src={kakaoLogo}
              alt="Kakao Logo"
              style={{ backgroundImage: `url(${kakaoLogo})` }}
            />
            <span className="mx-auto">카카오 로그인</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LogInModal;
