import { Box, Button, MenuItem, Modal, Select, TextField } from "@mui/material"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { ActionTypes, events, FilterTypes } from "../lib/types"
import { addNewEvent, getAllEvents } from "../lib/api"

interface Inputs {
    title: string
    date: string
    time: string
    cover: string
    composer: string
    type: events
}

interface AddEventProps {
    dispatch: React.Dispatch<any>;
    currentFilter: FilterTypes;
}

export const AddEvent = ({ dispatch, currentFilter }: AddEventProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const { register, handleSubmit, reset } = useForm<Inputs>()

    const handleAdd: SubmitHandler<Inputs> = data => {
        const errors: { [key: string]: string[] } = {}

        Object.entries(data).forEach(([key, value]) => {
            if (value === null || value === "") {
                if (!errors[key]) {
                    errors[key] = [];
                }

                errors[key].push(key.charAt(0).toUpperCase() + key.slice(1) + " should have a value")
            }
        });

        if (!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])?$/.test(data.time))) {
            if (!errors["time"]) {
                errors["time"] = [];
            }
            errors["time"].push("Time structure is invalid")
        }

        if (!Object.values(events).includes(data.type as events)) {
            if (!errors["type"]) {
                errors["type"] = [];
            }

            errors["type"].push("Type should be selected from the list")
        }

        if (!(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(data.cover))) {
            if (!errors["cover"]) {
                errors["cover"] = [];
            }

            errors["cover"].push("Cover should be a URL")
        }

        if (!(/^(January|February|March|April|May|June|July|August|September|October|November|December) (0?[1-9]|[12][0-9]|3[01])$/.test(data.date))) {
            if (!errors["date"]) {
                errors["date"] = [];
            }

            errors["date"].push("Date structure is invalid")
        }

        if (Object.keys(errors).length !== 0) {
            console.log(errors)
            throw new Error("Errors occured on submit, please check logs above")
        }

        console.log(data);

        return addNewEvent(data)
            .then(result => {
                console.log("Success")
                console.log(result)
                setOpen(false);
                reset();
                getAllEvents(currentFilter)
                .then(events => {
                  dispatch({ type: ActionTypes.setEvents, payload: events });
                });
                return true;
            })
            .catch(error => {
                console.error("Error adding new event", error);
                return false;
            });
    }

    return <>
        <Box my={2}>
            <Button onClick={() => setOpen(true)} variant="contained">add</Button >
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <form onSubmit={handleSubmit(handleAdd)}>
                        <Box my={2}>
                            <TextField
                                label="title"
                                variant="outlined"
                                {...register("title")}
                            />
                        </Box>
                        <Box my={2}>
                            <TextField
                                label="date"
                                variant="outlined"
                                {...register("date")}
                            />
                        </Box>
                        <Box my={2}>
                            <TextField
                                label="time"
                                variant="outlined"
                                {...register("time")}
                            />
                        </Box>
                        <Box my={2}>
                            <TextField
                                label="composer"
                                variant="outlined"
                                {...register("composer")}
                            />
                        </Box>
                        <Box my={2}>
                            <TextField
                                label="cover"
                                variant="outlined"
                                {...register("cover")}
                            />
                        </Box>
                        <Box my={2}>
                            <Select sx={{ width: 200 }} {...register("type")}>
                                <MenuItem value="opera">opera</MenuItem>
                                <MenuItem value="ballet">ballet</MenuItem>
                            </Select>
                        </Box>
                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                </Box>
            </Modal>
        </Box>
    </>
}