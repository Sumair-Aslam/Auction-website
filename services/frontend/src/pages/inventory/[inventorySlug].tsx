import styled from '@emotion/styled';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { NextPageContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import xw from 'xwind/macro';
import Breadcrumb from '../../components/Breadcrumb';
import Breadcrumbs from '../../components/Breadcrumbs';
import Error from '../../components/ErrorMessage';
import AppContext from '../../context/app-context';
import { centsToDollars } from '../../utils/cents-to-dollars';


const StyledInventory = styled.div(xw`
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

const StyledAnchorTableRowValue = styled.td(xw`
	text-right 
	max-w-2xl 
  hover:underline
  cursor-pointer
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

const StyledErrorMessage = styled.div(xw`
    text-sm
    text-red-600
    my-0.5
`);

const Inventory = ({ inventoryData }) => {
  const [inventory, setInventory] = useState(inventoryData);
  const [quantity, setQuantity] = useState(0);
  const [isBuying, setIsBuying] = useState(false);

  console.log("inventory", inventory);

  const {
    auth: { isAuthenticated, currentUser },
    setAuth,
  } = useContext(AppContext);

  // useEffect(() => {
  //   const room = inventory
  //   // && listing.slug;
  //   if (!room) return;

  //   const socket = io('/socket', {
  //     secure: false,
  //     query: `r_var=${room}`,
  //   });

  //   socket.emit('join');

  //   socket.on('bid', (data) => {
  //     setInventory(data);
  //   });

  //   socket.on('bid-deleted', (data) => {
  //     setInventory(data);
  //   });

  //   socket.on('listing-deleted', (data) => {
  //     setInventory(data);
  //   });

  //   return () => socket.emit('unsubscribe', room);
  // }, []);

  const onSubmit = async () => {
    setIsBuying(true);
    // console.log("currentUser", currentUser);
    console.log('inventory', inventory);

    try {
      await axios.post(`/api/inventory/buy/${inventory.id}`, {
        amount: inventory.totalPrice,
        user: inventory.user
      });
      toast.success('Sucessfully Bought Item!');
      Router.push(`/inventory`);

    } catch (err) {
      console.log('err', err);
      console.log('err.response', err.response);
      err.response.data.errors.forEach((err) => toast.error(err.message));
    }

    setIsBuying(false);
  };

  if (!inventory) {
    return (
      <>
        <Error
          error="Error 404"
          message="Our server couldn't find that inventory. It may have been deleted or there is a mispelling in the URL"
        />
      </>
    );
  }

  // const validationSchema = Yup.object({
  //   amount: Yup.string()
  //     .matches(
  //       /^\s*-?(\d+(\.\d{1,2})?|\.\d{1,2})\s*$/,
  //       'The start price must be a number with at most 2 decimals'
  //     )
  //     .required('Required'),
  // });

  return (
    <>
      <Head>
        <title>{inventory.title} | auctionweb.site</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Breadcrumbs>
        <Breadcrumb link="/" name="Home" />
        <Breadcrumb link="/inventory" name="Browse Inventory" />
        <Breadcrumb link="/inventory" name={inventory.title} />
      </Breadcrumbs>
      <StyledInventory>
        <StyledTextContent>
          <section className="py-3 mb-3">
            <h3 className="text-3xl leading-tight font-semibold font-heading">
              {inventory.title}
            </h3>
            <p className="mt-1 max-w-2xl text-l text-gray-500">
              {inventory.description}
            </p>
          </section>
          <StyledTable>
            <tbody>
              <StyledTableRow>
                <StyledTableRowName>Total Price</StyledTableRowName>
                <StyledTableRowValue>
                  {centsToDollars(inventory.totalPrice)}
                </StyledTableRowValue>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableRowName>Available Quantity</StyledTableRowName>
                <StyledTableRowValue>
                  {inventory.quantity}
                </StyledTableRowValue>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableRowName>Mass of Item</StyledTableRowName>
                <StyledTableRowValue>
                  {inventory.massOfItem}g
                </StyledTableRowValue>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableRowName>Location</StyledTableRowName>
                <StyledTableRowValue>
                  {inventory.location}
                </StyledTableRowValue>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableRowName>Sop Document</StyledTableRowName>
                <StyledTableRowValue>
                  <a href={inventory.sopDocumentUrl} target="_blank" download style={{ float: 'right' }}>
                    <img src="/images/download.svg"></img>
                  </a>
                </StyledTableRowValue>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableRowName>Lab Reports</StyledTableRowName>
                <StyledTableRowValue>
                  <a href={inventory.labReportUrl} target="_blank" download style={{ float: 'right' }}>
                    <img src="/images/download.svg"></img>
                  </a>
                </StyledTableRowValue>
              </StyledTableRow>

              <StyledTableRow>
                <StyledTableRowName>Seller</StyledTableRowName>
                <Link href={`/profile/${inventory.user.name}`}>
                  <StyledAnchorTableRowValue>
                    {inventory.user.name}
                  </StyledAnchorTableRowValue>
                </Link>
              </StyledTableRow>
            </tbody>
          </StyledTable>
          <Formik
          // initialValues={{
          //   amount: '',
          // }}
          // validationSchema={validationSchema}
          // onSubmit={onSubmit}
          >
            <Form>
              <div className="mt-1 flex rounded-md shadow-sm" style={{ float: 'right', marginBottom: '10px' }}>
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
                <button
                  type="button"
                  onClick={onSubmit}
                  // className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"                >
                  {isBuying ? 'Buying...' : 'Buy now!'}
                </button>
              </div>
              {/* <ErrorMessage component={StyledErrorMessage} name="amount" /> */}
            </Form>
          </Formik>
        </StyledTextContent>
        <StyledImgContainer>
          <StyledImg src={inventory.largeImage} alt="Product Image" />
        </StyledImgContainer>
      </StyledInventory>
    </>
  );
};

Inventory.getInitialProps = async (context: NextPageContext, client: any) => {
  try {
    const { inventorySlug } = context.query;
    console.log("inventorySlug", inventorySlug);

    const { data } = await client.get(`/api/inventory/${inventorySlug}`);
    return { inventoryData: data };
  } catch (err) {
    console.error(err);
    return { inventoryData: null };
  }
};

export default Inventory;
