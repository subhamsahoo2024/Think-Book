import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      toast.success("Account created successfully");
      toast.success(`welcome ${name || email}`);
      navigate("/");
    } catch (err) {
      setError(
        typeof err === "string" ? err : "Registration failed. Please try again."
      );
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />

      <div className="w-full max-w-md">
        <div className="card bg-base-300 border border-base-content/10 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl font-bold text-primary font-mono tracking-tighter mb-6">
              ThinkBoard
            </h1>
            <h2 className="text-xl font-semibold mb-4">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <User className="h-4 w-4 opacity-70" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <Mail className="h-4 w-4 opacity-70" />
                  <input
                    type="email"
                    className="grow"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <Lock className="h-4 w-4 opacity-70" />
                  <input
                    type="password"
                    className="grow"
                    placeholder="--------"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <Lock className="h-4 w-4 opacity-70" />
                  <input
                    type="password"
                    className="grow"
                    placeholder="--------"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <div className="divider">OR</div>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
