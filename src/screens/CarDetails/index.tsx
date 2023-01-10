import React from "react";
import { BackButton } from "../../components/BackButton";
import { ImageSlider } from "../../components/ImageSlider";
import { Accessory } from "../../components/Accessory";
import { Button } from "../../components/Button";

import {getAccessoryIcons} from '../../utils/getAccessoryIcons';

import {Container,Header,CarImage,Content,Details,Descriptions,Brand,Name,Rent,Period,Price,About,Accessories,Footer} from './styles';
import { useNavigation,useRoute } from "@react-navigation/native";
import { CarDTO } from "../../dtos/CarDTO";

interface Params{
    car:CarDTO;
}

export function CarDetails(){
    const navigation = useNavigation<any>();
    const route = useRoute();
    const {car} = route.params as Params;

    function handleConfirmRental(){
        navigation.navigate('Scheduling',{car});
    }

    function handleBack(){
        navigation.goBack();
    }

    return(
        <Container>
            <Header>
                <BackButton onPress = {handleBack}/>
            </Header>
            <CarImage>
                <ImageSlider imageUrl={car.photos} />

            </CarImage>

            <Content>
                <Details>
                    <Descriptions>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Descriptions>

                    <Rent>
                        <Period>{car.rent.period}</Period>
                        <Price>R$ {car.rent.price}</Price>
                    </Rent>
                </Details>

                <Accessories>
                    {
                        car.accessories.map(accessory => (
                            <Accessory 
                                key={accessory.type} 
                                name={accessory.name} 
                                icon={getAccessoryIcons(accessory.type)}
                            />
                        ))
                    }
                    
                </Accessories>

                <About>{car.about}</About>
            </Content>

            <Footer>
                <Button title="Escolher periodo do aluguel" onPress={handleConfirmRental}/>
            </Footer>
        </Container>
    );
}