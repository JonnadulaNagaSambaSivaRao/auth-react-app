import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";

import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {

    const newErrors = {};

    if (!form.email) {
      newErrors.email =
        "Email is required";
    }

    if (!form.password) {
      newErrors.password =
        "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    try {

      setLoading(true);

      const response = await API.post(
        "/login",
        form
      );

      await login(
        response.data.access_token
      );

      navigate("/dashboard");

    } catch (error) {

      setServerError(
        error.response?.data?.detail ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="page">

      <Card>

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Login to your account
        </p>

        {serverError && (
          <Alert>
            {serverError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            error={errors.password}
          />

          <Button
            type="submit"
            loading={loading}
          >
            Login
          </Button>

        </form>

        <p className="switch">
          Don't have an account?
          {" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </Card>

    </div>
  );
}

export default Login;