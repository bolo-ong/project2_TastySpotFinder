import React, { ChangeEvent, FocusEvent, KeyboardEvent } from "react";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { ReactComponent as RequireMarker } from "assets/images/icon_required_marker.svg";

export interface Props {
  label?: string;
  type?: string;
  name?: string;
  value?: string;
  maxLength?: number;
  placeholder?: string;
  errorMessage?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const TextFieldComponent = (
  {
    label,
    type = "text",
    name,
    value,
    maxLength,
    placeholder,
    onChange,
    onBlur,
    errorMessage,
    required,
    ...rest
  }: Props,
  ref: React.Ref<HTMLInputElement>
) => {
  return (
    <Container>
      {label && (
        <StyledLabel>
          {label}
          {required && <RequireMarker width={"0.125rem"} height={"0.125rem"} />}
        </StyledLabel>
      )}
      <StyledInput
        type={type}
        name={name}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={required ? onBlur : undefined}
        ref={ref}
        className={errorMessage ? "invalid" : ""}
        required={required}
        {...rest}
      />
      <ErrorText>{errorMessage}</ErrorText>
    </Container>
  );
};

const ForwardedTextField = React.forwardRef(TextFieldComponent);

export const TextField = React.memo(ForwardedTextField);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
`;

const StyledInput = styled.input<Props>`
  width: 100%;
  min-height: 3rem;
  font-size: 0.875rem;
  line-height: 1.125rem;
  border-radius: 0.75rem;
  padding: 0 1.125rem;
  outline: 0.0625rem solid ${theme.colors.gray[0]};

  ::placeholder {
    font-size: 0.875rem;
    line-height: 1.125rem;
    color: ${theme.colors.gray[6]};
  }
  &:hover {
    outline: 0.0625rem solid ${theme.colors.main[4]};
  }
  &:focus {
    outline: 0.0625rem solid ${theme.colors.main[5]};
  }
  &.invalid {
    outline: 0.0625rem solid ${theme.colors.warning[6]};
  }
`;

const StyledLabel = styled.label`
  display: flex;
  font-size: 0.875rem;
  min-height: 0.875rem;
  font-weight: 500;
  gap: 0.25rem;
`;

const ErrorText = styled.p`
  font-size: 0.75rem;
  min-height: 0.75rem;
  color: ${theme.colors.warning[6]};
`;
