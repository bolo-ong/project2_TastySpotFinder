import React, { ChangeEvent, FocusEvent } from "react";
import styled from "@emotion/styled";
import { theme } from "styles/theme";
import { ReactComponent as RequireMarker } from "assets/images/icon_required_marker.svg";

export const Input = React.forwardRef<HTMLInputElement, Props>(
  (
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
    },
    ref
  ) => {
    return (
      <InputWrapper>
        {label && (
          <StyledLabel>
            {label}
            {required && (
              <RequireMarker width={"0.125rem"} height={"0.125rem"} />
            )}
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
          className={errorMessage && "invalid"}
          required={required}
          {...rest}
        />
        <ErrorText>{errorMessage}</ErrorText>
      </InputWrapper>
    );
  }
);

export interface Props {
  label?: string;
  type?: string;
  name?: string;
  value?: string;
  maxLength?: number;
  placeholder?: string;
  errorMessage?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
  required?: boolean;
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
`;

const StyledInput = styled.input<Props>`
  width: 100%;
  height: 3rem;
  text-align: left;
  font-size: 0.875rem;
  padding: 0 1.125rem;
  border-radius: 0.75rem;
  outline: 0.0625rem solid ${theme.colors.gray[0]};
  ::placeholder {
    font-size: 0.875rem;
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
