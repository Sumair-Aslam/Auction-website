import styled from '@emotion/styled';
import Link from 'next/link';
import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import xw from 'xwind/macro';

import AppContext from '../context/app-context';
import { centsToDollars } from '../utils/cents-to-dollars';
import Countdown from './Countdown';


interface IProps {
  name: string;
  // expiresAt: string;
  price: number;
  status: string;
  smallImage: string;
}

const StyledInventorySoldCard = styled.div(xw`
	w-full
	lg:w-1/5
  sm:w-1/3
	px-2
	mb-4
`);

const StyledCardContent = styled.div(xw`
	rounded
	shadow
	cursor-pointer
`);

const TextWrapper = styled.div(xw`
	p-3
`);

const StyledText = styled.a(xw`
	text-indigo-600 
	hover:underline
`);

const StyledPrice = styled.p(xw`
	text-xl
`);

const StyledImg = styled.img(xw`
	w-full	
`);

const InventorySoldCard = ({ name, price, status, smallImage }: IProps) => {

  const {
    auth: { isAuthenticated, currentUser },
    setAuth,
  } = useContext(AppContext);
  console.log("isAuthenticated", isAuthenticated);
  return (
    <StyledInventorySoldCard>
      {isAuthenticated ? (
        <StyledCardContent>
          <StyledImg src={smallImage} alt={name} />
          <TextWrapper>
            <StyledText>
              {name}
            </StyledText>
            <StyledPrice>{centsToDollars(price)}</StyledPrice>
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              {status}
            </span>
          </TextWrapper>
        </StyledCardContent>
      ) : (
        <StyledCardContent>
          <StyledImg onClick={() => {
            toast.error("You must sign in first to view more")
          }} src={smallImage} alt={name} />
          <TextWrapper>
            {/* <StyledText>
              <Countdown expiresAt={expiresAt} />
            </StyledText> */}
            <StyledPrice>{centsToDollars(price)}</StyledPrice>
          </TextWrapper>
        </StyledCardContent>
      )}
    </StyledInventorySoldCard>
  );
};

export default InventorySoldCard;
