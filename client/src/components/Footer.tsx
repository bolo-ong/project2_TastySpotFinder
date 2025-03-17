import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { theme } from "styles/theme";

export const Footer = () => {
  return (
    <StyledFooter>
      <FooterContent>
        <PolicyLinks>
          <StyledLink to="/privacy-policy">개인정보 처리방침</StyledLink>
          <Divider>|</Divider>
          <StyledLink to="/location-policy">위치정보 이용약관</StyledLink>
        </PolicyLinks>
        <Copyright>© 2024 단골. All rights reserved.</Copyright>
      </FooterContent>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  width: 100%;
  padding: 2rem 0;
  background-color: ${theme.colors.main[5]};
`;

const FooterContent = styled.div`
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const PolicyLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  color: ${theme.colors.main[0]};
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s ease;

  &:hover {
    text-decoration: underline;
    color: ${theme.colors.white};
    text-decoration: none;
  }
`;

const Divider = styled.span`
  color: ${theme.colors.main[3]};
  font-size: 0.875rem;
`;

const Copyright = styled.p`
  color: ${theme.colors.main[2]};
  font-size: 0.75rem;
  margin: 0;
`;
