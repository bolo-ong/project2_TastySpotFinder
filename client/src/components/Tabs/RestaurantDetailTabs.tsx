import { Tabs } from "components";
import { TabItem } from "types";
import { useState } from "react";

export interface Props {
  onClick: (tab: "등록순" | "최신순") => void;
}

const tabItems: TabItem[] = [{ title: "등록순" }, { title: "최신순" }];

export const RestaurantDetailTabs = ({ onClick }: Props) => {
  const [selectedTabItem, setSelectedTabItem] = useState<TabItem>(tabItems[0]);

  const handleTabClick = (tabItem: TabItem) => {
    if (tabItem === selectedTabItem) return;
    setSelectedTabItem(tabItem);
    onClick(tabItem.title as "등록순" | "최신순");
  };

  return (
    <Tabs
      items={tabItems}
      selectedTab={selectedTabItem?.title}
      onClick={handleTabClick}
    />
  );
};
