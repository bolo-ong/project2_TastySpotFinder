import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { TabItem } from "types";

export interface Props {
  items: TabItem[];
  selectedTab?: string;
  onClick: (tabItem: TabItem) => void;
}

export const Tabs = ({ items, selectedTab, onClick, ...rest }: Props) => {
  return (
    <StyledTab {...rest}>
      {items.map((item) => (
        <StyledTabItem
          key={item.title}
          onClick={() => onClick(item)}
          selected={selectedTab === item.title}
        >
          {item.title}
        </StyledTabItem>
      ))}
    </StyledTab>
  );
};

const StyledTabItem = styled.li<{ selected: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  font-weight: 600;
  height: 3.25rem;

  ${({ selected }) =>
    selected &&
    `
    color:  ${theme.colors.main[5]};
    border-top: 1px solid transparent;
    border-bottom: 1px solid ${theme.colors.main[5]};
    cursor: default;
    `}
`;

const StyledTab = styled.ul`
  display: flex;
  flex-direction: row;
`;
