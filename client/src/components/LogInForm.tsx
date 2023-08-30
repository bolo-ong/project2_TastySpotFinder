import googleLogo from "../assets/logo/logo_google.png";
import kakaoLogo from "../assets/logo/logo_kakao.png";

interface LogInModalProps {
  setLogInForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const LogInModal: React.FC<LogInModalProps> = ({ setLogInForm }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기에서 폼 데이터 처리 또는 전달
  };

  return (
    <div className="fixed w-full h-full z-30">
      <div
        className="w-full h-full bg-black opacity-80"
        onMouseDown={() => {
          setLogInForm(false);
        }}
      ></div>
      <div className="bg-gray-100 container w-5/6 sm:w-1/3 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 border-8 border-gray-100 rounded-lg">
        <div className="h-11 bg-gray-100 flex flex-row items-center border-2 border-gray-300 my-1 rounded-lg">
          <img
            className="w-10 h-10"
            src={googleLogo}
            alt="Google Logo"
            style={{ backgroundImage: `url(${googleLogo})` }}
          />
          <span className="mx-auto">구글 로그인</span>
        </div>
        <div className="h-10 bg-[#FEE500] flex flex-row items-center my-1 rounded-lg">
          <img
            className="w-6 h-6 ml-2"
            src={kakaoLogo}
            alt="Kakao Logo"
            style={{ backgroundImage: `url(${kakaoLogo})` }}
          />
          <span className="mx-auto">카카오 로그인</span>
        </div>
      </div>
    </div>
  );
};

export default LogInModal;
