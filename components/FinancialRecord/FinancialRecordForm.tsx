import { useEffect, useState } from "react";
import { FinancialRecordType } from "../../class/FinancialRecordType";
import CreatableSelect from 'react-select/creatable';
import { useToast } from "../Toast/ToastProvider";
import { tagService } from "../../services/tag.service";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { FinancialRecord } from "../../class/FinancialRecord";
import { financialRecordService } from "../../services/financial-record.service";
import moment from "moment";
import { Tag } from "../../class/Tag";


type FinancialRecordFormProps = {
  records: Array<FinancialRecord>,
}

export const FinancialRecordForm: React.FC<FinancialRecordFormProps> = (props) => {

    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [values, setValues] = useState([]);
    const [optionsTags, setOptionsTags] = useState([]);

    const toast = useToast();

    const keys = Object.keys;

    useEffect(() => {
      setIsLoading(true)

      tagService.getAll()
        .then((tags: Array<Tag>) => {
          setOptionsTags(tags.map(tag => ({...tag, label: tag.name, value: tag.name})))
        })
        .catch(error => {
          toast?.pushError("Erro ao consultar tags. " + error, 7000, "truncate-2-lines");
        }).finally(() => setIsLoading(false))

    }, [])

    const customStyles = {
      control: (base, state) => ({
        ...base,
        height: 44,
        minHeight: 35,
        borderColor: state.isFocused ? "rgb(14, 160, 226)" : base.borderColor,
        "&:hover": {
          borderColor: state.isFocused ? "rgb(14, 160, 226)" : base.borderColor
        },
        borderLeft: state.isFocused ? "5px solid rgb(14, 160, 226)" : null
      })
    };

    const handleCreate = (inputValue: any) => {
      const options: any = optionsTags;
      const newOption = createOption(inputValue);
      setOptionsTags([...options, newOption]);
      setValues([...values, newOption]);
    };

    const createOption = (label: string) => ({
      id: undefined,
      label,
      name: label,
      value: label
    });

   // form validation rules
   const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    date: Yup.string().required(),
    value: Yup.string().required(),
    type: Yup.string().required()
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, setError, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ name, date, value, tags, type, details }) {
    let financialRecord = new FinancialRecord(null, name, details, value, date, type, values)

    return financialRecordService.save(financialRecord)
        .then((response: FinancialRecord) => {
            response.date = moment(response.date, 'YYYY-MM-DD')
            props.records.push(response)
            props.records.sort((a: FinancialRecord , b: FinancialRecord) => b.date.unix() - a.date.unix())
            toast.pushSuccess("Registro salvo com sucesso", 5000);
        })
        .catch(error => {
          toast?.pushError("Erro ao salvar registro. " + error, 7000, "truncate-2-lines");
          setError('apiError', { message: error?.message });
        });
  }

    return (
        <>
        <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border-0 rounded-lg shadow-lg bg-blueGray-100">
          <div className="px-4 py-4 mb-0 bg-white rounded-t cursor-pointer lg:w-12/12" onClick={() => setShowForm(!showForm)}>
            <div className="flex justify-between text-center">
              <h6 className="text-xl font-bold text-blueGray-700">Formulário</h6>
              <i
                className={`mt-1 cursor-pointer text-xl fas ${showForm ? 'fa-chevron-circle-up' : 'fa-chevron-circle-down'} `}
              ></i>
            </div>
          </div>
          <div className={`${showForm ? '' : 'hidden'} flex-auto px-4 py-2 pt-0 lg:px-2`}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-wrap mt-6 mb-6">
                <div className="w-full px-4 lg:w-4/12">
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
                      className={`${errors.name ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="w-full px-4 lg:w-4/12">
                  <div className="relative w-full mb-3">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Data
                    </label>
                    <input
                      type="date"
                      {...register('date')}
                      className={`${errors.date ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                    />
                  </div>
                </div>
                <div className="w-full px-4 lg:w-4/12">
                  <div className="relative w-full mb-3">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Valor
                    </label>
                    <input
                      type="number" min="1" step="any"
                      {...register('value')}
                      className={`${errors.value ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                      defaultValue=""
                    />
                  </div>
                </div>
                <div className="w-full px-4 lg:w-8/12">
                  <div className="relative w-full mb-3">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Tags
                    </label>
                    <CreatableSelect
                      {...register('tags')}
                      name="tags"
                      classNamePrefix="react-select-tw"
                      instanceId={1}
                      isClearable
                      isDisabled={isLoading}
                      isLoading={isLoading}
                      isMulti
                      onChange={(value: []) => setValues(value)}
                      onCreateOption={handleCreate}
                      options={optionsTags}
                      placeholder="Crie ou selecione as tags..."
                      styles={customStyles}
                      value={values}
                    />
                  </div>
                </div>
                <div className="w-full px-4 lg:w-4/12">
                  <div className="relative w-full mb-3">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Tipo
                    </label>
                    <select
                      {...register('type')}
                      className={`${errors.type ? 'is-invalid' : ''} w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring`}
                    >
                        <option value="" label="Selecione o tipo"/>
                        {keys(FinancialRecordType).map(type =>
                          <option key={FinancialRecordType[type]} value={type} label={FinancialRecordType[type]}/>
                        )}
                    </select>
                  </div>
                </div>
                <div className="w-full px-4 lg:w-12/12">
                  <div className="relative w-full mb-3">
                    <label
                      className="block mb-2 text-xs font-bold uppercase text-blueGray-600"
                      htmlFor="grid-password"
                    >
                      Descrição
                    </label>
                    <textarea
                      {...register('details')}
                        rows={3}
                        className="w-full px-3 py-3 text-sm transition-all duration-150 ease-linear bg-white border-0 rounded shadow placeholder-blueGray-300 text-blueGray-600 focus:outline-none focus:ring"
                    />
                  </div>
                </div>
                <div className="flex flex-row-reverse w-full px-4 pt-4">
                    <button
                        className="w-full px-0 py-2 mb-1 text-base font-bold text-center text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none disabled:opacity-50 bg-lightBlue-600 active:bg-blueGray-600 hover:shadow-lg focus:outline-none"
                        type="submit"
                        disabled={formState.isSubmitting}
                        >
                        {formState.isSubmitting && <i className="mx-auto mr-2 text-white fas fa-circle-notch animate-spin text-1xl"></i>}
                        <i className="mr-2 fas fa-cloud-upload-alt"></i> Salvar
                    </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
}