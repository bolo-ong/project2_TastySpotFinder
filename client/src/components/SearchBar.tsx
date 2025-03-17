import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { Image } from "components";

interface Props {
  placeholder?: string;
  onSubmit?: (term: string) => void;
}

export const SearchBar = ({ placeholder, onSubmit, ...rest }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("search") || ""
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const filter = searchParams.get("filter");

    // 기존 filter쿼리를 유지하면서 search쿼리 적용
    filter && params.set("filter", filter);
    searchTerm ? params.set("search", searchTerm) : params.delete("search");
    setSearchParams(params, { preventScrollReset: true });

    // 메인페이지에서 검색 시 /board 페이지로 이동
    if (location.pathname === "/") {
      navigate(
        {
          pathname: "/board",
          search: `?search=${searchTerm}`,
        },
        { replace: true }
      );
    }
  };

  useEffect(() => {
    // URL의 search 파라미터가 변경될 때마다 검색어 상태 업데이트
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    // 새로고침이나 직접 URL 입력으로 페이지에 진입할 때만 초기화
    if (location.key === "default") {
      // 새로고침이나 직접 URL 입력으로 페이지에 진입할 때 초기화
      setSearchTerm("");
      params.delete("search");
      setSearchParams(params, { preventScrollReset: true });
    } else {
      // URL의 search 파라미터가 변경될 때마다 검색어 상태 업데이트
      setSearchTerm(searchParams.get("search") || "");
    }
  }, [location.pathname]);

  return (
    <Container {...rest}>
      <form onSubmit={handleFormSubmit}>
        <ImageWrapper position="left">
          <Image name="icon_search" extension="svg" height={16} />
        </ImageWrapper>
        <StyledInput
          value={searchTerm}
          type="text"
          placeholder={placeholder}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <ImageWrapper
            position="right"
            onClick={() => {
              setSearchTerm("");
              // x버튼 클릭 시 search 파라미터 제거
              const params = new URLSearchParams(searchParams);
              params.delete("search");
              setSearchParams(params, { preventScrollReset: true });
            }}
          >
            <ClearIconWrapper>
              <Image name="icon_clear" extension="svg" height={16} />
            </ClearIconWrapper>
          </ImageWrapper>
        )}
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: 35rem;
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  border-radius: 6.25rem;
  font-weight: 700;
  padding: 0.625rem 3rem;
  color: ${theme.colors.main[5]};
  background-color: ${theme.colors.pureWhite};
  outline: 0.0625rem solid ${theme.colors.gray[2]};

  ::placeholder {
    font-weight: 500;
    font-size: 0.875rem;
    color: ${theme.colors.gray[6]};
  }
  &:hover {
    outline: 0.0625rem solid ${theme.colors.main[4]};
  }
  &:focus {
    outline: 0.0625rem solid ${theme.colors.main[5]};
  }
`;

const ImageWrapper = styled.div<{ position?: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  bottom: 0;
  left: ${({ position }) => position === "left" && "1.25rem"};
  right: ${({ position }) => position === "right" && "1.25rem"};
`;

const ClearIconWrapper = styled.div`
  position: relative;
  padding: 0.25rem;
  border-radius: 50%;
  background-color: #848c93;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
  }
`;
