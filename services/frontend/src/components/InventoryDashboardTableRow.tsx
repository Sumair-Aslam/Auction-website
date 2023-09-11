import Link from 'next/link';

import { centsToDollars } from '../utils/cents-to-dollars';
import Countdown from './Countdown';

const InventoryDashboardTableRow = ({ index, inventory, onDelete, tab, setOpen, setInventory }) => {
  return (
    <tr key={index}>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link href={`/listings/${inventory.slug}`}>
          <a className="hover:underline text-sm text-gray-900">
            {inventory.title}
          </a>
        </Link>
        {/* <div className="text-sm text-gray-500">
          Time Left: <Countdown expiresAt={inventory.expiresAt} />
        </div> */}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(inventory.createdAt).toLocaleDateString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {centsToDollars(inventory.currentPrice)}
      </td> */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {centsToDollars(inventory.price)}
      </td>
      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {centsToDollars(inventory.startPrice)}
      </td> */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {inventory.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {inventory.location}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <a href={inventory.labReportUrl} target="_blank" download >
          <img src="/images/download.svg"></img>
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <a href={inventory.sopDocumentUrl} target="_blank" download >
          <img src="/images/download.svg"></img>
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {inventory.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={onDelete}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Delete
        </button>
      </td>
      {tab === "inventory" ? (
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => {
              console.log("SETOPEN");
              setInventory(inventory)
              setOpen(true)
            }}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
        </td>
      ) : (null)}

    </tr>
  );
};

export default InventoryDashboardTableRow;
