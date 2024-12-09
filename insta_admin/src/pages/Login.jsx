import { useEffect, useState } from "react";
import {  Loader2, User, Lock } from "lucide-react"; // Import icons
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();
  document.title = "Login - Instabook";
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [step, setStep] = useState(1);

  // if in localstorage insta)_admin is present then navigate to "/"
  useEffect(() => {
    const token = localStorage.getItem("insta_admin");
    if (token) {
      navigate("/");
    }
  });

  const reset = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setTotpCode("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (loading) return;
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/admin/users/login`, {
        email,
        password,
      });

      if (response.data.two_factor_enabled) {
        setStep(2);
      } else {
        toast.success("Login successful!");
        localStorage.setItem("insta_admin", response.data.token);
        navigate("/");
        // window.location.reload();
      }
    } catch (error) {
      console.table(error.response.data);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle TOTP verification
  const handleVerifyTotp = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/admin/users/verify-login`, {
        email,
        password,
        TOTP: totpCode,
      });

      toast.success("Login successful!");
      localStorage.setItem("insta_admin", response.data.token);
      window.location.reload();
    } catch (error) {
      console.table(error.response.data);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center text-white bg-zinc-950 p-4">
      <Card className="max-w-[400px] w-full bg-zinc-900 border-zinc-800">
        <CardHeader>
          <h1 className="insta_font gradient-text text-4xl font-bold text-center">
            <Link to={"/"}>Instabook Admin</Link>
          </h1>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex items-center border-b border-zinc-700">
                <User className="text-white h-5 w-5 mr-2" />
                <Input
                  required
                  type="email"
                  placeholder="Phone number, username, or email"
                  className="bg-zinc-800 border-zinc-700 text-white focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-center border-b border-zinc-700">
                <Lock className="text-white h-5 w-5 mr-2" />
                <Input
                  required
                  type="password"
                  placeholder="Password"
                  className="bg-zinc-800 border-zinc-700 text-white focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          ) : (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-lg font-medium text-white">
                  Two-Factor Authentication
                </h3>
                <p className="text-zinc-400 text-sm">
                  Please enter your authentication code to login
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVerifyTotp();
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center border-b border-zinc-600">
                    <Input
                      id="totp-code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-white focus:outline-none"
                      maxLength={6}
                      pattern="[0-9]*"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={totpCode.length !== 6 || loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Verify
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
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default Login;
