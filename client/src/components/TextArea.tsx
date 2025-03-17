import React, { ChangeEvent } from "react";
import styled from "@emotion/styled";
import { useAutoResizeTextArea } from "hooks/useAutoResizeTextArea";
import { theme } from "styles/theme";
import { ReactComponent as RequireMarker } from "assets/images/icon_required_marker.svg";

export interface Props {
  label?: string;
  placeholder?: string;
  maxLength?: number;
  name?: string;
  value?: string;
  hasBorder?: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

const TextAreaComponent = ({
  label,
  placeholder,
  maxLength,
  name,
  value,
  hasBorder,
  onChange,
  required,
}: Props) => {
  const textAreaRef = useAutoResizeTextArea(value);
  return (
    <Container>
      {label && (
        <StyledLabel>
          {label}
          {required && <RequireMarker width={"0.125rem"} height={"0.125rem"} />}
        </StyledLabel>
      )}
      <StyledTextArea
        ref={textAreaRef}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        name={name}
        hasBorder={hasBorder}
        onChange={onChange}
      />
    </Container>
  );
};

export const TextArea = React.memo(TextAreaComponent);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
`;

const StyledLabel = styled.label`
  display: flex;
  font-size: 0.875rem;
  min-height: 0.875rem;
  font-weight: 500;
  gap: 0.25rem;
`;

const StyledTextArea = styled.textarea<{ hasBorder?: boolean }>`
  font-size: 0.875rem;
  line-height: 1.125rem;
  overflow-wrap: break-word;
  word-break: keep-all;
  width: 100%;
  resize: none;
  outline: none;
  max-height: 12.5rem;

  ::placeholder {
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: ${theme.colors.gray[6]};
  }

  ${({ hasBorder }) =>
    hasBorder &&
    `
    min-height: 12.5rem;
    padding: 1rem 1.125rem;
    border-radius: 0.75rem;

    outline: 0.0625rem solid ${theme.colors.gray[0]};
    &:hover {
      outline: 0.0625rem solid ${theme.colors.main[4]};
    }
    &:focus {
      outline: 0.0625rem solid ${theme.colors.main[5]};
    }
    &.invalid {
      outline: 0.0625rem solid ${theme.colors.warning[6]};
    }

    ::placeholder {
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: ${theme.colors.gray[6]};
  }
  `}
`;
