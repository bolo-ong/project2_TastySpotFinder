import React, {
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { useToast } from "hooks";
import { useNavigate } from "react-router-dom";
import { Input, Button, Text } from "components";
import { postRestaurantList, crawlRestaurant } from "apis/restaurantAPI";
import { validateLink, validateRequired, validateErrorMessage } from "utils";

export const PostingForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
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
          [name]: validateRequired(value),
        }));
        break;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    //필수값인 link와 title체크
    setErrorMessage((prev) => ({
      ...prev,
      link: validateLink(values.link),
      title: validateRequired(values.title),
    }));

    //validateErrorMessage 함수를 이용해서 에러메세지가 존재하는지 확인
    if (validateErrorMessage(errorMessage)) {
      try {
        const data = {
          title: values.title,
          description: values.description,
        };

        const postRestaurantListId = await postRestaurantList(data);
        postRestaurantListId && setIsLoading(true);

        // 게시물 등록 요청 결과에 따라 메시지 출력
        postRestaurantListId
          ? showToast("게시물 등록 요청이 정상 처리되었습니다.", "info")
          : showToast("게시물 등록 요청에 오류가 발생했습니다.", "warning");

        navigate(-1);

        const crawlComplete =
          postRestaurantListId &&
          (await crawlRestaurant(values.link, postRestaurantListId));

        // 게시물 등록 결과에 따라 메시지 출력
        crawlComplete
          ? showToast("게시물 등록이 완료되었습니다.", "success")
          : showToast("게시물 등록에 실패하였습니다.", "warning");
      } catch (err) {
        console.error(err);
      }
    }
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
          errorMessage={errorMessage.link}
          ref={ref}
          required
        />
        <Input
          label="리스트 이름"
          type="text"
          name="title"
          value={values.title}
          placeholder="맛집 리스트의 제목을 입력해 주세요"
          onChange={handleChange}
          errorMessage={errorMessage.title}
          required
        />
        <Input
          label="간단한 설명"
          type="text"
          name="description"
          value={values.description}
          placeholder="나만의 리스트를 소개해 주세요"
          onChange={handleChange}
          errorMessage={errorMessage.description}
        />
        {isLoading ? (
          <Button wide disabled>
            잠시만 기다려 주세요
          </Button>
        ) : (
          <Button wide type="submit">
            맛집 공유하기
          </Button>
        )}
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
