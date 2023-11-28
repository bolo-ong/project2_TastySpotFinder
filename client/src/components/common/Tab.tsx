import styled from "@emotion/styled";
import { theme } from "styles/theme";

export interface Props {
  items: { title: string }[];
  selectedTab: string;
  onClick: (title: string) => void;
}

export const Tab = ({ items, selectedTab, onClick, ...rest }: Props) => {
  return (
    <StyledTab>
      {items.map((item) => (
        <TabItem
          key={item.title}
          onClick={() => onClick(item.title)}
          selected={selectedTab === item.title}
        >
          {item.title}
        </TabItem>
      ))}
    </StyledTab>
  );
};

const TabItem = styled.li<{ selected: boolean }>`
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
    border-top: 1px solid ${theme.colors.gray[0]};
    border-bottom: 1px solid ${theme.colors.main[5]};
    `}
`;

const StyledTab = styled.ul`
  display: flex;
  flex-direction: row;
`;
