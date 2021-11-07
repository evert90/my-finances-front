import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { LayoutComponent } from "../../class/LayoutComponent";
import { User } from '../../class/User';
import { useToast } from '../../components/Toast/ToastProvider';
import { Auth } from "../../layouts/Auth";
import { userService } from "../../services/user.service";
import Link from "next/link";
import { ModalServiceTerms } from '../../components/Modal/ModalServiceTerms';

// layout for page

export const Register: LayoutComponent = () => {

  const router = useRouter();
  const toast = useToast();
  const [showModal, setShowModal] =  useState<boolean>(false)

  useEffect(() => {
    // redirect to home if already logged in
    if (userService.getUserValue()?.token) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   // form validation rules
   const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required'),
    serviceTerms: Yup.boolean().oneOf([true], 'Service terms is required')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setError, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ name, email, password }) {
    let user = new User(name, email, password)

    return userService.save(user)
        .then(() => {
            // get return url from query parameters or default to '/'
            const returnUrl = router.query?.returnUrl?.toString() || '/admin/dashboard';
            toast?.pushSuccess("Conta cadastrada com sucesso", 5000);
            router.push(returnUrl);
        })
        .catch(error => {
          toast?.pushError("Erro ao criar conta. " + error, 7000, "truncate-2-lines");
          setError('apiError', { message: error?.message });
        });
  }

  return (
    <>
      <div className="container h-full px-4 mx-auto">
        <div className="flex items-center content-center justify-center h-full">
          <div className="w-full px-4 lg:w-6/12">
            <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border-0 rounded-lg shadow-lg bg-blueGray-200">
              <div className="px-6 py-6 mb-0 rounded-t">
                <div className="mb-3 text-center">
                  <h6 className="text-sm font-bold text-blueGray-500">
                    Cadastre-se com sua conta
                  </h6>
                </div>
                <div className="text-center btn-wrapper">
                  <button
                    className="inline-flex items-center px-4 py-2 mb-1 mr-2 text-xs font-bold uppercase transition-all duration-150 ease-linear bg-white rounded shadow outline-none active:bg-blueGray-50 text-blueGray-700 focus:outline-none hover:shadow-md"
                    type="button"
                  >
                    <img alt="..." className="w-5 mr-1" src="/img/github.svg" />
                    Github
                  </button>
                  <button
                    className="inline-flex items-center px-4 py-2 mb-1 mr-1 text-xs font-bold uppercase transition-all duration-150 ease-linear bg-white rounded shadow outline-none active:bg-blueGray-50 text-blueGray-700 focus:outline-none hover:shadow-md"
                    type="button"
                  >
                    <img alt="..." className="w-5 mr-1" src="/img/google.svg" />
                    Google
                  </button>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 py-10 pt-0 lg:px-10">
                <div className="mb-3 font-bold text-center text-blueGray-400">
                  <small>Ou cadastre-se com seus dados</small>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className={`${errors.name ? 'is-invalid' : ''} border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150`}
                      placeholder="Nome completo"
                    />
                    <div className="invalid-feedback" style={{display: "none"}}>{errors.name?.message}</div>
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`${errors.email ? 'is-invalid' : ''} border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150`}
                      placeholder="Email"
                    />
                    <div className="invalid-feedback" style={{display: "none"}}>{errors.email?.message}</div>
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Senha
                    </label>
                    <input
                      type="password"
                      {...register('password')}
                      className={`${errors.password ? 'is-invalid' : ''} border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150`}
                      placeholder="Senha"
                    />
                    <div className="invalid-feedback" style={{display: "none"}}>{errors.password?.message}</div>
                  </div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        {...register('serviceTerms')}
                        type="checkbox"
                        className={`${errors.serviceTerms ? 'border-2 border-red-800' : ''} w-5 h-5 ml-1 transition-all duration-150 ease-linear border-0 rounded form-checkbox text-blueGray-700`}
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        Eu concordo com os{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => setShowModal(true)}
                        >
                          termos de serviço
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      className="w-full px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none disabled:opacity-50 bg-blueGray-800 active:bg-blueGray-600 hover:shadow-lg focus:outline-none"
                      type="submit"
                      disabled={formState.isSubmitting}
                    >
                      {formState.isSubmitting && <i className="mx-auto mr-1 text-white fas fa-circle-notch animate-spin text-1xl"></i>}
                      Criar conta
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="relative flex flex-wrap mt-6">
              <div className="w-1/2">
                <Link href="/auth/login">
                  <a href="#pablo" className="text-blueGray-200">
                    <small>Área de login</small>
                  </a>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                  <a href="#pablo" className="text-blueGray-200">
                    <small>Precisa de ajuda?</small>
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal ? (
          <ModalServiceTerms setShowModalState={setShowModal}></ModalServiceTerms>
      ) : null}
    </>
  );
}

Register.layout = Auth;

export default Register;