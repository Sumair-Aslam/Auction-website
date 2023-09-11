import styled from '@emotion/styled';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Head from 'next/head';
import Body from 'next/body';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import xw from 'xwind/macro';
import * as Yup from 'yup';

import AppContext from '../../context/app-context';

const StyledErrorMessage = styled.div(xw`
    text-sm
    text-red-600
    my-0.5
`);

const BlockPass = (props) => {
  const { setAuth } = useContext(AppContext);
  const [isKYC, setIsKYC] = useState(false);
  const router = useRouter();
  console.log("props",props);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src="https://cdn.blockpass.org/widget/scripts/release/3.0.0/blockpass-kyc-connect.prod.js";
    script.async = true;
    document.body.appendChild(script);
    
  return () => {
      document.body.removeChild(script);
    }
  }, []);
  const onSubmit = async () => {
    setIsKYC(true);

    try {
      console.log('window.',window);

      const blockpass = new window.BlockpassKYCConnect('scytalelabs_cc0d2', { env: 'prod', local_user_id: Date.now() })
      console.log("Hello", blockpass);
      blockpass.startKYCConnect()
      console.log("Hello2");
      setIsKYC(isKYC + 1);
      blockpass.on('KYCConnectSuccess', () => {
        //add code that will trigger when data have been sent. ex:
        toast.success("Success!");
      })

        blockpass.on('KYCConnectClose', () => {
            //add code that will trigger when the workflow is finished. ex:
            toast.success("Finished!");
            router.push('/auth/signin');
            props.setIsRegister(false)
            setIsKYC(0);
        })

        blockpass.on('KYCConnectCancel', () => {
            //add code that will trigger when the workflow is aborted. ex:
            toast.error("Cancelled!");
            setIsKYC(1);
        })
    } catch (err) {
      toast.error("Unable to process");
      setIsKYC(0);
    }

    
  };

  return (
    <>
      <Head>
        {/* <script src="https://cdn.blockpass.org/widget/scripts/release/3.0.0/blockpass-kyc-connect.prod.js"></script> */}
        <title>KYC | auctionweb.site</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* <Body>
      <script>
       
    </script> 
      </Body> */}
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md md:w-full">
          <img
            className="mx-auto h-12 w-auto"
            src="/images/small-logo.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            KYC with BlockPass
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* <Formik
              onSubmit={onSubmit}
            > */}
              {/* <Form className="space-y-6"> */}
              <div>
              <button
                type="submit"
                onClick={onSubmit}
                id="blockpass-kyc-connect"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isKYC == 1 ? 'Click Again' : isKYC >= 2 ? 'Processing...' : 'Connect With BlockPass'}
              </button>
            </div>
              {/* </Form>
            </Formik> */}
          </div>
        </div>
      </div>
      
    </>
  );
};

export default BlockPass;
