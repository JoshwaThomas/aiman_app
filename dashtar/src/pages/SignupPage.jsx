import SignupForm from "@/components/drawer/SignupForm";
import Logo from "@/assets/img/logo/logo-dark.png"
import { useHistory } from "react-router-dom";

const SignupPage = () => {
  const history = useHistory();

  const nav = () => {
    history.push(`/login`);
  }
  return (
    <div >
      {/* header */}
      <div className="py-5 flex items-center justify-between">
        <img src={Logo} alt="kachabazar" width="135" className="px-3 w-1/2" />
        <button onClick={nav} className="px-6 mt-4 bg-yellow-400 py-3 mr-5 rounded text-black font-bold">Login</button>
      </div>

      <div className="min-h-screen flex items-center justify-between bg-blue-900 text-white px-10 py-10 rounded-t-2xl">
        {/* Left Content */}
        <div className="max-w-lg">

          <h1 className="text-4xl font-bold leading-snug">
            Step into your <br />
            <span className="text-yellow-400">Future</span>
          </h1>
          <p className="mt-4 text-lg">
            Achieve Career Success before you Graduate!
          </p>
        </div>

        {/* Right Form */}
        <SignupForm />
        <div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;