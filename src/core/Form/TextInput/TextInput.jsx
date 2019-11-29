// @flow

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import type { ThemeProps } from 'styled-components';

import { PRIMARY as PRIMARY_FONT, REGULAR as REGULAR_SIZE } from '@styles/fonts';
import { PRIMARY as PRIMARY_COLOR, GRAY } from '@styles/colors';
import { Text } from '@core';

const Container = styled.View`
  ${({ mt }) => mt && css`
    margin-top: ${mt};
  `}
`;

const StyledTextInput = styled.TextInput`
  font-family: ${({ theme }) => theme.fonts[PRIMARY_FONT]};
  font-size: ${({ theme }) => theme.fonts.size[REGULAR_SIZE]};
  color: ${({ theme, isFocused }) => (isFocused ? theme.colors[PRIMARY_COLOR] : theme.colors[GRAY])};
  border: 1px solid ${({ theme, isFocused }) => (isFocused ? theme.colors[PRIMARY_COLOR] : theme.colors[GRAY])};
  border-radius: 7px;
  height: 45px;
  padding-left: 12px;
`;

type Props = {
  value: string,
  onChange: (text) => void,
  label: string,
  mt?: string,
  theme: ThemeProps,
};

export default function TextInput({
  value, onChange, label, mt, theme, ...rest
}: Props) {
  const [isFocused, setFocus] = useState(false);

  const setFocused = () => setFocus(true);
  const setBlur = () => setFocus(false);

  return (
    <Container mt={mt}>
      <Text color="primary" bold mb="3px" ml="5px">{ label }</Text>
      <StyledTextInput
        value={value}
        onChangeText={onChange}
        placeholderTextColor={theme.colors[GRAY]}
        isFocused={isFocused}
        onFocus={setFocused}
        onBlur={setBlur}
        {...rest} // eslint-disable-line
      />
    </Container>
  );
}

TextInput.defaultProps = {
  mt: null,
};