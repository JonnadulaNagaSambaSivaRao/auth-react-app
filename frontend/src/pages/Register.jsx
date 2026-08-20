import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../services/api";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {

    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (
      !/\S+@\S+\.\S+/.test(form.email)
    ) {
      newErrors.email = "Invalid email";
    }

    if (!form.password) {
      newErrors.password =
        "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters";
    }

    if (
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setServerError("");
    setSuccess("");

    if (!validate()) {
      return;
    }

    try {

      setLoading(true);

      await API.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccess(
        "Registration successful!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);

    } catch (error) {

      setServerError(
        error.response?.data?.detail ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <Card>

        <h1>Create Account</h1>

        <p className="subtitle">
          Register a new account
        </p>

        {serverError && (
          <Alert>{serverError}</Alert>
        )}

        {success && (
          <Alert type="success">
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            error={errors.name}
          />

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

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            loading={loading}
          >
            Register
          </Button>

        </form>

        <p className="switch">
          Already have an account?
          {" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </Card>

    </div>
  );
}

export default Register;