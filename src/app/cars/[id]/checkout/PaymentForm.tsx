'use client';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DateRange, { initialRange, Range } from '@/components/DateRange';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import RSelect from '@/components/RSelect';
import { useGarageList } from '@/services/garages';
import { useCreateOrder } from '@/services/orders';
import { Car, Order } from '@/types';
import { User } from '@/types/user';
import { createOptions } from '@/utils/helpers';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Modal, { DialogValue } from '@/components/Modal';

type RangeProps = [Range, React.Dispatch<React.SetStateAction<Range>>];

type Props = { car: Car; rangeProps: RangeProps };
interface Input {
  name: string;
  placeholder: string;
  label: string;
  type: string;
  options?: { label: string; value: string }[];
  class?: string;
  defaultValue?: any;
  value?: any;
  key?: any;
  required?: boolean;
}

interface Subtitle {
  title?: string;
  iconColor?: string;
  logo?: string[];
  class?: string;
  inputs: Input[];
}

interface Form {
  title: string;
  description: string;
  subtitles: Subtitle[];
}
export default function PaymentForm({ car, rangeProps }: Props) {
  const session = useSession();

  const user = session?.data?.user as User;
  const { data: garage } = useGarageList({
    queryParams: { Car: { some: { id: car?.id } } },
    skip: !car?.id,
  });

  const { mutateAsync: createOrder, ...CO } = useCreateOrder();

  const [dialog, setDialog] = useState<DialogValue>(false);
  const [range, setRange] = rangeProps;
  const router = useRouter();

  const current_garage = garage?.data?.[0];
  const defaultGarageValue = current_garage
    ? { label: current_garage?.name, value: current_garage }
    : null;

  const forms: Form[] = useMemo(
    () => [
      {
        title: 'Billing Info',
        description: 'Please enter your billing info',
        subtitles: [
          {
            inputs: [
              {
                name: 'cust_name',
                placeholder: 'Your Name',
                label: 'Name ',
                type: 'text',
                defaultValue: user?.fullname,
                key: user?.fullname || '',
                required: true,
              },
              {
                name: 'cust_phone',
                placeholder: 'Phone Number',
                label: 'Phone Number ',
                type: 'tel',
                required: true,
              },
              {
                name: 'cust_address',
                placeholder: 'Address',
                label: 'Address ',
                type: 'text',
              },
              {
                name: 'cust_city',
                placeholder: 'Town or city',
                label: 'Town/City ',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        title: 'Rental Info',
        description: 'Please select your rental date',
        subtitles: [
          {
            title: 'Pick - Up',
            iconColor: 'primary',

            inputs: [
              {
                name: 'location',
                placeholder: 'Select your city',
                label: 'Location ',
                options: defaultGarageValue ? [defaultGarageValue] : [],
                type: 'select',
                value: defaultGarageValue || { label: '', value: '' },
              },
              {
                name: 'Date',
                placeholder: 'Select your date',
                label: 'Start Date',
                type: 'date-range',
              },

              // {
              //   name: 'time_up',
              //   placeholder: 'Select your time',
              //   label: 'Time ',
              //   type: 'time',
              // },
            ],
          },
          // {
          //   title: 'Drop - Off',
          //   iconColor: 'info',
          //   logo: [],
          //   class: '',
          //   inputs: [
          //     {
          //       name: 'location_off',
          //       placeholder: 'Select your city',
          //       label: 'Location ',
          //       type: 'select',
          //       options: [],
          //       class: '',
          //     },
          //     {
          //       name: 'date_off',
          //       placeholder: 'Select your date',
          //       label: 'Date ',
          //       type: 'date',
          //       options: [],
          //       class: '',
          //     },
          //     {
          //       name: 'time_off',
          //       placeholder: 'Select your time',
          //       label: 'Time ',
          //       type: 'time',
          //       options: [],
          //       class: '',
          //     },
          //   ],
          // },
        ],
      },
      // {
      //   title: 'Payment Method',
      //   description: 'Please enter your payment method',
      //   subtitles: [
      //     {
      //       title: 'Credit Card',
      //       iconColor: 'primary',
      //       logo: ['visa.svg', 'mc.svg'],
      //       class: 'rounded-lg bg-neutral-100 p-5 mt-5',
      //       inputs: [
      //         {
      //           name: 'card_number',
      //           placeholder: 'Card Number',
      //           label: 'Card Number ',
      //           type: 'text',
      //           options: [],
      //           class: '!bg-white',
      //         },
      //         {
      //           name: 'card_expiration',
      //           placeholder: 'DD / MM / YY',
      //           label: 'Expiration Date ',
      //           type: 'date',
      //           options: [],
      //           class: '!bg-white',
      //         },
      //         {
      //           name: 'card_holder',
      //           placeholder: 'Card Holder',
      //           label: 'Card Holder ',
      //           type: 'text',
      //           options: [],
      //           class: '!bg-white',
      //         },
      //         {
      //           name: 'cvc',
      //           placeholder: 'CVC',
      //           label: 'CVC ',
      //           type: 'number',
      //           options: [],
      //           class: '!bg-white',
      //         },
      //       ],
      //     },
      //     {
      //       title: '',
      //       iconColor: '',
      //       logo: [],
      //       class: '',
      //       inputs: [
      //         {
      //           name: 'payment',
      //           placeholder: '',
      //           label: 'Paypal',
      //           type: 'radio',
      //           options: [{ label: 'Paypal', value: 'paypal' }],
      //           class: 'lg:col-span-2',
      //         },
      //         {
      //           name: 'payment',
      //           placeholder: '',
      //           label: 'Bitcoin',
      //           type: 'radio',
      //           options: [{ label: 'Bitcoin', value: 'bitcoin' }],
      //           class: 'lg:col-span-2',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        title: 'Confirmation',
        description:
          'We are getting to the end. Just few clicks and your rental is ready!',
        subtitles: [
          {
            inputs: [
              {
                name: 'agree_marketing',
                placeholder: '',
                label:
                  'I agree with sending an Marketing and newsletter emails. No spam, promissed!',
                type: 'checkbox',
                options: [
                  { label: 'Agree Marketing', value: 'agree_marketing' },
                ],
                class: 'lg:col-span-2',
                required: true,
              },
              {
                name: 'agree_term',
                placeholder: '',
                label:
                  'I agree with our terms and conditions and privacy policy.',
                type: 'checkbox',
                options: [{ label: 'Agree Term', value: 'agree_term' }],
                class: 'lg:col-span-2',
                required: true,
              },
            ],
          },
        ],
      },
    ],
    [user?.fullname, defaultGarageValue],
  );

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const {
        // drop_off,
        // drop_location,
        cust_name,
        cust_phone,
        cust_address,
        cust_city,
        // location_up,
        // date_up,
        // time_up,
        // location_off,
        // date_off,
        // time_off,
        // card_number,
        // card_expiration,
        // card_holder,
        // cvc,
        // payment,
        // agree_marketing,
        // agree_term,
      } = e.target;
      const payload = {};

      const order: Order = (
        await createOrder({
          car_id: car?.id,
          start_date: range.startDate,
          end_date: range.endDate,
          drop_off: false,
          drop_location: null,
          cust_name: cust_name?.value,
          cust_phone: cust_phone?.value,
          cust_address: cust_address?.value,
          cust_city: cust_city?.value,
        })
      )?.data as any;

      router.push(`/payment?id=${order?.id}`);

      console.log('payload', payload);
    } catch (error) {
      console.log('error', error);
      toast.error('Error during checkout');
    }
  };

  const handleClose = () => {
    setRange(initialRange);
    setDialog(false);
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {CO.isPending && <Loading fullscreen />}
      {forms.map((form, iForm) => {
        return (
          <div className="bg-white rounded-lg p-5" key={iForm}>
            <div className="flex justify-between items-start lg:items-end">
              <div>
                <h1 className=" text-gray-900 lg:text-xl font-bold lg:leading-loose">
                  {form.title}
                </h1>
                <p className=" text-slate-400 text-xs lg:text-sm font-medium leading-tight">
                  {form.description}
                </p>
              </div>
              <p className="text-slate-400 text-xs lg:text-sm font-medium leading-tight">
                Step {iForm + 1} of {forms.length}
              </p>
            </div>
            {dialog && (
              <Modal
                dialogProps={[dialog, setDialog]}
                handleClose={handleClose}
              >
                <DateRange rangeProps={[range, setRange]} />
                <div className="flex justify-end gap-2 w-full pt-5 ">
                  <Button outline type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setDialog(false)}
                    // disabled={uC?.isPending || aC?.isPending || uploadC?.isPending}
                    variant="primary"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </Modal>
            )}
            {form.subtitles.map((sub, iSub) => {
              return (
                <div className={` py-5 ${sub.class}`} key={iSub}>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1 mb-5">
                      {sub.iconColor && (
                        <div
                          className={`w-4 h-4 p-1 ${sub.iconColor == 'primary' ? 'bg-primary/30' : 'bg-info/30'} rounded-3xl justify-center items-center inline-flex`}
                        >
                          <span
                            className={`w-2 h-2 ${sub.iconColor == 'primary' ? 'bg-primary' : 'bg-info'}  rounded-full`}
                          />
                        </div>
                      )}
                      <h4 className=" text-black font-semibold ">
                        {sub.title}
                      </h4>
                    </div>
                    {!!sub?.logo?.length && (
                      <div className="flex items-center gap-2">
                        {sub?.logo?.map((logo, iLogo) => (
                          <img
                            key={iLogo}
                            src={`/icons/${logo}`}
                            alt={logo}
                            className=""
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid lg:grid-cols-2 gap-5 ">
                    {sub.inputs.map((v, i) => {
                      if (v?.type === 'date-range') {
                        return (
                          <div className="space-y-1 w-full" key={i}>
                            <label className={`text-gray-900 font-semibold`}>
                              Select your date
                            </label>

                            <button
                              onClick={() => setDialog(true)}
                              type="button"
                              className=" bg-neutral-100 hover:opacity-70 px-4 py-3 rounded-lg items-center gap-3 flex mt-3"
                            >
                              <svg
                                className="w-4 h-4 text-gray-700 "
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                              </svg>
                              {/* <MdDateRange className="text-white text-2xl" /> */}
                              <span className="text-gray-700 font-medium ">
                                {format(range?.startDate, 'd MMMM yyyy')} -{' '}
                                {format(range?.endDate, 'd MMMM yyyy')}
                              </span>
                            </button>
                          </div>
                        );
                      }
                      if (!['select', 'checkbox', 'radio'].includes(v.type)) {
                        return (
                          <div key={i}>
                            <Input
                              textarea={v.type === 'textarea'}
                              inputClass={`${v.class}`}
                              type={v.type || 'text'}
                              label={v.label}
                              name={v.name}
                              placeholder={v.placeholder}
                              defaultValue={v.defaultValue || ''}
                              key={v.key}
                              required={!!v.required}
                            />
                          </div>
                        );
                      }
                      if (['radio', 'checkbox']?.includes(v.type)) {
                        return (
                          <div
                            key={i}
                            className={`${v.class}  flex justify-between items-center gap-5 rounded-lg bg-neutral-100 p-5 w-full`}
                          >
                            {v.type == 'checkbox' ? (
                              <Checkbox
                                labelClass={
                                  '!text-gray-900 !text-sm lg:!text-base !font-semibold !grid w-[90%]'
                                }
                                markClass={'!top-1'}
                                className={`${v.class}`}
                                label={v.label}
                                name={v.options?.[0].value}
                                required={!!v.required}
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <input
                                  type={v.type}
                                  name={v.name}
                                  value={v.options?.[0]?.value}
                                  id={v.options?.[0]?.value}
                                  className="cursor-pointer w-4 h-4 lg:w-5 lg:h-5"
                                />
                                <label
                                  htmlFor={v.options?.[0]?.value}
                                  className={`cursor-pointer text-gray-900 text-sm lg:text-base font-semibold`}
                                >
                                  {v.label}
                                </label>
                              </div>
                            )}

                            {['paypal', 'bitcoin']?.includes(
                              v.label.toLowerCase(),
                            ) && (
                              <img
                                src={`/icons/${v.label.toLowerCase()}.svg`}
                                alt={v.label}
                              />
                            )}
                          </div>
                        );
                      }
                      if (v.type === 'select') {
                        const { type, class: className, ...restSelect } = v;
                        return (
                          <RSelect
                            {...restSelect}
                            // creatable
                            key={i}
                            // className={`${v.class}`}
                            inputClass={`${v.class} !rounded-lg !bg-neutral-100 !border-0 !border-transparent focus:!border-none focus:!ring-0 focus:!outline-none hover:!border-none hover:!border-transparent !shadow-none `}
                          />
                        );
                      }
                    })}
                  </div>
                </div>
              );
            })}
            {forms?.length == iForm + 1 && (
              <>
                <Button variant="primary" type="submit">
                  Rent Now
                </Button>
                <div className="mt-7">
                  <img
                    src={`/icons/security-safety.svg`}
                    alt="security safe"
                    className="mb-3 w-8 h-8"
                  />
                  <p className=" text-gray-900 font-semibold mb-1">
                    All your data are safe
                  </p>
                  <p className="text-slate-400 text-xs lg:text-sm font-medium  lg:leading-tight">
                    We are using the most advanced security to provide you the
                    best experience ever.
                  </p>
                </div>
              </>
            )}
          </div>
        );
      })}
    </form>
  );
}
