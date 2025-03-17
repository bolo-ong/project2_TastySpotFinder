import styled from "@emotion/styled";
import { theme } from "styles/theme";

export const PrivacyPolicy = () => {
  return (
    <Container>
      <Title>개인정보 처리방침</Title>
      <Intro>
        '단골' (이하 "본 앱")은 사용자의 개인정보 보호를 매우 중요하게 생각하며,
        본 개인정보 처리방침을 통해 어떤 정보를 수집하고, 어떻게 사용하는지,
        그리고 이를 어떻게 보호하는지에 대해 설명드립니다.
      </Intro>
      <Content>
        <Section>
          <SectionTitle>1. 수집하는 개인정보 항목</SectionTitle>
          <Text>
            본 앱은 소셜 로그인 서비스를 제공하며, 이를 위해 아래와 같은
            개인정보를 수집합니다.
          </Text>
          <SubSection>
            <SubTitle>필수 항목:</SubTitle>
            <List>
              <ListItem>이름 또는 닉네임</ListItem>
              <ListItem>프로필 이미지</ListItem>
            </List>
          </SubSection>
        </Section>

        <Section>
          <SectionTitle>2. 개인정보 수집 방법</SectionTitle>
          <Text>
            본 앱은 소셜 로그인 과정을 통해 사용자의 개인정보를 수집합니다.
          </Text>
          <List>
            <ListItem>소셜 로그인 시</ListItem>
            <ListItem>
              사용자가 소셜 로그인 계정을 연결할 때 제공되는 정보
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. 개인정보의 이용 목적</SectionTitle>
          <Text>
            본 앱은 수집한 개인정보를 다음과 같은 목적을 위해 사용합니다.
          </Text>
          <List>
            <ListItem>사용자 인증 및 회원 관리</ListItem>
            <ListItem>개인화된 서비스 제공</ListItem>
            <ListItem>서비스 개선 및 사용자 경험 향상</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. 개인정보의 보유 및 이용 기간</SectionTitle>
          <Text>
            본 앱은 사용자의 개인정보를 수집 목적을 달성하는 데 필요한 기간
            동안만 보유합니다. 사용자가 서비스 탈퇴를 요청하거나 회원 탈퇴 시
            수집된 개인정보는 즉시 삭제됩니다.
          </Text>
          <Text>
            다만, 관련 법령에 따라 보관이 필요한 경우에는 해당 기간 동안
            보관합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>5. 개인정보의 제3자 제공</SectionTitle>
          <Text>
            본 앱은 원칙적으로 사용자의 개인정보를 제3자에게 제공하지 않습니다.
            단, 다음의 경우에는 예외적으로 개인정보를 제공할 수 있습니다.
          </Text>
          <List>
            <ListItem>사용자의 별도 동의가 있는 경우</ListItem>
            <ListItem>법적 요구가 있는 경우 (예: 수사기관의 요청)</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. 개인정보의 안전성 확보 조치</SectionTitle>
          <Text>
            본 앱은 사용자의 개인정보를 보호하기 위해 다음과 같은 조치를
            취합니다.
          </Text>
          <List>
            <ListItem>개인정보 전송 시 암호화 적용</ListItem>
            <ListItem>접근 권한 관리 및 제한</ListItem>
            <ListItem>최신 보안 프로그램을 통한 개인정보 보호</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>7. 개인정보의 열람, 수정, 삭제</SectionTitle>
          <Text>
            사용자는 언제든지 본 앱에 제공한 개인정보를 열람하거나 수정할 수
            있습니다. 또한, 개인정보 삭제를 요청할 수 있으며, 삭제 요청 시 관련
            법령에 따라 일정 기간 보관 후 완전히 삭제됩니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>8. 개인정보 보호책임자</SectionTitle>
          <Text>
            본 앱은 개인정보 보호와 관련된 업무를 담당하는 개인정보 보호책임자를
            지정하고 있습니다.
          </Text>
          <List>
            <ListItem>개인정보 보호책임자: 임채민</ListItem>
            <ListItem>이메일: wldnjscoals@gmail.com</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>9. 개인정보 처리방침의 변경</SectionTitle>
          <Text>
            본 앱은 개인정보 처리방침을 변경할 수 있으며, 변경된 내용은 앱 내
            공지사항 또는 이메일을 통해 사용자에게 알립니다. 변경된 내용은
            공지된 날로부터 효력이 발생합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>10. 기타</SectionTitle>
          <Text>
            본 앱은 사용자의 개인정보를 보호하기 위해 최선을 다하며, 관련 법령을
            준수합니다. 개인정보 처리방침에 대한 문의나 요청은 언제든지 개인정보
            보호책임자에게 연락 주시기 바랍니다.
          </Text>
        </Section>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.gray[9]};
  margin-bottom: 2rem;
  text-align: center;
`;

const Intro = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${theme.colors.gray[7]};
  margin-bottom: 2rem;
  white-space: pre-wrap;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubSection = styled.div`
  margin-left: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.gray[8]};
`;

const SubTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.gray[7]};
  margin-bottom: 0.5rem;
`;

const Text = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${theme.colors.gray[7]};
  white-space: pre-wrap;
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  font-size: 1rem;
  line-height: 1.6;
  color: ${theme.colors.gray[7]};
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;

  &:before {
    content: "•";
    position: absolute;
    left: 0;
  }
`;
