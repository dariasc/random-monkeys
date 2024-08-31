// redirect
import { redirect } from "@sveltejs/kit";

import { Privacy, MonkeyBox, Monkey, MonkeySecrets, User, UserType } from "$lib/model";

import { generateHashes } from "$lib/crypto";

import db from "$lib/db";


export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        console.log(formData);
        const name: any = formData.get("nombre");
        const winners: any = formData.get("numGanadores");
        const ids = formData.get("ids").split("\r\n");
        const parsedIds = ids.filter((id) => id.trim() !== "");
        const idsSet = new Set(parsedIds);
        console.log(idsSet);


        // Fetch the offset values from the form data
        const offsetHours = parseInt(formData.get("offsetHours"), 10); // e.g., "2" for 2 hours
        const offsetMinutes = parseInt(formData.get("offsetMinutes"), 10); // e.g., "30" for 30 minutes
        const timezoneOffset = parseInt(formData.get("timezoneOffset"), 10); // e.g., "-120" for UTC+2

        console.log({ offsetHours, offsetMinutes, timezoneOffset });

        // Calculate the total offset in milliseconds
        const totalOffsetMillis = (offsetHours * 60 + offsetMinutes) * 60 * 1000;

        // Get the current time in Unix timestamp (milliseconds)
        const currentTimeMillis = Date.now();

        // Adjust the publish time by adding the total offset
        const publishTimeMillis = currentTimeMillis + totalOffsetMillis;

        // Convert to seconds and round down to the nearest minute
        const publishAt = Math.floor(publishTimeMillis / 1000);

        console.log({ publishAt });

        const currentTime = Math.floor(currentTimeMillis / 1000);

        console.log({ currentTime });

        // Validate the publish time
        if (publishAt <= currentTime) {
            return {
                success: false,
                error: "Invalid date and time",
            };
        }

        const mbox = MonkeyBox.create(
            name,
            Privacy.Public,
            winners,
            publishAt
        )

        idsSet.forEach(async (id) => {
            const magia = await generateHashes([id]);
            const monkey = Monkey.create(mbox, id, magia[0].hash);
            MonkeySecrets.create(monkey, magia[0].salt);
        })

        const admin = User.create(UserType.Admin, mbox);

        redirect(303, "/lottery/" + mbox.id + "/admin/" + admin.key);

        return {
            success: true,
        }
    },
};