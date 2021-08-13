import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';

import ArrowSvg from '../../assets/arrow.svg';

import { getPlatformDate } from '../../utils/getPlatformDate';
import { RootStackParamList } from '../../routes/stack.routes';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import {
  Calendar,
  DayProps,
  generateInterval,
  MarkedDateProps,
} from '../../components/Calendar';

import {
  Container,
  Header,
  Title,
  RentalPeriod,
  DateInfo,
  DateTitle,
  DateValueWrapper,
  DateValue,
  Content,
  Footer,
} from './styles';

type SchedulingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Scheduling'
>;

type SchedulingScreenRouteProp = RouteProp<RootStackParamList, 'Scheduling'>;

interface IRentalPeriod {
  startFormatted: string;
  endFormatted: string;
}

export function Scheduling() {
  const theme = useTheme();
  const navigation = useNavigation<SchedulingScreenNavigationProp>();
  const route = useRoute<SchedulingScreenRouteProp>();
  const { car } = route.params;

  const [lastSelectedDate, setLastSelectedDate] = useState<DayProps>({} as DayProps);
  const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
  const [rentalPeriod, setRentalPeriod] = useState<IRentalPeriod>({} as IRentalPeriod);

  function handleConfirmRental() {
    navigation.navigate('SchedulingDetails', {
      car,
      dates: Object.keys(markedDates),
    });
  }

  function handleBack() {
    navigation.goBack();
  }

  function handleDateChange(date: DayProps) {
    let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
    let end = date;

    if (start.timestamp > end.timestamp) {
      start = end;
      end = start;
    }

    setLastSelectedDate(end);
    const interval = generateInterval(start, end);
    setMarkedDates(interval);

    const firstDate = Object.keys(interval)[0];
    const endDate = Object.keys(interval)[Object.keys(interval).length - 1];

    setRentalPeriod({
      startFormatted: format(getPlatformDate(new Date(firstDate)), 'dd/MM/yyyy'),
      endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
    });
  }

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header>
        <BackButton
          color={theme.colors.shape}
          onPress={handleBack}
        />

        <Title>
          Escolha uma {'\n'}
          data de início e {'\n'}
          fim do aluguel
        </Title>

        <RentalPeriod>
          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValueWrapper selected={!!rentalPeriod.startFormatted}>
              <DateValue>{rentalPeriod.startFormatted}</DateValue>
            </DateValueWrapper>
          </DateInfo>

          <ArrowSvg />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValueWrapper selected={!!rentalPeriod.endFormatted}>
              <DateValue>{rentalPeriod.endFormatted}</DateValue>
            </DateValueWrapper>
          </DateInfo>
        </RentalPeriod>
      </Header>

      <Content>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDateChange}
        />
      </Content>

      <Footer>
        <Button
          title="Confirmar"
          onPress={handleConfirmRental}
          enabled={!!rentalPeriod.endFormatted}
        />
      </Footer>
    </Container>
  );
}
