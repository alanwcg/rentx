import React, { useState, useEffect } from 'react';
import { Alert, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';

import { api } from '../../services/api';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { RootStackParamList } from '../../routes/stack.routes';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';
import { Button } from '../../components/Button';

import {
  Container,
  Header,
  CarImages,
  Content,
  Details,
  Description,
  Brand,
  Name,
  Rent,
  Period,
  Price,
  Accessories,
  RentalPeriod,
  CalendarIcon,
  DateInfo,
  DateTitle,
  DateValue,
  RentalPrice,
  RentalPriceLabel,
  RentalPriceDetails,
  RentalPriceQuota,
  RentalPriceTotal,
  Footer,
} from './styles';

type SchedulingDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SchedulingDetails'
>;

type SchedulingDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'SchedulingDetails'
>;

interface IRentalPeriod {
  start: string;
  end: string;
}

export function SchedulingDetails() {
  const theme = useTheme();
  const navigation = useNavigation<SchedulingDetailsScreenNavigationProp>();
  const route = useRoute<SchedulingDetailsScreenRouteProp>();
  const { car, dates } = route.params;

  const rentTotal = Number(dates.length * car.rent.price);

  const [loading, setLoading] = useState(false);
  const [rentalPeriod, setRentalPeriod] = useState<IRentalPeriod>({} as IRentalPeriod);

  async function handleConfirmRental() {
    setLoading(true);

    const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);

    const unavailable_dates = [
      ...schedulesByCar.data.unavailable_dates,
      ...dates,
    ];

    try {
      await api.post('/schedules_byuser', {
        user_id: 1,
        car,
        start_date: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
        end_date: format(getPlatformDate(
          new Date(dates[dates.length - 1])),
          'dd/MM/yyyy'
        ),
      });

      await api.put(`/schedules_bycars/${car.id}`, {
        id: car.id,
        unavailable_dates,
      });
    } catch (error) {
      Alert.alert('Não foi possível confirmar o agendamento.');
      setLoading(false);
    } finally {
      navigation.navigate('SchedulingComplete');
    }
  }

  function handleBack() {
    navigation.goBack();
  }

  useEffect(() => {
    setRentalPeriod({
      start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
      end: format(getPlatformDate(
        new Date(dates[dates.length - 1])),
        'dd/MM/yyyy'
      ),
    })
  }, []);

  return (
    <Container>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <Header>
        <BackButton onPress={handleBack} />
      </Header>

      <CarImages>
        <ImageSlider
          imagesUrl={car.photos}
        />
      </CarImages>

      <Content>
        <Details>
          <Description>
            <Brand>{car.brand}</Brand>
            <Name>{car.name}</Name>
          </Description>

          <Rent>
            <Period>{car.rent.period}</Period>
            <Price>R$ {car.rent.price}</Price>
          </Rent>
        </Details>

        <Accessories>
          {car.accessories.map(accessory => (
            <Accessory
              key={accessory.type}
              name={accessory.name}
              icon={getAccessoryIcon(accessory.type)}
            />
          ))}
        </Accessories>

        <RentalPeriod>
          <CalendarIcon>
            <Feather
              name="calendar"
              size={RFValue(24)}
              color={theme.colors.shape}
            />
          </CalendarIcon>

          <DateInfo>
            <DateTitle>DE</DateTitle>
            <DateValue>{rentalPeriod.start}</DateValue>
          </DateInfo>

          <Feather
            name="chevron-right"
            size={RFValue(10)}
            color={theme.colors.text}
          />

          <DateInfo>
            <DateTitle>ATÉ</DateTitle>
            <DateValue>{rentalPeriod.end}</DateValue>
          </DateInfo>
        </RentalPeriod>

        <RentalPrice>
          <RentalPriceLabel>TOTAL</RentalPriceLabel>

          <RentalPriceDetails>
            <RentalPriceQuota>
              {`R$ ${car.rent.price} x${dates.length} diárias`}
            </RentalPriceQuota>
            <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
          </RentalPriceDetails>
        </RentalPrice>
      </Content>

      <Footer>
        <Button
          title="Alugar agora"
          color={theme.colors.success}
          onPress={handleConfirmRental}
          enabled={!loading}
          loading={loading}
        />
      </Footer>
    </Container>
  );
}
