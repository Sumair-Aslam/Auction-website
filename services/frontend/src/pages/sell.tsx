import styled from '@emotion/styled';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import xw from 'xwind/macro';
import * as Yup from 'yup';
import Countdown from '../../components/Countdown';
import { centsToDollars } from '../utils/cents-to-dollars';
import Breadcrumb from '../components/Breadcrumb';
import Breadcrumbs from '../components/Breadcrumbs';
import DatePicker from '../components/DatePicker';
import Error from '../components/ErrorMessage';
import AppContext from '../context/app-context';




const StyledAnchorTableRowValue = styled.td(xw`
	text-right 
	max-w-2xl 
  hover:underline
  cursor-pointer
	text-gray-500
`);

const StyledErrorMessage = styled.div(xw`
    text-sm
    text-red-600
    my-0.5
`);

const StyledListing = styled.div(xw`
	flex 
	flex-wrap 
	-mx-8 
`);

const StyledTextContent = styled.div(xw`
	lg:w-1/2 
	px-8 
	lg:mt-0 
  w-full
	order-2 
	lg:order-none
`);

const StyledTable = styled.table(xw`
	w-full 
	mb-6
`);

const StyledTableRow = styled.tr(xw`
	border-t
`);

const StyledTableRowName = styled.td(xw`
	py-3 
	font-medium 
	text-gray-700
`);

const StyledTableRowValue = styled.td(xw`
	text-right 
	max-w-2xl 
	text-gray-500
`);

const StyledImgContainer = styled.div(xw`
	lg:w-1/2 
	px-8
`);

const StyledImg = styled.img(xw`
	mb-4 
	rounded 
	shadow
`);

const validationSchema = Yup.object({
  // title: Yup.string()
  //   .max(15, 'Must be 15 characters or less')
  //   .required('Required'),
  // description: Yup.string()
  //   .max(5000, 'Must be 5000 characters or less')
  //   .required('Required'),
  // image: Yup.mixed().required('Required'),
  // sopDocument: Yup.mixed().required('Required'),
  // labReports: Yup.mixed().required('Required'),
  price: Yup.string()
    .matches(
      /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/,
      'The start price must be a number with at most 2 decimals'
    )
    .required('Required'),
  // fixPrice: Yup.string()
  //   .matches(
  //     /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/,
  //     'The fix price must be a number with at most 2 decimals'
  //   )
  //   .required('Required'),
  // quantity: Yup.string()
  //   .matches(
  //     /^\s*-?(\d)*$/,
  //     'The quantity must be a Whole number'
  //   )
  //   .required('Required'),
  // massOfItem: Yup.string()
  //   .matches(
  //     /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/,
  //     'The mass of Item should not be Zero or less and it must be a number with at most 2 decimals.'
  //   )
  //   .required('Required'),

  expiresAt: Yup.date()
    .required('Required')
    .min(
      new Date(Date.now() + 6400000),
      'Auctions must last atleast 24 hours'
    ),
});

