// PAGE LOGIN

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const defaultValues = {
    data: "",
    password: "",
  };

  const schema = yup.object({
    data: yup.string().required("Ce champ est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  async function submit(values) {
    // console.log(values);
    try {
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json",
        },
      });
      const responseFromBackend = await response.json();
      console.log(responseFromBackend);

      if (response.ok) {
        toast.success("Bien connecté");
        login(responseFromBackend.user);

        navigate("/");
        reset(defaultValues);
      } else {
        toast.error(responseFromBackend.message);
      }
    } catch (error) {
      console.log(error);
    }
    // reset(defaultValues);
    // requete HTTP
  }
  return (
    <div className="w-full max-w-md p-6 bg-white shadow-xl rounded">
      <form
        className="flex flex-col gap-4 mb-6 mx-auto max-w-[400px]"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex flex-col mb-2">
          <label htmlFor="data" className="mb-2">
            Pseudo ou Email
          </label>
          <input
            {...register("data")}
            type="text"
            id="data"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.data && <p className="text-red-500">{errors.data.message}</p>}
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="password" className="mb-2">
            Mot de passe
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <NavLink to="/register" className="text-blue-500">
          Pas encore inscrit ?
        </NavLink>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}
