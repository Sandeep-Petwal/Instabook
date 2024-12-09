import { useState, useEffect } from "react";
import { Facebook, Loader2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axiosInstance from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInstaContext } from "@/hooks/useInstaContext";
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

function LoginComponent() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { login, verifyUser } = useInstaContext();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [step, setStep] = useState(1);
  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    document.title = "Login - Instabook";
    if (token && token.length > 10) {
      console.log("Token available :: " + token);
    } else {
      console.log("Token not available in params");
    }
  }, [token]);

  const reset = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setTotpCode("");
  };

  const handleSubmit = async (e) => {
    if (loading) return;
    e.preventDefault();
    console.log("Inside handle submit :: ");



    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/user/login`, {
        email,
        password,
        ipAddress,
      });

      console.log("Login response :: ");
      console.table(response.data);

      if (response.data.two_factor_enabled) {
        console.log("Two fector enabled :: ");
        return setStep(2);
      }

      console.log("Two fector not enabled :: ");

      toast.success("Login successful!");
      localStorage.setItem("instabook_token", response.data.token);
      verifyUser();
      navigate("/home");

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }

  };

  const handleVerifyTotp = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post("/verify/login", {
        email,
        password,
        TOTP: totpCode,
        ipAddress,
      });

      toast.success("Login successful!");
      localStorage.setItem("instabook_token", response.data.token);
      verifyUser();
      navigate("/home");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="max-w-[350px] w-full">
        <div className="flex flex-col items-center border border-gray-600 p-3">
          <h1 className="insta_font gradient-text text-4xl font-bold mb-8 font-serif ">
            <Link to={"/"}>Instabook</Link>
          </h1>

          {step === 1 && (
            <form className="w-full space-y-2" onSubmit={handleSubmit}>
              <input
                required
                type="email"
                placeholder="Phone number, username, or email"
                className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                required
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-zinc-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">
                  Confirm Two-Factor Authentication
                </h3>
                <p className="text-zinc-400">
                  Please enter your authentication code to login
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyTotp();
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="disable-totp"
                      className="text-sm font-medium text-zinc-300"
                    >
                      Authentication Code
                    </label>
                    <Input
                      id="disable-totp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      maxLength={6}
                      pattern="[0-9]*"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      variant="destructive"
                      className="flex-1"
                      disabled={totpCode.length !== 6 || loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Login
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={reset}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 w-full my-6">
            <div className="h-px bg-zinc-700 flex-1" />
            <span className="text-zinc-500 text-sm font-semibold">OR</span>
            <div className="h-px bg-zinc-700 flex-1" />
          </div>

          <button className="flex items-center gap-2 text-blue-500 font-semibold">
            <Facebook size={20} />
            Log in with Facebook
          </button>

          <Link to={"/reset"} className="text-sm text-blue-500 mt-4">
            Forgot password?
          </Link>
        </div>

        <div className="mt-6 text-center border border-zinc-700 rounded p-6">
          Don&apos;t have an account?{" "}
          <Link to={"/signup"} className="text-blue-500 font-semibold">
            Sign up
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="mb-4">Get the app.</p>
          <div className="flex gap-4 justify-center">
            <img
              src="/apple_store.png"
              alt="Get it on Apple Store"
              className="h-10"
            />
            <img
              src="/play_store.png"
              alt="Get it on Google Play"
              className="h-10"
            />
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default LoginComponent;
