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
import { Input, Button, Text } from "components";
import { validateLink, validateTitle } from "constants/index";

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

    setValues((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "link":
        setErrorMessage((prev) => ({ ...prev, [name]: validateLink(value) }));
        break;
      case "title":
        setErrorMessage((prev) => ({
          ...prev,
          [name]: validateTitle(value),
        }));
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

    ["link", "title"].forEach((name) => {
      if (!values[name].trim()) {
        setErrorMessage((prev) => {
          return { ...prev, [name]: "필수 입력값 입니다." };
        });
      }
    });

    //todo - 서버에 post요청
  };

  return (
    <>
      <TitleWrapper>
        <Text size={24} weight={600}>
          맛집 공유하기
        </Text>
      </TitleWrapper>
      <Text size={14} weight={500} color={`${theme.colors.gray[7]}`}>
        나만 알고 있는 단골집을 공유해보세요
      </Text>

      <StyledForm onSubmit={handleSubmit} noValidate>
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
    </>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.375rem;
  margin-top: 3.75rem;

  > *:last-child {
    margin-top: 2.375rem;
  }
`;

const TitleWrapper = styled.div`
  height: 4rem;
  display: flex;
  align-items: center;
`;
