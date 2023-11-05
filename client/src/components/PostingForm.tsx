import React, {
  useRef,
  useEffect,
  useState,
  ChangeEvent,
  FocusEvent,
  FormEvent,
} from "react";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { Input, Button } from ".";

export const PostingForm = () => {
  const [values, setValues] = useState<Record<string, string>>({
    link: "",
    title: "",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState<Record<string, string>>({
    link: "",
    title: "",
    description: "",
  });

  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => {
      return { ...prev, [name]: value };
    });
    switch (name) {
      case "link":
        const regex1 = /^https:\/\/naver\.me\/[a-zA-Z0-9]/;
        const regex2 = /^https:\/\/map\.naver\.com\/p\/[a-zA-Z0-9]/;

        if (
          !regex1.test(value.trim()) &&
          !regex2.test(value.trim()) &&
          value.trim()
        ) {
          setErrorMessage((prev) => {
            return { ...prev, [name]: "올바른 양식이 아닙니다." };
          });
        } else {
          setErrorMessage((prev) => {
            return { ...prev, [name]: "" };
          });
        }
        break;
      case "title":
        break;
      case "description":
        break;
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!value.trim()) {
      setErrorMessage((prev) => {
        return { ...prev, [name]: "필수 입력값 입니다." };
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!values.link.trim()) {
      setErrorMessage((prev) => {
        return { ...prev, link: "필수 입력값 입니다." };
      });
    }
    if (!values.title.trim()) {
      setErrorMessage((prev) => {
        return { ...prev, title: "필수 입력값 입니다." };
      });
    }

    //todo - 서버에 post요청
  };

  return (
    <StyledForm onSubmit={handleSubmit} noValidate>
      <div>
        <Title>맛집 공유하기</Title>
        <SubTitle>나만 알고 있는 단골집을 공유해보세요</SubTitle>
      </div>
      <Input
        label="맛집 리스트 링크"
        type="text"
        name="link"
        value={values.link}
        placeholder="네이버 맛집 리스트 링크를 첨부해 주세요"
        onChange={handleChange}
        onBlur={handleBlur}
        errorMessage={errorMessage.link}
        ref={ref}
        required
      />
      <Input
        label="리스트 이름"
        type="text"
        name="title"
        value={values.title}
        maxLength={30}
        placeholder="맛집 리스트의 제목을 입력해 주세요"
        onChange={handleChange}
        onBlur={handleBlur}
        errorMessage={errorMessage.title}
        required
      />
      <Input
        label="간단한 설명"
        type="text"
        name="description"
        value={values.description}
        maxLength={30}
        placeholder="나만의 리스트를 소개해 주세요"
        onChange={handleChange}
        onBlur={handleBlur}
        errorMessage={errorMessage.description}
      />
      <Button wide type="submit">
        맛집 공유하기
      </Button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.375rem;

  > *:first-child {
    margin-bottom: 2.375rem;
  }
  > *:last-child {
    margin-top: 2.375rem;
  }
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  height: 4rem;
  padding: 0.25rem 0;
`;

const SubTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.gray[7]};
`;