const Sell = ({ inventoryData }) => {
  const {
    auth: { isAuthenticated },
  } = useContext(AppContext);
  console.log("inventoryData", inventoryData);

  const [listings, setListings] = useState(inventoryData);
  const [listing, setListing] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState(['North California', 'South California']);
  const [selectedOption, setSelectedOption] = useState();

  const onSubmit = async (body) => {
    setIsSubmitting(true);

    try {

      // body.fixPrice *= 100;
      body.price *= 100;
      body.paymentConfirmation = true;
      body.inventoryItemId = listing.id;

      const formData = new FormData();
      console.log('body', body);
      Object.keys(body).forEach((key) => formData.append(key, body[key]));
      // Display the key/value pairs
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      // for (var value of formData.values()) {
      //   console.log(value);
      // }
      const { data } = await axios.post('/api/listings', body);
      toast.success('Sucessfully listed item for sale!');
      Router.push(`/listings/${data.slug}`);
    } catch (err) {
      console.log('err', err);
      console.log('err', err.response);

      err.response.data?.errors.forEach((err) => toast.error(err.message));
    }

    setIsSubmitting(false);
  };

  if (!isAuthenticated) {
    return (
      <Error
        error="Error 401"
        message="You must be logged in to sell an item."
      />
    );
  }
  useEffect(() => {
    const room = listing && listing.slug;
    if (!room) return;

    const socket = io('/socket', {
      secure: false,
      query: `r_var=${room}`,
    });

    socket.emit('join');

    socket.on('inventory', (data) => {
      setListing(data);
    });

    socket.on('inventory-deleted', (data) => {
      setListing(data);
    });
    socket.on('inventory-updated', (data) => {
      setListing(data);
    });


    return () => socket.emit('unsubscribe', room);
  }, []);
  return (
    <>
      <Head>
        <title>Sell an Item | auctionweb.site</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Breadcrumbs>
        <Breadcrumb link="/" name="home" />
        <Breadcrumb link="/sell" name="Sell an Item" />
      </Breadcrumbs>
      <section className="py-3">
        <h3 className="text-3xl leading-tight font-semibold font-heading">
          Create Listing
        </h3>
        <p className="mt-1 max-w-2xl text-l text-gray-500">
          Put an item up for auction
        </p>
        <Formik
          initialValues={{
            // title: '',
            // description: '',
            price: '',
            // massOfItem: '',
            // quantity: '',
            // fixPrice: '',
            expiresAt: '',
            // image: '',
            // sopDocument: '',
            // labReports: '',
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (

            <Form className="space-y-8 py-5 divide-y divide-gray-200">
              {/* {console.log("props", props)} */}

              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div className="space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Select Item
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="mt-1 relative">
                        <button type="button" onClick={() => setShow(!show)} className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                          <span className="flex items-center">
                            {selectedOption ? (
                              <span className="ml-3 block truncate"> {selectedOption} </span>
                            ) : (
                              <span className="ml-3 block truncate"> ---Select Please--- </span>
                            )}

                          </span>
                          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </button>
                        {show ? (
                          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" tabIndex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
                            {listings.map((opt, idx) => (
                              opt.status === "Available" ? (
                                <li key={idx} onClick={() => {
                                  setShow(false)
                                  setSelectedOption(opt.title)
                                  setListing(opt)
                                }} className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9" id="listbox-option-0" role="option">
                                  {console.log("opt", opt)}
                                  <div className="flex items-center">
                                    <span className="font-normal ml-3 block truncate"> {opt.title} </span>
                                  </div>
                                  {opt.title === selectedOption ? (
                                    <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  ) : (null)}

                                </li>
                              ) : (null)

                            ))}

                          </ul>
                        ) : (null)}
                      </div>
                    </div>
                  </div>
                  {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Title
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <Field
                        type="text"
                        name="title"
                        className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="title"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Description
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <Field
                        as="textarea"
                        name="description"
                        rows={6}
                        className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="description"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Image
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <ImageUpload
                        name="image"
                        setFieldValue={props.setFieldValue}
                        className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="image"
                      />
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="sopDocument"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      SOP Document
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <SOPUpload
                        name="sopDocument"
                        setFieldValue={props.setFieldValue}
                        className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="sopDocument"
                      />
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="labReports"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Lab Reports
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <LabReportsUpload
                        name="labReports"
                        setFieldValue={props.setFieldValue}
                        className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="labReports"
                      />
                    </div>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Location
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="mt-1 relative">
                        <button type="button" onClick={() => setShow(!show)} className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label">
                          <span className="flex items-center">
                            <span className="ml-3 block truncate"> {selectedOption} </span>
                          </span>
                          <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                        </button>
                        {show ? (
                          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" tabIndex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
                            {options.map((opt, idx) => (
                              <li key={idx} onClick={() => {
                                setShow(false)
                                setSelectedOption(opt)
                              }} className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9" id="listbox-option-0" role="option">
                                {console.log("opt", opt)}
                                <div className="flex items-center">
                                  <span className="font-normal ml-3 block truncate"> {opt} </span>
                                </div>
                                {opt === selectedOption ? (
                                  <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                ) : (null)}

                              </li>
                            ))}

                          </ul>
                        ) : (null)}
                      </div>
                    </div>
                  </div> */}

                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Start Price
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <Field
                        type="text"
                        name="price"
                        className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="price"
                      />
                    </div>
                  </div>
                  {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="fixPrice"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Fix Price
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <Field
                        type="text"
                        name="fixPrice"
                        className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="fixPrice"
                      />
                    </div>
                  </div> */}
                  {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Quantity
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <Field
                        type="text"
                        name="quantity"
                        className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="quantity"
                      />
                    </div>
                  </div> */}
                  {/* <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="massOfItem"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Mass of Item
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="relative flex items-stretch flex-grow focus-within:z-10">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">g</span>
                        </div>
                        <Field
                          type="number"
                          name="massOfItem"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-7 sm:text-sm border-gray-300"
                        />
                      </div>
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="massOfItem"
                      />
                    </div>
                  </div> */}
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      End Date
                    </label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <DatePicker
                        name="expiresAt"
                        autocomplete="off"
                        value={props.values.expiresAt}
                        onChange={props.setFieldValue}
                        className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500  sm:max-w-4xl sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        component={StyledErrorMessage}
                        name="expiresAt"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {listing ? (
                <StyledListing>
                  <br></br>
                  <StyledTextContent>
                    <section className="py-3 mb-3">
                      <h3 className="text-3xl leading-tight font-semibold font-heading">
                        {listing.title}
                      </h3>
                      <p className="mt-1 max-w-2xl text-l text-gray-500">
                        {listing.description}
                      </p>
                    </section>
                    <StyledTable>
                      <tbody>
                        <StyledTableRow>
                          <StyledTableRowName>Fixed Price</StyledTableRowName>
                          <StyledTableRowValue>
                            {centsToDollars(listing.totalPrice)}
                          </StyledTableRowValue>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableRowName>Available Quantity</StyledTableRowName>
                          <StyledTableRowValue>
                            {listing.quantity}
                          </StyledTableRowValue>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableRowName>Mass of Item</StyledTableRowName>
                          <StyledTableRowValue>
                            {listing.massOfItem}g
                          </StyledTableRowValue>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableRowName>Location</StyledTableRowName>
                          <StyledTableRowValue>
                            {listing.location}
                          </StyledTableRowValue>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableRowName>Sop Document</StyledTableRowName>
                          <StyledTableRowValue>
                            <a href={listing.sopDocumentUrl} target="_blank" download style={{ float: 'right' }}>
                              <img src="/images/download.svg"></img>
                            </a>
                          </StyledTableRowValue>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableRowName>Lab Reports</StyledTableRowName>
                          <StyledTableRowValue>
                            <a href={listing.labReportUrl} target="_blank" download style={{ float: 'right' }}>
                              <img src="/images/download.svg"></img>
                            </a>
                          </StyledTableRowValue>
                        </StyledTableRow>
                      </tbody>
                    </StyledTable>
                    <Formik
                      initialValues={{
                        amount: '',
                      }}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                    >
                      <Form>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          {/* <div className="relative flex items-stretch flex-grow focus-within:z-10">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <Field
                            type="text"
                            name="amount"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-7 sm:text-sm border-gray-300"
                            placeholder="Amount to bid"
                          />
                        </div> */}
                          {/* <button
                          type="submit"
                          className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          {isBidding ? 'Placing bid...' : 'Bid now!'}
                        </button> */}
                        </div>
                        <ErrorMessage component={StyledErrorMessage} name="amount" />
                        {/* <div style={{ justifyContent: 'center' }} className="flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">or</span>
              </div> */}

                        {/* <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <Field
                    type="text"
                    name="quantity"
                    onChange={(e) => {
                      console.log("e", e);

                      setQuantity(e.target.value)
                    }}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-7 sm:text-sm border-gray-300"
                    placeholder="Quantity to buy"
                  />
                </div>
                <button
                  type="button"
                  onClick={onBuy}
                  className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {isBuying ? 'Buying...' : 'Buy now!'}
                </button>
              </div> */}
                        <ErrorMessage component={StyledErrorMessage} name="quantity" />
                      </Form>
                    </Formik>
                  </StyledTextContent>
                  <StyledImgContainer>
                    <StyledImg src={listing.largeImage} alt="Product Image" />
                  </StyledImgContainer>
                </StyledListing>) : (null)}


              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? 'Creating listing...' : 'Create listing'}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </section>
    </>
  );
};
Sell.getInitialProps = async (context: NextPageContext, client: any) => {
  try {
    const { data } = await client.get(`/api/inventory/me`);
    console.log("data", data);

    return { inventoryData: data };
  } catch (err) {
    console.error(err);
    return { inventoryData: [] };
  }
};

export default Sell;
