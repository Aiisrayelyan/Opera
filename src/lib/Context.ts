import React from "react";
import type { IContextType } from "./types";

export const EventContext = React.createContext<IContextType | undefined>(undefined);