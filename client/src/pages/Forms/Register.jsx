// PAGE INSCRIPTION

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signUp } from "../../api/auth.api";

export default function Register() {
  const navigate = useNavigate();

  const defaultValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    postalCode: "",
    birthday: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  };

  const schema = yup.object({
    firstName: yup
      .string()
      .required("Ce champ est obligatoire.")
      .matches(
        /^[a-zA-ZÀ-ÿ'-]+(?:\s[a-zA-ZÀ-ÿ'-]+)*$/,
        "Ce champ ne peut contenir que des lettres, des tirets et des apostrophes."
      ),
    lastName: yup
      .string()
      .required("Ce champ est obligatoire.")
      .matches(
        /^[a-zA-ZÀ-ÿ'-]+(?:\s[a-zA-ZÀ-ÿ'-]+)*$/,
        "Ce champ ne peut contenir que des lettres, des tirets et des apostrophes."
      ),
    username: yup
      .string()
      .required("Ce champ est obligatoire.")
      .matches(
        /^[a-zA-Z0-9_-]{4,16}$/,
        "Le nom d'utilisateur doit contenir entre 4 et 16 caractères alphanumériques, des tirets ou des underscores."
      ),
    email: yup
      .string()
      .email("Format email non valide.")
      .required("Ce champ est obligatoire.")
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Format email non valide."),
    phone: yup
      .string()
      .required("Ce champ est obligatoire.")
      .matches(/^\d{10}$/, "Format de numéro de téléphone non valide."),
    postalCode: yup
      .string()
      .required("Ce champ est obligatoire.")
      .matches(/^\d{5}$/, "Format de code postal non valide."),
    birthday: yup
      .date()
      .typeError("Veuillez entrer une date valide.")
      .required("Ce champ est obligatoire.")
      .max(new Date(), "La date de naissance doit être dans le passé."),
    gender: yup
      .string()
      .required("Ce champ est obligatoire.")
      .oneOf(
        ["female", "male", "other"],
        "Veuillez choisir l'une des options."
      ),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire.")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .max(30, "Le mot de passe ne peut pas dépasser 30 caractères.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.{8,30})/,
        "Le mot de passe doit contenir au moins 8 caractères, dont une minuscule, une majuscule, un chiffre et un caractère spécial."
      ),
    confirmPassword: yup
      .string()
      .required("La confirmation de mot de passe est obligatoire.")
      .oneOf(
        [yup.ref("password"), ""],
        "Les mots de passe ne correspondent pas."
      ),
    agreeToTerms: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les termes et conditions."),
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
    try {
      const responseFromBackend = await signUp(values);
      if (responseFromBackend.message !== "Déjà inscrit") {
        toast.success(responseFromBackend.message);
        navigate("/login");
        reset(defaultValues);
      } else {
        toast.error(responseFromBackend.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-xl rounded">
      <form
        className="flex flex-col gap-4 mb-6 mx-auto max-w-[400px]"
        onSubmit={handleSubmit(submit)}
      >
        {/* Prénom */}
        <div className="flex flex-col mb-2">
          <label htmlFor="firstName" className="mb-2">
            Prénom
          </label>
          <input
            {...register("firstName")}
            type="text"
            id="firstName"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        {/* Nom */}
        <div className="flex flex-col mb-2">
          <label htmlFor="lastName" className="mb-2">
            Nom
          </label>
          <input
            {...register("lastName")}
            type="text"
            id="lastName"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </div>

        {/* Pseudo */}
        <div className="flex flex-col mb-2">
          <label htmlFor="username" className="mb-2">
            Pseudo
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col mb-2">
          <label htmlFor="email" className="mb-2">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Téléphone */}
        <div className="flex flex-col mb-2">
          <label htmlFor="phone" className="mb-2">
            Téléphone
          </label>
          <input
            {...register("phone")}
            type="text"
            id="phone"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Code postal */}
        <div className="flex flex-col mb-2">
          <label htmlFor="postalCode" className="mb-2">
            Code postal
          </label>
          <input
            {...register("postalCode")}
            type="text"
            id="postalCode"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.postalCode && (
            <p className="text-red-500">{errors.postalCode.message}</p>
          )}
        </div>

        {/* Date de naissance */}
        <div className="flex flex-col mb-2">
          <label htmlFor="birthday" className="mb-2">
            Date de naissance
          </label>
          <input
            {...register("birthday")}
            type="date"
            id="birthday"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.birthday && (
            <p className="text-red-500">{errors.birthday.message}</p>
          )}
        </div>

        {/* Genre */}
        <div className="flex flex-col mb-2">
          <label htmlFor="gender" className="mb-2">
            Genre
          </label>
          <select
            {...register("gender")}
            id="gender"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionnez...</option>
            <option value="female">Femme</option>
            <option value="male">Homme</option>
            <option value="other">Autre</option>
          </select>
          {errors.gender && (
            <p className="text-red-500">{errors.gender.message}</p>
          )}
        </div>

        {/* Mot de passe */}
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

        {/* Confirmation */}
        <div className="flex flex-col mb-2">
          <label htmlFor="confirmPassword" className="mb-2">
            Confirmation du mot de passe
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Conditions */}
        <div className="flex flex-col mb-2">
          <label htmlFor="agreeToTerms" className="mb-2">
            <input
              {...register("agreeToTerms")}
              type="checkbox"
              className="mr-2"
              id="agreeToTerms"
            />
            En soumettant ce formulaire, j'accepte ...
          </label>
          {errors.agreeToTerms && (
            <p className="text-red-500">{errors.agreeToTerms.message}</p>
          )}
        </div>

        <NavLink to="/login" className="text-blue-500">
          Déjà inscrit ?
        </NavLink>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
    </div>
  );
}
