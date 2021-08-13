import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import { RectButtonProps } from 'react-native-gesture-handler';

import {
  Container,
  Title,
} from './styles';

interface Props extends RectButtonProps {
  title: string;
  color?: string;
  enabled?: boolean;
  loading?: boolean;
}

export function Button({
  title,
  color,
  enabled = true,
  loading = false,
  ...rest
}: Props) {
  const theme = useTheme();

  return (
    <Container
      enabled={enabled}
      loading={loading}
      color={color ? color : theme.colors.main}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.shape} />
      ) : (
        <Title>{title}</Title>
      )}
    </Container>
  );
}
