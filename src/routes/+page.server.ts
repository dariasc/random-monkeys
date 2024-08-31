export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        console.log(formData);
        const ids = formData.get("ids").split("\r\n");
        const parsedIds = ids.filter((id) => id.trim() !== "");
        const idsSet = new Set(parsedIds);
        console.log(idsSet);
        return {
            status: 200,
            body: {
                ids: Array.from(idsSet),
            },
        }
    },
};