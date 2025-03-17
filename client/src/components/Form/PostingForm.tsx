import React, {
  useRef,
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  useCallback,
  KeyboardEvent,
} from "react";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { useToast } from "hooks";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Text, TextArea, Image } from "components";
import { validateLink, validateRequired, convertUtcToKst } from "utils";
import { postRestaurantList, crawlRestaurant } from "apis/restaurantAPI";

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
  const isError = validateLink(values.link) || validateRequired(values.title);

  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    },
    []
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    //필수값인 link와 title체크
    setErrorMessage((prev) => ({
      ...prev,
      link: validateLink(values.link),
      title: validateRequired(values.title),
    }));

    if (!isError) {
      setIsLoading(true);
      try {
        const data = {
          link: values.link,
          title: values.title,
          description: values.description,
        };

        const resData = await postRestaurantList(data);

        // 유저가 정지상태일때
        if (resData.message === "현재 정지 상태입니다.") {
          showToast(
            `${convertUtcToKst(resData.banLiftAt)}까지 정지 상태입니다.`,
            "warning"
          );
          navigate("/");
          return;
        }

        // 게시물 등록 요청 결과에 따라 메시지 출력
        resData
          ? showToast("요청이 정상 처리되었습니다.", "info")
          : showToast("요청에 오류가 발생했습니다.", "warning");

        navigate("/");

        const crawlComplete =
          resData && (await crawlRestaurant(values.link, resData));

        // 게시물 등록 결과에 따라 메시지 출력
        crawlComplete
          ? showToast("게시물 등록이 완료되었습니다.", "success")
          : showToast("게시물 등록에 실패하였습니다.", "warning");

        setIsLoading(false);
      } catch (err: any) {
        const errMessage = err.response.data;
        showToast(errMessage, "warning");
        setIsLoading(false);
      }
    }
  };

  // const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //   }
  // };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      const form = target.form as HTMLFormElement;
      const index = Array.prototype.indexOf.call(form, target);
      const nextElement = form.elements[index + 1] as HTMLElement;
      if (nextElement) {
        nextElement.focus();
      }
    }
  };

  const handleArrowIconClick = () => {
    window.history.back();
  };

  return (
    <Container>
      <ImageWrapper>
        <Image
          name="icon_arrow_left"
          extension="svg"
          width={32}
          height={32}
          hoverable
          onClick={handleArrowIconClick}
        />
      </ImageWrapper>
      <TitleWrapper>
        <Text size={24} weight={600}>
          맛집 공유하기
        </Text>
      </TitleWrapper>
      <Text size={14} weight={500} color={theme.colors.gray[7]}>
        나만 알고 있는 단골집을 공유해보세요
      </Text>

      <StyledForm noValidate onSubmit={handleSubmit}>
        <TextField
          label="맛집 리스트 링크"
          type="text"
          name="link"
          value={values.link}
          placeholder="네이버 맛집 리스트 링크를 첨부해 주세요"
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          errorMessage={errorMessage.link}
          ref={ref}
          required
        />
        <TextField
          label="리스트 이름"
          type="text"
          name="title"
          value={values.title}
          placeholder="맛집 리스트의 제목을 입력해 주세요"
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          errorMessage={errorMessage.title}
          maxLength={30}
          required
        />
        <TextArea
          label="간단한 설명"
          name="description"
          value={values.description}
          placeholder="나만의 리스트를 소개해 주세요"
          hasBorder
          onChange={handleChange}
          // errorMessage={errorMessage.description}
          maxLength={300}
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
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  min-width: 20rem;
  padding: 2.5rem 1.25rem;
  box-shadow: 0px 2px 10px rgba(63, 71, 77, 0.25);
`;

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

const ImageWrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 0.75rem;
`;
