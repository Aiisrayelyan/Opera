import axios from "axios";
import { FilterTypes, IEvent } from "./types";

const URL = "http://localhost:3004/events"

export const getAllEvents = async (type: FilterTypes = FilterTypes.all): Promise<IEvent[]> => {

    const repsonse = await axios.get(URL + (type != FilterTypes.all ? "?type=" + type : ""))
    return repsonse.data
}

export const addNewEvent = async (data: Omit<IEvent, 'id'>): Promise<IEvent[]> => {
    const response = await axios.post(URL, data)
    return response.data
}