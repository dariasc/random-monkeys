// redirect
import { redirect } from "@sveltejs/kit";

import { Privacy, MonkeyBox, Monkey, MonkeySecrets, User, UserType } from "$lib/model";

import { generateHashes } from "$lib/crypto";

import db from "$lib/db";


export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        console.log(formData);
        const ids = formData.get("ids").split("\r\n");
        const parsedIds = ids.filter((id) => id.trim() !== "");
        const idsSet = new Set(parsedIds);
        console.log(idsSet);
        

        const date = formData.get("date"); // 2021-12-31
        const time = formData.get("time"); // 23:59

        const unixTimestamp = Date.parse(`${date}T${time}:00Z`);
        const publishAt = Math.floor(unixTimestamp / 60000) * 60;

        console.log(publishAt);

        const currentTime = Math.floor(Date.now() / 60000) * 60;

        if (publishAt <= currentTime) {
            return {
                success: false,
                error: "Invalid date and time",
            }
        }

        const mbox = MonkeyBox.create(
            Privacy.Public,
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