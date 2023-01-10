import React, { useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { BackButton } from "../../components/BackButton";
import { Load } from "../../components/Load";
import { CarDTO } from "../../dtos/CarDTO";
import api from "../../services/api";
import { FlatList, StatusBar } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Car } from "../../components/Car";
import {AntDesign} from '@expo/vector-icons';


import { Container,Header,Title,SubTitle,Content,Appointments,AppointmentsTitle,AppointmentsQuantity,CarWrapper,CarFooter,CarFooterTitle,CarFooterPeriod,CarFooterDate } from "./styles";

interface CarProps{
    car:CarDTO;
    id:string;
    user_id:string
    startDate:string;
    endDate:string;
}

export function MyCars(){
    const [cars,setCars] = useState<CarProps[]>([]);
    const [loading,setLoading] = useState(true);
    
    const navigation = useNavigation<any>();
    const theme = useTheme();

    function handleBack(){
        navigation.goBack();
    }
    useEffect(()=>{
        async function fetchCars(){
            try {
                const response = await api.get('/schedules_byuser?user_id=1');
                setCars(response.data);
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }finally{
                setLoading(false);
            }
        }
        
        fetchCars();
    },[]);

    return(
        <Container>
             <Header>
                <StatusBar
                    barStyle="light-content"
                    translucent
                    backgroundColor='transparent'
                />
                <BackButton color={theme.colors.shape} onPress={handleBack}/>
                <Title>
                    Seus Carros agendados
                </Title>
                <SubTitle>Conforto, segurança e praticidade.</SubTitle>
            </Header>
        {loading ? <Load/> : 
            <Content>
                <Appointments>
                    <AppointmentsTitle>Agendamentos feitos</AppointmentsTitle>
                    <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                </Appointments>

                <FlatList data={cars}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({item})=>(
                    <CarWrapper>
                        <Car data={item.car}/>
                        <CarFooter>
                            <CarFooterTitle>Periodo</CarFooterTitle>
                            <CarFooterPeriod>
                                <CarFooterDate>{item.startDate}</CarFooterDate>
                                <AntDesign name="arrowright" size={20} color={theme.colors.title} style={{marginHorizontal:10}} />
                                <CarFooterDate>{item.endDate}</CarFooterDate>
                            </CarFooterPeriod>
                        </CarFooter>
                    </CarWrapper>
                )}/>

            </Content>
        }
        </Container>
    );
}