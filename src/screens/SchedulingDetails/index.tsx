import React, { useEffect, useState } from "react";
import {Feather} from '@expo/vector-icons';
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Accessory } from "../../components/Accessory";
import { Button } from "../../components/Button";
import { format } from "date-fns";


import {Container,Header,CarImage,Content,Details,Descriptions,Brand,Name,Rent,Period,Price,Accessories,Footer,RentalPeriod,CalendarIcon,DateInfo,DateTitle,DateValue,RentalPrice,RentalPriceLabel,RentalPriceQuota,RentalPriceTotal,RentalPriceDetails} from './styles';
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";
import { useNavigation,useRoute } from "@react-navigation/native";
import { CarDTO } from "../../dtos/CarDTO";
import {getAccessoryIcons} from '../../utils/getAccessoryIcons';
import { getPlataformDate } from "../../utils/getPlataformDate";
import api from "../../services/api";
import { Alert } from "react-native";

interface Params{
    car:CarDTO;
    dates:string[];
}
interface RentalPeriod{
    start:string;
    end:string;
}

export function SchedulingDetails(){
    const [rentalPeriod,setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
    const [loading,setLoading] = useState(false);

    const theme = useTheme();
    const navigation = useNavigation<any>();

    const route = useRoute();
    const {car,dates} = route.params as Params;

    const rentTotal = Number(dates.length * car.rent.price);

    async function handleConfirmRental(){
        setLoading(true);
        const schedulesByCar = await api.get(`/schedules_bycars/${car.id}`);

        const unavailable_dates = [
            ...schedulesByCar.data.unavailable_dates,
            ...dates,
        ];

        await api.post('schedules_byuser',{
            user_id:1,
            car,
            startDate:format(getPlataformDate(new Date(dates[0])),'dd-MM-yyyy'),
            endDate:format(getPlataformDate(new Date(dates[dates.length -1])),'dd-MM-yyyy')
        });

        api.put(`/schedules_bycars/${car.id}`,{
            id:car.id,
            unavailable_dates
        })
        .then(() => navigation.navigate('SchedulingComplete'))
        .catch(()=> {
            setLoading(true);
            Alert.alert("Não foi possivel confirmar o agendamento!");
        });




    }
    function handleBack(){
        navigation.goBack();
    }

    useEffect(()=>{
        setRentalPeriod({
            start:format(getPlataformDate(new Date(dates[0])),'dd-MM-yyyy'),
            end:format(getPlataformDate(new Date(dates[dates.length -1])),'dd-MM-yyyy'),
        });
    },[]);
    return(
        <Container>
            <Header>
                <BackButton onPress = {handleBack}/>
            </Header>
            <CarImage>
                <ImageSlider imageUrl={car.photos}/>

            </CarImage>

            <Content>
                <Details>
                    <Descriptions>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Descriptions>

                    <Rent>
                        <Period> {car.rent.period}</Period>
                        <Price>R$ {car.rent.price}</Price>
                    </Rent>
                </Details>

                <Accessories>
                    {
                        car.accessories.map(accessory => (
                            <Accessory key={accessory.type} name={accessory.name} icon={getAccessoryIcons(accessory.type)}/>

                        ))

                    }
                </Accessories>

                
                <RentalPeriod>
                    <CalendarIcon>
                        <Feather name='calendar' size={RFValue(24)} colors={theme.colors.shape}/>
                    </CalendarIcon>
                    <DateInfo>
                        <DateTitle>DE</DateTitle>
                        <DateValue>{rentalPeriod.start}</DateValue>
                    </DateInfo>

                    <Feather name='chevron-right' size={RFValue(10)} colors={theme.colors.text}/>

                    <DateInfo>
                        <DateTitle>ATE</DateTitle>
                        <DateValue>{rentalPeriod.end}</DateValue>
                    </DateInfo>

                </RentalPeriod>
                
                <RentalPrice>
                    <RentalPriceLabel>TOTAL</RentalPriceLabel>
                    <RentalPriceDetails>
                        <RentalPriceQuota>R$ {car.rent.price} x{dates.length} diárias</RentalPriceQuota>
                        <RentalPriceTotal>R$ {rentTotal}</RentalPriceTotal>
                    </RentalPriceDetails>
                </RentalPrice>
            </Content>

            <Footer>
                <Button title="Alugar agora" color={theme.colors.sucess} onPress={handleConfirmRental} disable={loading} loading={loading}/>
            </Footer>
        </Container>
    );
}