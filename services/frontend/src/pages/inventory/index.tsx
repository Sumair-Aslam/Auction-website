import styled from '@emotion/styled';
import Head from 'next/head';
import React from 'react';
import xw from 'xwind/macro';
import Breadcrumb from '../../components/Breadcrumb';
import Breadcrumbs from '../../components/Breadcrumbs';
import InventoryCard from '../../components/InventoryCard';
import InventorySoldCard from '../../components/InventorySoldCard';



const StyledInventory = styled.div(xw`
	py-3
	flex 
	flex-wrap 
	-mx-2 
	-mb-4
`);

const Inventory = ({ inventories }) => {
  return (
    <>
      {console.log("inventories", inventories)}
      <Head>
        <title> Browsing Inventory | auctionweb.site</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Breadcrumbs>
        <Breadcrumb link="/" name="Home" />
        <Breadcrumb link="/inventory" name="Browse Inventory" />
      </Breadcrumbs>
      <section className="pt-3 mb-3">
        <h3 className="text-3xl leading-tight font-semibold font-heading">
          Showing all Inventory
        </h3>
        <p className="mt-1 max-w-2xl text-l text-gray-500">
          {inventories.length
            ? `Showing ${inventories.length} results of ${inventories.length}`
            : `Found no results`}
        </p>
      </section>
      <StyledInventory>
        {inventories.map((inventory, idx) => (
          inventory.status === "Available" ? (
            <InventoryCard
              key={idx}
              name={inventory.title}
              price={inventory.totalPrice}
              smallImage={inventory.smallImage}
              slug={`/inventory/${inventory.id}`}
            />
          ) : (
            <InventorySoldCard
              key={idx}
              name={inventory.title}
              price={inventory.totalPrice}
              smallImage={inventory.smallImage}
              status={inventory.status}
            />
          )
        ))}
      </StyledInventory>
    </>
  );
};

Inventory.getInitialProps = async ({ query }, client) => {
  try {
    const { data } = await client.get(`/api/inventory`);
    return { inventories: data };
  } catch (err) {
    console.error(err);
    return { inventories: [] };
  }
};

export default Inventory;
