import express from "express";
import db from "@payvo/db/client";

const app = express();
app.use(express.json());

app.post("/hdfcWebhook", async (req, res) => {
    const paymentInformation = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount,
    };

    try {
        await db.$transaction(async (tx) => {
          
            const balance = await tx.$queryRaw`
                SELECT * FROM "Balance" WHERE "userId" = ${Number(paymentInformation.userId)} FOR UPDATE;
            `;

            
            await tx.balance.updateMany({
                where: { userId: Number(paymentInformation.userId) },
                data: { amount: { increment: Number(paymentInformation.amount) } },
            });

           
            await tx.onRampTransaction.updateMany({
                where: { token: paymentInformation.token },
                data: { status: "Success" },
            });
        });

        res.json({ message: "Captured" });
    } catch (e) {
        console.error(e);
        res.status(411).json({ message: "Error while processing webhook" });
    }
});

app.listen(3001);
