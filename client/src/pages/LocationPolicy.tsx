import styled from "@emotion/styled";
import { theme } from "styles/theme";

export const LocationPolicy = () => {
  return (
    <Container>
      <Title>위치기반서비스 이용약관</Title>
      <Content>
        <Section>
          <SectionTitle>제 1 조 (목적)</SectionTitle>
          <Text>
            본 약관은 주식회사 단골(이하 "회사"라 합니다)이 운영, 제공하는
            위치기반서비스(이하 "서비스")를 이용함에 있어 회사와 고객 및
            개인위치정보주체의 권리, 의무 및 책임사항에 따른 이용조건 및 절차 등
            기본적인 사항을 규정함을 목적으로 합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제 2 조 (이용약관의 효력 및 변경)</SectionTitle>
          <List>
            <ListItem>
              1. 본 약관은 서비스를 신청한 고객 또는 개인위치정보주체가 본
              약관에 동의하고 회사가 정한 소정의 절차에 따라 서비스의 회원으로
              등록함으로써 효력이 발생합니다.
            </ListItem>
            <ListItem>
              2. 신청자가 모바일 단말기, PC 등에서 약관의 "동의하기" 버튼을
              선택하였을 경우 본 약관의 내용을 모두 읽고 이를 충분히
              이해하였으며, 그 적용에 동의한 것으로 봅니다.
            </ListItem>
            <ListItem>
              3. 회사는 위치정보의 보호 및 이용 등에 관한 법률, 콘텐츠산업
              진흥법, 전자상거래 등에서의 소비자보호에 관한 법률, 소비자 기본법
              약관의 규제에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 본
              약관을 변경할 수 있습니다.
            </ListItem>
            <ListItem>
              4. 회사가 약관을 변경할 경우에는 변경된 약관과 사유, 적용일자를
              명시하여 그 적용일자 10일 전부터 적용일 이후 상당한 기간 동안
              공지만을 하고, 개정 내용이 회원에게 불리한 경우에는 그 적용일자
              30일 전부터 적용일 이후 상당한 기간 동안 각각 이를 서비스 내
              게시하거나 회원에게 전자적 형태(전자우편, SMS 등)로 약관 개정
              사실을 발송하여 고지합니다.
            </ListItem>
            <ListItem>
              5. 회사가 전항에 따라 회원에게 통지하면서 공지일로부터 적용일 7일
              후까지 거부의사를 표시하지 아니하면 개정 약관에 승인한 것으로
              간주합니다. 회원이 개정 약관에 동의하지 않을 경우 회원은
              이용계약을 해지할 수 있습니다.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제 3 조 (관계법령의 적용)</SectionTitle>
          <Text>
            본 약관은 신의성실의 원칙에 따라 공정하게 적용하며, 본 약관에
            명시되지 아니한 사항에 대하여는 관계법령 또는 상관례에 따릅니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>제 4 조 (개인위치정보 서비스의 내용)</SectionTitle>
          <List>
            <ListItem>
              1. "회사"는 서비스 제공을 위하여 "회원"의 개인위치정보를 이용할 수
              있으며, "회원"은 이용약관에 동의함으로써 이에 동의한 것으로
              간주합니다.
            </ListItem>
            <ListItem>
              2. "회사"는 위치정보사업자가 제공하는 위치정보를 전달받아 정보
              검색 요청 시 개인위치정보주체의 현 위치를 이용한 검색 및 추천
              결과를 제공합니다.
            </ListItem>
            <ListItem>3. 위치기반서비스의 이용요금은 무료입니다.</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제 5 조 (개인위치정보주체의 권리)</SectionTitle>
          <List>
            <ListItem>
              1. 개인위치정보주체는 개인위치정보 수집 범위 및 이용약관의 내용 중
              일부 또는 개인위치정보의 이용 및 제공 목적, 제공 받는 자의 범위 및
              위치기반서비스의 일부에 대하여 동의를 유보할 수 있습니다.
            </ListItem>
            <ListItem>
              2. 개인위치정보주체는 개인위치정보의 수집ㆍ이용ㆍ제공에 대한
              동의의 전부 또는 일부를 철회할 수 있습니다.
            </ListItem>
            <ListItem>
              3. 개인위치정보주체는 언제든지 개인위치정보의 수집ㆍ이용ㆍ제공의
              일시적인 중지를 요구할 수 있습니다. 이 경우 회사는 요구를 거절하지
              아니하며, 이를 위한 기술적 수단을 갖추고 있습니다.
            </ListItem>
            <ListItem>
              4. 개인위치정보주체는 "회사"에 대하여 아래 자료의 열람 또는 고지를
              요구할 수 있고, 당해 자료에 오류가 있는 경우에는 그 정정을 요구할
              수 있습니다. 이 경우 "회사"는 정당한 이유 없이 요구를 거절하지
              아니합니다.
              <SubList>
                <SubListItem>
                  개인위치정보 수집ㆍ이용ㆍ제공사실 확인자료
                </SubListItem>
                <SubListItem>
                  개인위치정보가 위치정보의 보호 및 이용 등에 관한 법률 또는
                  다른 법령의 규정에 의하여 제3자에게 제공된 이유 및 내용
                </SubListItem>
              </SubList>
            </ListItem>
            <ListItem>
              5. "회사"는 개인위치정보주체가 동의의 전부 또는 일부를 철회한
              경우에는 지체 없이 수집된 개인위치정보 및 위치정보
              수집ㆍ이용ㆍ제공사실 확인자료를 파기합니다. 단, 동의의 일부를
              철회하는 경우에는 철회하는 부분의 개인위치정보 및 위치정보
              수집ㆍ이용ㆍ제공사실 확인자료에 한합니다.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>
            제 6 조 (개인위치정보 서비스에 대한 법정대리인의 권리)
          </SectionTitle>
          <List>
            <ListItem>
              1. "회사"는 만 14세 미만 아동으로부터 개인위치정보를 수집ㆍ이용
              또는 제공하고자 하는 경우에는 만 14세 미만 아동과 그 법정대리인의
              동의를 받아야 합니다.
            </ListItem>
            <ListItem>
              2. 법정대리인은 만 14세 미만 아동의 개인위치정보
              수집ㆍ이용ㆍ제공에 동의하는 경우 동의유보권, 동의철회권 및
              일시중지권을 행사할 수 있습니다.
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>제 7 조 (위치정보관리 책임자의 지정)</SectionTitle>
          <Text>
            "회사"는 위치정보를 적절히 관리ㆍ보호하고 개인위치정보주체의 불만을
            원활히 처리할 수 있도록 실질적인 책임을 질 수 있는 자를
            위치정보관리책임자로 지정해 운영합니다.
          </Text>
        </Section>

        <Section>
          <SectionTitle>부칙</SectionTitle>
          <List>
            <ListItem>1. 본 약관은 2025년 1월 24일부터 시행합니다.</ListItem>
            <ListItem>
              2. 개인위치정보 책임자 및 관리자의 연락처는 다음과 같습니다:
              <SubList>
                <SubListItem>성명: 임채민</SubListItem>
                <SubListItem>이메일: wldnjscoals@gmail.com</SubListItem>
              </SubList>
            </ListItem>
          </List>
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

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${theme.colors.gray[8]};
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
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;

  &:before {
    content: "•";
    position: absolute;
    left: 0;
  }
`;

const SubList = styled.ul`
  list-style-type: none;
  margin: 0.5rem 0 0 1rem;
  padding: 0;
`;

const SubListItem = styled.li`
  font-size: 1rem;
  line-height: 1.6;
  color: ${theme.colors.gray[7]};
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;

  &:before {
    content: "-";
    position: absolute;
    left: 0;
  }
`;
