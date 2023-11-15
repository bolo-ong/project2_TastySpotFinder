import React, { FormEvent, ChangeEvent, useState } from "react";
import styled from "@emotion/styled";
import { Image } from "components";
import { theme } from "styles/theme";

export const SearchBar = ({ placeholder, ...rest }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    //inputValue.replace(/ /g, '') === '' 일 땐 submit안되게
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClick = () => {
    setInputValue("");
  };

  return (
    <Container {...rest}>
      <form>
        <InputContainer>
          <ImageWrapper position="left">
            <Image name="icon_search" extension="svg" height={16} />
          </ImageWrapper>
          <StyledInput
            value={inputValue}
            type="text"
            placeholder={placeholder}
            onSubmit={handleSubmit}
            onChange={handleChange}
          />
          {inputValue && (
            <ImageWrapper position="right" onClick={handleClick}>
              <ClearIconWrapper>
                <Image
                  name="icon_clear"
                  extension="svg"
                  height={16}
                  hoverable
                />
              </ClearIconWrapper>
            </ImageWrapper>
          )}
        </InputContainer>
      </form>
    </Container>
  );
};

interface Props {
  placeholder?: string;
}

const Container = styled.div`
  width: 35rem;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
`;

const StyledInput = styled.input`
  width: 100%;
  border-radius: 6.25rem;
  font-weight: 700;
  padding: 0.625rem 3rem;
  color: ${theme.colors.main[5]};
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
  border-radius: 6.25rem;
  background-color: #848c93;
`;
