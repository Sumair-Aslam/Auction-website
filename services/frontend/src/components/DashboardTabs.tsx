import Tab from './Tab';
import Tabs from './Tabs';

const DashboardTabs = () => {
  return (
    <Tabs>
      <Tab link="/dashboard/listings" name="All Listings" />
      <Tab link="/dashboard/sold" name="Sold Listings" />
      <Tab link="/dashboard/expired" name="Expired Listings" />
      <Tab link="/dashboard/bids" name="Your Bids" />
      <Tab link="/dashboard/inventory" name="Inventory" />
    </Tabs>
  );
};

export default DashboardTabs;
