"use server";

import {
  ClickEvent,
  LeadEvent,
  SaleEvent,
} from "dub/dist/commonjs/models/components";
import { EventType } from "../analytics/types";
import { dub } from "../dub";

export type ConversionEvent = ClickEvent | LeadEvent | SaleEvent;

export const getEvents = async ({
  linkId,
  event,
  page,
}: {
  linkId: string;
  event: EventType;
  page: number;
}) => {
  return (await dub.events.list({
    linkId,
    event,
    interval: "all",
    page,
  })) as ConversionEvent[];
};
