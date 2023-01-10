import React from "react";
import { TouchableOpacityProps,ActivityIndicator } from "react-native";
import { Container,Title } from "./styles";
import {useTheme} from 'styled-components';

interface Props extends TouchableOpacityProps{
    title:string;
    color?:string;
    disable?:boolean;
    loading?:boolean;
}

export function Button({title,color,disable = false,loading=false,...rest}:Props){
    const theme = useTheme();
    return(
        <Container {...rest} color={color ? color : theme.colors.main} disabled={disable} style={{opacity: (disable===true || loading === true) ? 0.5 : 1}}>
            {loading
            ? <ActivityIndicator color={theme.colors.shape}/>
            : <Title>{title}</Title>
            }
            
            
        </Container>
    );
}