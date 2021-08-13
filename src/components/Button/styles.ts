import styled, { css } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

interface ButtonProps extends RectButtonProps {
  color: string;
  enabled?: boolean;
  loading?: boolean;
}

export const Container = styled(RectButton)<ButtonProps>`
  width: 100%;

  padding: 19px;
  justify-content: center;
  align-items: center;

  background-color: ${({ color }) => color};

  ${({ enabled, loading }) => (!enabled || loading) ?
    css`
      opacity: .5;
    ` :
    css `
      opacity: 1;
    `};
`;

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.primary_500};
  font-size: ${RFValue(15)}px;
  color: ${({ theme }) => theme.colors.shape};
`;
