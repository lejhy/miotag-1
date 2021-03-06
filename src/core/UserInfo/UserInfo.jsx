// @flow

import React from 'react';
import styled from 'styled-components';

import useUser from '@hooks/useUser';
import { BACKGROUND_WHITE } from '@styles/colors';
import DefaultImage from '@assets/img/default-img.svg';
import { Text } from '@core';

const Container = styled.View`
  background-color: ${({ theme }) => theme.colors[BACKGROUND_WHITE]};
  flex-direction: row;
`;

const ImageContainer = styled.View`
  height: 75px;
  width: 75px;
  border-radius: 37.5px;
  margin: 10px;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: flex-end;
  padding-right: 10%;
`;

type Props = {
  fullName?: String,
};

export default function UserInfo({ fullName }: Props) {
  const [, { getFullName }] = useUser();

  return (
    <Container>
      <ImageContainer>
        <DefaultImage width="90%" height="90%" />
      </ImageContainer>
      <ContentContainer>
        <Text size="large">{ fullName === undefined ? getFullName() : fullName }</Text>
      </ContentContainer>
    </Container>
  );
}

UserInfo.defaultProps = {
  fullName: undefined,
};
