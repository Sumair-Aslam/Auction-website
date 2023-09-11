import axios from 'axios';
import { NextPageContext } from 'next';
import Head from 'next/head';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import DashboardBreadcrumbs from '../../components/DashboardBreadcrumbs';
import DashboardTabs from '../../components/DashboardTabs';
import Error from '../../components/ErrorMessage';
import InventoryModal from '../../components/inventoryModal';
import InventoryDashboardTableRow from '../../components/InventoryDashboardTableRow';
import AppContext from '../../context/app-context';

const Inventory = ({ inventoryData }) => {
    const {
        auth: { isAuthenticated },
    } = useContext(AppContext);
    console.log("inventoryData", inventoryData);

    const [inventories, setInventories] = useState(inventoryData);
    const [inventory, setInventory] = useState([]);

    const [open, setOpen] = useState(false)
    console.log('inventories', inventories);

    const onDelete = async (inventoryId) => {
        try {
            await axios.delete(`/api/inventory/${inventoryId}`);
            setInventories(inventories.filter((inventory) => inventory.id !== inventoryId));
            toast.success('Sucessfully deleted inventory!');
        } catch (err) {
            err.response.data.errors.forEach((err) => toast.error(err.message));
        }
    };

    if (!isAuthenticated) {
        return (
            <Error
                error="Error 401"
                message="You must be logged in to view your dashboard."
            />
        );
    }

    return (
        <>
            <Head>
                <title>Inventory Dashboard | auctionweb.site</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <DashboardBreadcrumbs
                name="Inventory Dashboard"
                link="/dashboard/inventory"
            />
            <section className="py-3">
                <h3 className="text-3xl leading-tight font-semibold font-heading">
                    Inventory Dashboard
                </h3>
                <p className="mt-1 max-w-2xl text-l text-gray-500">
                    See all the items of Inventory
                </p>
                <DashboardTabs />
                <div className="flex flex-col mt-3">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Listing
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Created
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Fixed Price
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Quantity
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Location
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Lab Reports
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                SOP Documents
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {inventories.map((inventory, index) => (
                                            // <div key={index}>
                                            <InventoryDashboardTableRow
                                                index={index}
                                                inventory={inventory}
                                                onDelete={() => onDelete(inventory.id)}
                                                tab="inventory"
                                                setOpen={setOpen}
                                                setInventory={setInventory}
                                            />
                                            // </div>
                                        ))}
                                        {!inventories.length && (
                                            <p className="m-4 max-w-2xl text-l">
                                                You have created nothing in Inventory yet.
                                            </p>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <InventoryModal open={open} setOpen={setOpen} inventory={inventory} setInventories={setInventories} />
        </>
    );
};

Inventory.getInitialProps = async (context: NextPageContext, client: any) => {
    try {
        const { data } = await client.get(`/api/inventory/me`);
        return { inventoryData: data };
    } catch (err) {
        console.error(err);
        return { inventoryData: [] };
    }
};

export default Inventory;
