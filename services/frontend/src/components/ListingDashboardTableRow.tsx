import Link from 'next/link';

import { centsToDollars } from '../utils/cents-to-dollars';
import Countdown from './Countdown';

const ListingDashboardTableRow = ({ index, listing, onDelete, tab, setOpen, setListing }) => {
  return (
    <tr key={index}>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link href={`/listings/${listing.slug}`}>
          <a className="hover:underline text-sm text-gray-900">
            {listing.title}
          </a>
        </Link>
        <div className="text-sm text-gray-500">
          Time Left: <Countdown expiresAt={listing.expiresAt} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(listing.createdAt).toLocaleDateString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {centsToDollars(listing.currentPrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {centsToDollars(listing.fixPrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {centsToDollars(listing.startPrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {listing.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {listing.location}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <a href={listing.labReportUrl} target="_blank" download >
          <img src="/images/download.svg"></img>
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <a href={listing.sopDocumentUrl} target="_blank" download >
          <img src="/images/download.svg"></img>
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {listing.status}
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
              setListing(listing)
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

export default ListingDashboardTableRow;
