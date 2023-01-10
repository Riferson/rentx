import React from "react";
import { TouchableOpacity } from "react-native";
import {Container,Title} from './styles';

interface Props extends TouchableOpacity{
    title:string;
}

export function ConfirmButton({title,...rest}:Props){
    return(
        <Container {...rest}>
            <Title>{title}</Title>
        </Container>
    );
}