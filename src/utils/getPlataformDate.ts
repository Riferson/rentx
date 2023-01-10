import { addDays } from "date-fns";
import { Platform } from "react-native";

export function getPlataformDate (date:Date):Date{
   
        return addDays(date,1);
}